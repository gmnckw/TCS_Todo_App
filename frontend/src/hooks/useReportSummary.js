import { getTaskSummary } from '../services/reportService';
import { useAsync } from './useAsync';

export function useReportSummary(assigneeId) {
  return useAsync(() => getTaskSummary(assigneeId ? { assigneeId } : {}), [assigneeId]);
}
