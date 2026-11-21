import { isTaskOverdue } from '../services/taskRules.js';

/** Shapes a stored task into the public API representation. */
export function toTaskResponse(task, now) {
  return {
    id: task.id,
    title: task.title,
    description: task.description,
    priority: task.priority,
    status: task.status,
    dueDate: task.dueDate,
    assigneeId: task.assigneeId,
    isOverdue: isTaskOverdue(task, now),
    createdAt: task.createdAt,
    updatedAt: task.updatedAt,
  };
}
