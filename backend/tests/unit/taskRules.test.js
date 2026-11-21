import { ROLES, TASK_STATUS } from '../../src/config/constants.js';
import {
  canDeleteTask,
  canReadTask,
  canUpdateTask,
  isTaskOverdue,
  resolveAssigneeScope,
} from '../../src/services/taskRules.js';
import { AppError } from '../../src/utils/AppError.js';

const employee = { id: 1, role: ROLES.EMPLOYEE };
const manager = { id: 2, role: ROLES.MANAGER };
const openTask = { id: 10, assigneeId: 1, status: TASK_STATUS.TODO, dueDate: '2026-06-10T00:00:00.000Z' };
const completedTask = { ...openTask, status: TASK_STATUS.COMPLETED };
const NOW = new Date('2026-06-05T00:00:00.000Z');

describe('isTaskOverdue', () => {
  it('is true when the task is open and its due date has passed', () => {
    expect(isTaskOverdue({ ...openTask, dueDate: '2026-06-01T00:00:00.000Z' }, NOW)).toBe(true);
  });

  it('is false when the due date is still in the future', () => {
    expect(isTaskOverdue(openTask, NOW)).toBe(false);
  });

  it('is false for a completed task even if its due date has passed', () => {
    expect(isTaskOverdue({ ...completedTask, dueDate: '2026-06-01T00:00:00.000Z' }, NOW)).toBe(false);
  });
});

describe('canUpdateTask', () => {
  it('lets an employee update their own open task', () => {
    expect(canUpdateTask(employee, openTask, { title: 'New' })).toBe(true);
  });

  it('blocks an employee from updating a task assigned to someone else', () => {
    expect(canUpdateTask(employee, { ...openTask, assigneeId: 99 }, { title: 'New' })).toBe(false);
  });

  it('blocks an employee from reassigning their own task', () => {
    expect(canUpdateTask(employee, openTask, { assigneeId: 2 })).toBe(false);
  });

  it('blocks an employee from editing a completed task', () => {
    expect(canUpdateTask(employee, completedTask, { title: 'New' })).toBe(false);
  });

  it('lets a manager edit an open task of any assignee', () => {
    expect(canUpdateTask(manager, { ...openTask, assigneeId: 99 }, { assigneeId: 1 })).toBe(true);
  });

  it('blocks a manager from editing a completed task unless they reopen it', () => {
    expect(canUpdateTask(manager, completedTask, { title: 'New' })).toBe(false);
    expect(canUpdateTask(manager, completedTask, { status: TASK_STATUS.COMPLETED })).toBe(false);
    expect(canUpdateTask(manager, completedTask, { status: TASK_STATUS.IN_PROGRESS })).toBe(true);
  });
});

describe('canDeleteTask and canReadTask', () => {
  it('allows an employee to delete only their own open task', () => {
    expect(canDeleteTask(employee, openTask)).toBe(true);
    expect(canDeleteTask(employee, completedTask)).toBe(false);
    expect(canDeleteTask(employee, { ...openTask, assigneeId: 99 })).toBe(false);
  });

  it('allows a manager to delete and read any task', () => {
    expect(canDeleteTask(manager, completedTask)).toBe(true);
    expect(canReadTask(manager, { ...openTask, assigneeId: 99 })).toBe(true);
  });

  it('lets an employee read only their own task', () => {
    expect(canReadTask(employee, openTask)).toBe(true);
    expect(canReadTask(employee, { ...openTask, assigneeId: 99 })).toBe(false);
  });
});

describe('resolveAssigneeScope', () => {
  it('scopes an employee to themselves when no assignee is requested', () => {
    expect(resolveAssigneeScope(employee, undefined)).toBe(employee.id);
  });

  it('forbids an employee from requesting another assignee', () => {
    expect(() => resolveAssigneeScope(employee, 99)).toThrow(AppError);
  });

  it('returns the requested assignee for a manager, or undefined for all tasks', () => {
    expect(resolveAssigneeScope(manager, 1)).toBe(1);
    expect(resolveAssigneeScope(manager, undefined)).toBeUndefined();
  });
});
