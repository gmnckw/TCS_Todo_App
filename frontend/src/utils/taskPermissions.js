import { TASK_STATUS } from '../config/constants';

// Mirrors the API rules so the UI hides actions the server would reject.
// Employees may edit or delete only their own non-completed tasks; managers may act on any task.
// The server remains the source of truth.
export const canModifyTask = (task, user, isManager) => {
  if (isManager) {
    return true;
  }
  const isOwnTask = Boolean(user) && task.assigneeId === user.id;
  return isOwnTask && task.status !== TASK_STATUS.COMPLETED;
};

export const canAssignTasks = (isManager) => isManager;
