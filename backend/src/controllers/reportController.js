import { sendSuccess } from '../utils/respond.js';

const HTTP_OK = 200;

export function createReportController(reportService) {
  return {
    taskSummary(req, res) {
      const summary = reportService.taskSummary(req.user, req.validated.query.assigneeId);
      sendSuccess(res, HTTP_OK, summary);
    },
  };
}
