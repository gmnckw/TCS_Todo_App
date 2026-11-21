import { DEFAULT_TASK_PRIORITY, MIN_USER_ID, TASK_PRIORITY, TASK_STATUS } from '../config/constants';

export const MAX_TITLE_LENGTH = 200;
export const MAX_DESCRIPTION_LENGTH = 2000;

export const EMPTY_TASK_FORM = Object.freeze({
  title: '',
  description: '',
  priority: DEFAULT_TASK_PRIORITY,
  status: TASK_STATUS.TODO,
  dueDate: '',
  assigneeId: '',
});

const isPastDate = (value, now) => new Date(value).getTime() < now.getTime();

// Returns { fieldName: message }. An empty object means the form is valid.
// `now` is injectable so the past-date rule is testable.
export const validateTaskForm = (values, { isNew, now = new Date() }) => {
  const errors = {};
  const title = values.title.trim();

  if (!title) {
    errors.title = 'Title is required.';
  } else if (title.length > MAX_TITLE_LENGTH) {
    errors.title = `Title must be ${MAX_TITLE_LENGTH} characters or fewer.`;
  }

  if (values.description.length > MAX_DESCRIPTION_LENGTH) {
    errors.description = `Description must be ${MAX_DESCRIPTION_LENGTH} characters or fewer.`;
  }

  if (!values.priority || !Object.values(TASK_PRIORITY).includes(values.priority)) {
    errors.priority = 'Choose a valid priority.';
  }

  if (!values.dueDate) {
    errors.dueDate = 'Due date is required.';
  } else if (Number.isNaN(new Date(values.dueDate).getTime())) {
    errors.dueDate = 'Due date is not a valid date.';
  } else if (isNew && isPastDate(values.dueDate, now)) {
    errors.dueDate = 'Due date cannot be in the past.';
  }

  if (values.assigneeId !== '' && values.assigneeId !== undefined) {
    const id = Number(values.assigneeId);
    if (!Number.isInteger(id) || id < MIN_USER_ID) {
      errors.assigneeId = 'Assignee must be a positive whole number.';
    }
  }

  return errors;
};

// Builds the request body. Blank optional fields are omitted rather than sent as empty.
export const toTaskPayload = (values, { isNew, isManager }) => {
  const payload = {
    title: values.title.trim(),
    description: values.description.trim() || null,
    priority: values.priority,
    dueDate: new Date(values.dueDate).toISOString(),
  };

  if (!isNew) {
    payload.status = values.status;
  }

  if (isManager && values.assigneeId !== '' && values.assigneeId !== undefined) {
    payload.assigneeId = Number(values.assigneeId);
  }

  return payload;
};

export const taskToFormValues = (task) => ({
  title: task.title,
  description: task.description ?? '',
  priority: task.priority,
  status: task.status,
  dueDate: toDateTimeLocal(task.dueDate),
  assigneeId: String(task.assigneeId),
});

// Converts an ISO timestamp to the "YYYY-MM-DDTHH:mm" value a datetime-local input expects.
const toDateTimeLocal = (isoString) => {
  const date = new Date(isoString);
  const pad = (n) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(
    date.getHours(),
  )}:${pad(date.getMinutes())}`;
};
