import { ROLES, TASK_STATUS } from '../config/constants.js';
import { AppError } from '../utils/AppError.js';

export const isManager = (actor) => actor.role === ROLES.MANAGER;
export const isOwner = (actor, task) => task.assigneeId === actor.id;
export const isCompleted = (task) => task.status === TASK_STATUS.COMPLETED;

/** A task is overdue when it is not completed and its due date has passed. */
export function isTaskOverdue(task, now) {
  return !isCompleted(task) && Date.parse(task.dueDate) < now.getTime();
}

const isReassignment = (task, changes) =>
  changes.assigneeId !== undefined && changes.assigneeId !== task.assigneeId;

const isReopening = (changes) =>
  changes.status !== undefined && changes.status !== TASK_STATUS.COMPLETED;

export const canReadTask = (actor, task) => isManager(actor) || isOwner(actor, task);

export const canDeleteTask = (actor, task) =>
  isManager(actor) || (isOwner(actor, task) && !isCompleted(task));

/**
 * Employees may edit only their own open tasks and may not reassign them.
 * Managers may edit any task; a completed task is writable by managers only when reopened.
 */
export function canUpdateTask(actor, task, changes) {
  if (isManager(actor)) {
    return !isCompleted(task) || isReopening(changes);
  }
  return isOwner(actor, task) && !isCompleted(task) && !isReassignment(task, changes);
}

/**
 * Resolves which assignee a list/report query is scoped to.
 * Employees are always scoped to themselves; asking for anyone else is forbidden.
 * Returns undefined when a manager requested no assignee filter (all tasks).
 * Throws 403 when an employee asks for another user's tasks.
 */
export function resolveAssigneeScope(actor, requestedAssigneeId) {
  if (isManager(actor)) {
    return requestedAssigneeId;
  }
  if (requestedAssigneeId !== undefined && requestedAssigneeId !== actor.id) {
    throw AppError.forbidden();
  }
  return actor.id;
}
