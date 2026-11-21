export const ROLES = Object.freeze({
  EMPLOYEE: 'EMPLOYEE',
  MANAGER: 'MANAGER',
});

export const TASK_STATUS = Object.freeze({
  TODO: 'TODO',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
});

export const TASK_PRIORITY = Object.freeze({
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
});

export const DEFAULT_TASK_PRIORITY = TASK_PRIORITY.MEDIUM;
export const INITIAL_TASK_STATUS = TASK_STATUS.TODO;

export const DEFAULT_PORT = 4000;
export const MIN_JWT_SECRET_LENGTH = 32;
export const MIN_SEED_PASSWORD_LENGTH = 8;
export const JWT_ALGORITHM = 'HS256';
export const JWT_EXPIRES_IN = '8h';
export const BCRYPT_SALT_ROUNDS = 12;
export const IN_MEMORY_DATABASE = ':memory:';
export const JSON_BODY_LIMIT = '100kb';
export const SUCCESS_MESSAGE = '';
export const VALIDATION_FAILED_MESSAGE = 'Validation failed';
export const INTERNAL_ERROR_MESSAGE = 'Internal server error';

export const DEMO_USERS = Object.freeze([
  { name: 'Ana Torres', email: 'ana.torres@example.com', role: ROLES.EMPLOYEE },
  { name: 'Marco Ruiz', email: 'marco.ruiz@example.com', role: ROLES.MANAGER },
]);
