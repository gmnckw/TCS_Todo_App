import { DEFAULT_TASK_PRIORITY, INITIAL_TASK_STATUS } from '../config/constants.js';
import { toTaskResponse } from '../presenters/taskPresenter.js';
import { AppError } from '../utils/AppError.js';
import {
  canDeleteTask,
  canReadTask,
  canUpdateTask,
  isManager,
  resolveAssigneeScope,
} from './taskRules.js';

const TASK_NOT_FOUND_MESSAGE = 'Task not found';
const USER_NOT_FOUND_MESSAGE = 'User not found';
const PAST_DUE_DATE_MESSAGE = 'dueDate cannot be in the past';

export function createTaskService({ taskRepository, userRepository, clock }) {
  function requireTask(id) {
    const task = taskRepository.findById(id);
    if (task === null) {
      throw AppError.notFound(TASK_NOT_FOUND_MESSAGE);
    }
    return task;
  }

  function requireUser(id) {
    if (userRepository.findById(id) === null) {
      throw AppError.notFound(USER_NOT_FOUND_MESSAGE);
    }
  }

  function assertCanAssign(actor, assigneeId) {
    if (assigneeId !== actor.id && !isManager(actor)) {
      throw AppError.forbidden();
    }
  }

  function assertNotPastDue(dueDate) {
    if (Date.parse(dueDate) < clock.now().getTime()) {
      throw AppError.badRequest(PAST_DUE_DATE_MESSAGE, [
        { field: 'dueDate', message: PAST_DUE_DATE_MESSAGE },
      ]);
    }
  }

  function assertCanUpdate(actor, task, changes) {
    if (!canUpdateTask(actor, task, changes)) {
      throw AppError.forbidden();
    }
    if (changes.assigneeId !== undefined && changes.assigneeId !== task.assigneeId) {
      requireUser(changes.assigneeId);
    }
  }

  const now = () => clock.now();

  return {
    create(actor, input) {
      const assigneeId = input.assigneeId ?? actor.id;
      assertCanAssign(actor, assigneeId);
      requireUser(assigneeId);
      assertNotPastDue(input.dueDate);

      const timestamp = now().toISOString();
      const task = taskRepository.create({
        title: input.title,
        description: input.description ?? null,
        priority: input.priority ?? DEFAULT_TASK_PRIORITY,
        status: INITIAL_TASK_STATUS,
        dueDate: input.dueDate,
        assigneeId,
        createdAt: timestamp,
        updatedAt: timestamp,
      });
      return toTaskResponse(task, now());
    },

    list(actor, query) {
      const assigneeId = resolveAssigneeScope(actor, query.assigneeId);
      const tasks = taskRepository.findMany({
        status: query.status,
        priority: query.priority,
        assigneeId,
      });
      return tasks
        .map((task) => toTaskResponse(task, now()))
        .filter((task) => query.isOverdue === undefined || task.isOverdue === query.isOverdue);
    },

    get(actor, id) {
      const task = requireTask(id);
      if (!canReadTask(actor, task)) {
        throw AppError.forbidden();
      }
      return toTaskResponse(task, now());
    },

    update(actor, id, changes) {
      const task = requireTask(id);
      assertCanUpdate(actor, task, changes);
      const updated = taskRepository.update(id, {
        ...changes,
        updatedAt: now().toISOString(),
      });
      return toTaskResponse(updated, now());
    },

    delete(actor, id) {
      const task = requireTask(id);
      if (!canDeleteTask(actor, task)) {
        throw AppError.forbidden();
      }
      taskRepository.delete(id);
    },
  };
}
