import { useMemo } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { FLASH_STATE_KEY, ROUTES, taskDetailPath } from '../../config/constants';
import { useAuth } from '../../hooks/useAuth';
import { useTask, useTaskMutations } from '../../hooks/useTasks';
import { canModifyTask } from '../../utils/taskPermissions';
import { EMPTY_TASK_FORM, taskToFormValues, toTaskPayload } from '../../utils/taskValidation';
import Alert from '../../components/common/Alert';
import ErrorState from '../../components/common/ErrorState';
import LoadingState from '../../components/common/LoadingState';
import TaskForm from '../../components/tasks/TaskForm';

const CREATE_TEXT = { heading: 'New task', submit: 'Create task', success: 'Task created.' };
const EDIT_TEXT = { heading: 'Edit task', submit: 'Save changes', success: 'Task updated.' };

// Handles both /tasks/new and /tasks/:taskId/edit; the presence of taskId selects edit mode.
export default function TaskFormPage() {
  const { taskId } = useParams();
  const isNew = !taskId;
  const navigate = useNavigate();
  const { user, isManager } = useAuth();
  const { createTask, updateTask } = useTaskMutations();
  const existing = useTask(isNew ? null : taskId);
  const text = isNew ? CREATE_TEXT : EDIT_TEXT;

  const initialValues = useMemo(
    () => (isNew || !existing.data ? EMPTY_TASK_FORM : taskToFormValues(existing.data)),
    [isNew, existing.data],
  );

  if (!isNew && existing.loading) {
    return <LoadingState label="Loading task…" />;
  }

  if (!isNew && existing.error) {
    return (
      <div className="flex flex-col gap-4">
        <ErrorState message={existing.error.message} onRetry={existing.reload} />
        <Link to={ROUTES.TASKS} className="text-sm font-medium text-indigo-600 hover:text-indigo-800">
          Back to tasks
        </Link>
      </div>
    );
  }

  if (!isNew && !canModifyTask(existing.data, user, isManager)) {
    return (
      <div className="flex flex-col gap-4">
        <Alert variant="error">You do not have permission to edit this task.</Alert>
        <Link to={taskDetailPath(taskId)} className="text-sm font-medium text-indigo-600 hover:text-indigo-800">
          Back to task
        </Link>
      </div>
    );
  }

  const handleSubmit = async (values) => {
    const payload = toTaskPayload(values, { isNew, isManager });
    const saved = isNew ? await createTask(payload) : await updateTask(taskId, payload);
    navigate(taskDetailPath(saved.id), { state: { [FLASH_STATE_KEY]: text.success } });
  };

  const handleCancel = () => navigate(isNew ? ROUTES.TASKS : taskDetailPath(taskId));

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">{text.heading}</h1>
        <p className="text-sm text-slate-600">
          {isNew ? 'Describe the work and when it is due.' : 'Update the details of this task.'}
        </p>
      </div>
      <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <TaskForm
          key={isNew ? 'new' : taskId}
          initialValues={initialValues}
          isNew={isNew}
          isManager={isManager}
          submitLabel={text.submit}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      </div>
    </div>
  );
}
