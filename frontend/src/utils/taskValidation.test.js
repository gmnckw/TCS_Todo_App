import { EMPTY_TASK_FORM, MAX_TITLE_LENGTH, toTaskPayload, validateTaskForm } from './taskValidation';

const NOW = new Date('2026-06-01T12:00:00Z');
const FUTURE_DATE = '2026-07-01T10:00';
const PAST_DATE = '2026-05-01T10:00';

const validValues = { ...EMPTY_TASK_FORM, title: 'Write report', dueDate: FUTURE_DATE };

describe('validateTaskForm', () => {
  it('accepts a complete, future-dated task', () => {
    expect(validateTaskForm(validValues, { isNew: true, now: NOW })).toEqual({});
  });

  it('requires a non-blank title', () => {
    const errors = validateTaskForm({ ...validValues, title: '   ' }, { isNew: true, now: NOW });
    expect(errors.title).toBe('Title is required.');
  });

  it('rejects titles longer than the maximum', () => {
    const errors = validateTaskForm(
      { ...validValues, title: 'x'.repeat(MAX_TITLE_LENGTH + 1) },
      { isNew: true, now: NOW },
    );
    expect(errors.title).toMatch(/characters or fewer/);
  });

  it('requires a due date', () => {
    const errors = validateTaskForm({ ...validValues, dueDate: '' }, { isNew: true, now: NOW });
    expect(errors.dueDate).toBe('Due date is required.');
  });

  it('rejects a past due date when creating', () => {
    const errors = validateTaskForm({ ...validValues, dueDate: PAST_DATE }, { isNew: true, now: NOW });
    expect(errors.dueDate).toBe('Due date cannot be in the past.');
  });

  it('allows a past due date when editing an existing task', () => {
    const errors = validateTaskForm({ ...validValues, dueDate: PAST_DATE }, { isNew: false, now: NOW });
    expect(errors.dueDate).toBeUndefined();
  });

  it('rejects a non-positive assignee ID', () => {
    const errors = validateTaskForm({ ...validValues, assigneeId: '0' }, { isNew: true, now: NOW });
    expect(errors.assigneeId).toMatch(/positive whole number/);
  });
});

describe('toTaskPayload', () => {
  it('omits blank description as null and never sends assigneeId for employees', () => {
    const payload = toTaskPayload(
      { ...validValues, description: '  ', assigneeId: '7' },
      { isNew: true, isManager: false },
    );
    expect(payload.description).toBeNull();
    expect(payload).not.toHaveProperty('assigneeId');
    expect(payload).not.toHaveProperty('status');
  });

  it('includes status when editing and assigneeId for managers', () => {
    const payload = toTaskPayload(
      { ...validValues, status: 'IN_PROGRESS', assigneeId: '7' },
      { isNew: false, isManager: true },
    );
    expect(payload.status).toBe('IN_PROGRESS');
    expect(payload.assigneeId).toBe(7);
  });
});
