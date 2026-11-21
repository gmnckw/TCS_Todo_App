import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../config/constants';
import { useTaskList } from '../../hooks/useTasks';
import { useFlashMessage } from '../../hooks/useFlashMessage';
import { DEFAULT_TASK_FILTERS, hasActiveFilters } from '../../utils/taskFilters';
import Alert from '../../components/common/Alert';
import EmptyState from '../../components/common/EmptyState';
import ErrorState from '../../components/common/ErrorState';
import LoadingState from '../../components/common/LoadingState';
import TaskFilters from '../../components/tasks/TaskFilters';
import TaskTable from '../../components/tasks/TaskTable';

export default function TasksPage() {
  const [filters, setFilters] = useState(DEFAULT_TASK_FILTERS);
  const { data: tasks, error, loading, reload } = useTaskList(filters);
  const flashMessage = useFlashMessage();
  const filtered = hasActiveFilters(filters);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Tasks</h1>
          <p className="text-sm text-slate-600">Track what needs doing and what is overdue.</p>
        </div>
        <Link
          to={ROUTES.TASK_NEW}
          className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
        >
          New task
        </Link>
      </div>

      {flashMessage && <Alert>{flashMessage}</Alert>}

      <TaskFilters filters={filters} onChange={setFilters} onReset={() => setFilters(DEFAULT_TASK_FILTERS)} />

      {loading && <LoadingState label="Loading tasks…" />}

      {!loading && error && <ErrorState message={error.message} onRetry={reload} />}

      {!loading && !error && tasks?.length === 0 && (
        <EmptyState
          title={filtered ? 'No tasks match these filters' : 'No tasks yet'}
          description={
            filtered
              ? 'Try clearing or changing the filters.'
              : 'Create your first task to start tracking work.'
          }
          action={
            filtered ? null : (
              <Link to={ROUTES.TASK_NEW} className="text-sm font-medium text-indigo-600 hover:text-indigo-800">
                Create a task
              </Link>
            )
          }
        />
      )}

      {!loading && !error && tasks?.length > 0 && <TaskTable tasks={tasks} />}
    </div>
  );
}
