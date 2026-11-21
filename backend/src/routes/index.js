import { Router } from 'express';
import { healthRoutes } from './healthRoutes.js';
import { createAuthRoutes } from './authRoutes.js';
import { createTaskRoutes } from './taskRoutes.js';
import { createReportRoutes } from './reportRoutes.js';

/**
 * Public routes: health and login. Everything else requires a valid JWT.
 */
export function createApiRouter({ controllers, authenticate }) {
  const router = Router();
  router.use('/health', healthRoutes);
  router.use('/auth', createAuthRoutes(controllers.auth));
  router.use('/tasks', authenticate, createTaskRoutes(controllers.task));
  router.use('/reports', authenticate, createReportRoutes(controllers.report));
  return router;
}
