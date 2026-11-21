import { Router } from 'express';
import { validateRequest } from '../middleware/validateRequest.js';
import { idParamsSchema } from '../validators/commonValidators.js';
import {
  taskCreateBodySchema,
  taskListQuerySchema,
  taskUpdateBodySchema,
} from '../validators/taskValidators.js';

export function createTaskRoutes(taskController) {
  const router = Router();
  const byId = validateRequest({ params: idParamsSchema });

  router.get('/', validateRequest({ query: taskListQuerySchema }), taskController.list);
  router.post('/', validateRequest({ body: taskCreateBodySchema }), taskController.create);
  router.get('/:id', byId, taskController.get);
  router.patch(
    '/:id',
    validateRequest({ params: idParamsSchema, body: taskUpdateBodySchema }),
    taskController.update,
  );
  router.delete('/:id', byId, taskController.delete);

  return router;
}
