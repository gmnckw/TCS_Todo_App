import express from 'express';
import { createDatabase } from './database/connection.js';
import { createTaskRepository } from './repositories/taskRepository.js';
import { createUserRepository } from './repositories/userRepository.js';
import { createAuthService } from './services/authService.js';
import { createReportService } from './services/reportService.js';
import { createTaskService } from './services/taskService.js';
import { createTokenService } from './services/tokenService.js';
import { seedDemoUsers } from './services/userSeeder.js';
import { createAuthController } from './controllers/authController.js';
import { createReportController } from './controllers/reportController.js';
import { createTaskController } from './controllers/taskController.js';
import { createAuthenticate } from './middleware/authenticate.js';
import { errorHandler } from './middleware/errorHandler.js';
import { notFoundHandler } from './middleware/notFoundHandler.js';
import { createApiRouter } from './routes/index.js';
import { APP_MAJOR_VERSION } from './config/version.js';
import { JSON_BODY_LIMIT } from './config/constants.js';
import { systemClock } from './utils/clock.js';

/**
 * Composition root: wires repositories, services, controllers and routes,
 * then seeds the demo users. Resolves once the app is ready to serve requests.
 */
export async function createApp({ config, clock = systemClock, db = createDatabase() }) {
  const userRepository = createUserRepository(db);
  const taskRepository = createTaskRepository(db);
  const tokenService = createTokenService(config.jwtSecret);

  const services = {
    auth: createAuthService({ userRepository, tokenService }),
    task: createTaskService({ taskRepository, userRepository, clock }),
    report: createReportService({ taskRepository, clock }),
  };
  const controllers = {
    auth: createAuthController(services.auth),
    task: createTaskController(services.task),
    report: createReportController(services.report),
  };

  await seedDemoUsers({
    userRepository,
    seedPassword: config.seedPassword,
    saltRounds: config.bcryptSaltRounds,
  });

  const app = express();
  app.disable('x-powered-by');
  app.use(express.json({ limit: JSON_BODY_LIMIT }));
  app.use(
    `/api/v${APP_MAJOR_VERSION}`,
    createApiRouter({ controllers, authenticate: createAuthenticate(tokenService) }),
  );
  app.use(notFoundHandler);
  app.use(errorHandler);

  return { app, db };
}
