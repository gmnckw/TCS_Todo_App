import { Router } from 'express';
import { validateRequest } from '../middleware/validateRequest.js';
import { taskSummaryQuerySchema } from '../validators/reportValidators.js';

export function createReportRoutes(reportController) {
  const router = Router();
  router.get(
    '/summary',
    validateRequest({ query: taskSummaryQuerySchema }),
    reportController.taskSummary,
  );
  return router;
}
