import { useState } from 'react';
import { MIN_USER_ID, PRIORITY_LABELS, STATUS_LABELS } from '../../config/constants';
import FormField, { INPUT_CLASSES } from '../common/FormField';
import Alert from '../common/Alert';
import { MAX_DESCRIPTION_LENGTH, MAX_TITLE_LENGTH, validateTaskForm } from '../../utils/taskValidation';
import { fieldErrorsFrom } from '../../services/apiError';

const toOptions = (labels) => Object.entries(labels).map(([value, label]) => ({ value, label }));

const EDIT_STATUS_OPTIONS = toOptions(STATUS_LABELS);
const PRIORITY_OPTIONS = toOptions(PRIORITY_LABELS);

export default function TaskForm({
  initialValues,
  isNew,
  isManager,
  submitLabel,
  onSubmit,
  onCancel,
}) {
  const [values, setValues] = useState(initialValues);
  const [fieldErrors, setFieldErrors] = useState({});
  const [serverError, setServerError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const setField = (name) => (event) => {
    const { value } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const errors = validateTaskForm(values, { isNew });
    setServerError(null);
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }
    setFieldErrors({});
    setSubmitting(true);
    try {
      await onSubmit(values);
    } catch (apiError) {
      setServerError(apiError.message);
      setFieldErrors(fieldErrorsFrom(apiError));
    } finally {
      setSubmitting(false);
    }
  };

  const inputProps = (name) => ({ name, disabled: submitting, onChange: setField(name) });

  return (
    <form onSubmit={handleSubmit} noValidate aria-busy={submitting} className="flex flex-col gap-5">
      {serverError && <Alert variant="error">{serverError}</Alert>}

      <FormField id="task-title" label="Title" error={fieldErrors.title} hint={`Up to ${MAX_TITLE_LENGTH} characters.`}>
        {(a11y) => (
          <input
            type="text"
            value={values.title}
            maxLength={MAX_TITLE_LENGTH}
            required
            className={INPUT_CLASSES}
            {...a11y}
            {...inputProps('title')}
          />
        )}
      </FormField>

      <FormField id="task-description" label="Description" error={fieldErrors.description}>
        {(a11y) => (
          <textarea
            rows={4}
            value={values.description}
            maxLength={MAX_DESCRIPTION_LENGTH}
            className={INPUT_CLASSES}
            {...a11y}
            {...inputProps('description')}
          />
        )}
      </FormField>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <FormField id="task-priority" label="Priority" error={fieldErrors.priority}>
          {(a11y) => (
            <select value={values.priority} className={INPUT_CLASSES} {...a11y} {...inputProps('priority')}>
              {PRIORITY_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          )}
        </FormField>

        {!isNew && (
          <FormField id="task-status" label="Status" error={fieldErrors.status}>
            {(a11y) => (
              <select value={values.status} className={INPUT_CLASSES} {...a11y} {...inputProps('status')}>
                {EDIT_STATUS_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            )}
          </FormField>
        )}
      </div>

      <FormField
        id="task-due-date"
        label="Due date"
        error={fieldErrors.dueDate}
        hint={isNew ? 'Must not be in the past.' : null}
      >
        {(a11y) => (
          <input
            type="datetime-local"
            value={values.dueDate}
            required
            className={INPUT_CLASSES}
            {...a11y}
            {...inputProps('dueDate')}
          />
        )}
      </FormField>

      {isManager && (
        <FormField
          id="task-assignee"
          label="Assignee user ID"
          error={fieldErrors.assigneeId}
          hint="Leave blank to assign the task to yourself."
        >
          {(a11y) => (
            <input
              type="number"
              min={MIN_USER_ID}
              inputMode="numeric"
              value={values.assigneeId}
              className={INPUT_CLASSES}
              {...a11y}
              {...inputProps('assigneeId')}
            />
          )}
        </FormField>
      )}

      <div className="flex items-center justify-end gap-3 border-t border-slate-200 pt-5">
        <button
          type="button"
          onClick={onCancel}
          disabled={submitting}
          className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-60"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? 'Saving…' : submitLabel}
        </button>
      </div>
    </form>
  );
}
