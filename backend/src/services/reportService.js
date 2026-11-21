import { TASK_STATUS } from '../config/constants.js';
import { isTaskOverdue, resolveAssigneeScope } from './taskRules.js';

const emptyByStatus = () =>
  Object.fromEntries(Object.values(TASK_STATUS).map((status) => [status, 0]));

export function createReportService({ taskRepository, clock }) {
  return {
    taskSummary(actor, requestedAssigneeId) {
      const assigneeId = resolveAssigneeScope(actor, requestedAssigneeId);
      const tasks = taskRepository.findMany({ assigneeId });
      const now = clock.now();

      const summary = { total: tasks.length, overdue: 0, byStatus: emptyByStatus() };
      for (const task of tasks) {
        summary.byStatus[task.status] += 1;
        if (isTaskOverdue(task, now)) {
          summary.overdue += 1;
        }
      }
      return summary;
    },
  };
}
