import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { FLASH_STATE_KEY, ROUTES, taskEditPath } from '../../config/constants';
import { useAuth } from '../../hooks/useAuth';
import { useFlashMessage } from '../../hooks/useFlashMessage';
import { useTask, useTaskMutations } from '../../hooks/useTasks';
import { canModifyTask } from '../../utils/taskPermissions';
import { formatDateTime } from '../../utils/formatters';
import Alert from '../../components/common/Alert';
import ErrorState from '../../components/common/ErrorState';
import LoadingState from '../../components/common/LoadingState';
import { OverdueBadge, PriorityBadge, StatusBadge } from '../../components/common/Badge';

const DETAIL_FIELDS = [
  { key: 'status', label: 'Status', render: (task) => <StatusBadge status={task.status} /> },
  { key: 'priority', label: 'Priority', render: (task) => <PriorityBadge priority={task.priority} /> },
  { key: 'dueDate', label: 'Due', render: (task) => formatDateTime(task.dueDate) },
  { key: 'assigneeId', label: 'Assignee', render: (task) => `User #${task.assigneeId}` },
  { key: 'createdAt', label: 'Created', render: (task) => formatDateTime(task.createdAt) },
  { key: 'updatedAt', label: 'Last updated', render: (task) => formatDateTime(task.updatedAt) },
];

const BUTTON_BASE =
  'rounded-md px-4 py-2 text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60';

export default function TaskDetailPage() {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const { user, isManager } = useAuth();
  const { data: task, error, loading, reload } = useTask(taskId);
  const { deleteTask } = useTaskMutations();
  const flashMessage = useFlashMessage();
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(null);

  const handleDelete = async () => {
    setDeleting(true);
    setDeleteError(null);
    try {
      await deleteTask(taskId);
      navigate(ROUTES.TASKS, { state: { [FLASH_STATE_KEY]: 'Task deleted.' } });
    } catch (apiError) {
      setDeleteError(apiError.message);
      setDeleting(false);
      setConfirmingDelete(false);
    }
  };

  if (loading) {
    return <LoadingState label="Loading task…" />;
  }

  if (error) {
    return (
      <div className="flex flex-col gap-4">
        <ErrorState message={error.message} onRetry={reload} />
        <Link to={ROUTES.TASKS} className="text-sm font-medium text-indigo-600 hover:text-indigo-800">
          Back to tasks
        </Link>
      </div>
    );
  }

  const canEdit = canModifyTask(task, user, isManager);

  return (
    <article className="flex flex-col gap-6">
      <nav aria-label="Breadcrumb">
        <Link to={ROUTES.TASKS} className="text-sm font-medium text-indigo-600 hover:text-indigo-800">
          ← Back to tasks
        </Link>
      </nav>

      {flashMessage && <Alert>{flashMessage}</Alert>}
      {deleteError && <Alert variant="error">{deleteError}</Alert>}

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold text-slate-900">{task.title}</h1>
          {task.isOverdue && <OverdueBadge />}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {canEdit && !confirmingDelete && (
            <>
              <Link
                to={taskEditPath(task.id)}
                className={`${BUTTON_BASE} bg-indigo-600 text-white hover:bg-indigo-700 focus-visible:ring-indigo-500`}
              >
                Edit
              </Link>
              <button
                type="button"
                onClick={() => setConfirmingDelete(true)}
                className={`${BUTTON_BASE} border border-red-300 bg-white text-red-700 hover:bg-red-50 focus-visible:ring-red-500`}
              >
                Delete
              </button>
            </>
          )}
          {confirmingDelete && (
            <div role="group" aria-label="Confirm delete" className="flex items-center gap-3">
              <span className="text-sm text-slate-700">Delete this task?</span>
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className={`${BUTTON_BASE} bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500`}
              >
                {deleting ? 'Deleting…' : 'Yes, delete'}
              </button>
              <button
                type="button"
                onClick={() => setConfirmingDelete(false)}
                disabled={deleting}
                className={`${BUTTON_BASE} border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 focus-visible:ring-indigo-500`}
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>

      {!canEdit && (
        <p className="text-sm text-slate-500">
          This task is read-only for you. Completed tasks can only be changed by a manager.
        </p>
      )}

      <section aria-labelledby="task-details-heading" className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <h2 id="task-details-heading" className="sr-only">
          Task details
        </h2>
        <dl className="grid grid-cols-1 gap-x-8 gap-y-5 sm:grid-cols-2">
          {DETAIL_FIELDS.map(({ key, label, render }) => (
            <div key={key}>
              <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</dt>
              <dd className="mt-1 text-sm text-slate-900">{render(task)}</dd>
            </div>
          ))}
        </dl>
        <div className="mt-6">
          <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">Description</dt>
          <dd className="mt-1 whitespace-pre-wrap text-sm text-slate-900">
            {task.description || <span className="text-slate-500">No description provided.</span>}
          </dd>
        </div>
      </section>
    </article>
  );
}
