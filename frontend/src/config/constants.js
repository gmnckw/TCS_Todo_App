export const API_BASE_PATH = '/api/v1';
export const AUTH_STORAGE_KEY = 'todo-app.auth';
export const DEFAULT_TASK_PRIORITY = 'MEDIUM';
export const MIN_USER_ID = 1;

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

export const STATUS_LABELS = Object.freeze({
  [TASK_STATUS.TODO]: 'To do',
  [TASK_STATUS.IN_PROGRESS]: 'In progress',
  [TASK_STATUS.COMPLETED]: 'Completed',
});

export const PRIORITY_LABELS = Object.freeze({
  [TASK_PRIORITY.LOW]: 'Low',
  [TASK_PRIORITY.MEDIUM]: 'Medium',
  [TASK_PRIORITY.HIGH]: 'High',
});

export const ROUTES = Object.freeze({
  LOGIN: '/login',
  TASKS: '/tasks',
  TASK_NEW: '/tasks/new',
  TASK_DETAIL: '/tasks/:taskId',
  TASK_EDIT: '/tasks/:taskId/edit',
  REPORTS: '/reports',
});

export const taskDetailPath = (taskId) => `${ROUTES.TASKS}/${taskId}`;
export const taskEditPath = (taskId) => `${ROUTES.TASKS}/${taskId}/edit`;

export const FILTER_ALL = '';
export const OVERDUE_FILTER = Object.freeze({
  ALL: '',
  OVERDUE: 'true',
  NOT_OVERDUE: 'false',
});

export const FLASH_STATE_KEY = 'flash';
