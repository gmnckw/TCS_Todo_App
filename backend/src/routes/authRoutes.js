import { Router } from 'express';
import { loginBodySchema } from '../validators/authValidators.js';
import { validateRequest } from '../middleware/validateRequest.js';

export function createAuthRoutes(authController) {
  const router = Router();
  router.post('/login', validateRequest({ body: loginBodySchema }), authController.login);
  return router;
}
