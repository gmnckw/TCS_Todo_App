import { useState } from 'react';
import { MIN_USER_ID, STATUS_LABELS, TASK_STATUS } from '../../config/constants';
import { useReportSummary } from '../../hooks/useReportSummary';
import FormField, { INPUT_CLASSES } from '../../components/common/FormField';
import EmptyState from '../../components/common/EmptyState';
import ErrorState from '../../components/common/ErrorState';
import LoadingState from '../../components/common/LoadingState';

const ALL_TASKS = undefined;

// Returns { assigneeId, error }. A blank input means "all tasks".
const parseAssigneeId = (value) => {
  if (value.trim() === '') {
    return { assigneeId: ALL_TASKS, error: null };
  }
  const id = Number(value);
  if (!Number.isInteger(id) || id < MIN_USER_ID) {
    return { assigneeId: ALL_TASKS, error: `Enter a user ID of ${MIN_USER_ID} or greater.` };
  }
  return { assigneeId: id, error: null };
};

function StatCard({ label, value, tone }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</p>
      <p className={`mt-2 text-3xl font-bold ${tone}`}>{value}</p>
    </div>
  );
}

function SummaryView({ report }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard label="Total tasks" value={report.total} tone="text-slate-900" />
      <StatCard label="Overdue" value={report.overdue} tone="text-red-600" />
      {[TASK_STATUS.TODO, TASK_STATUS.IN_PROGRESS, TASK_STATUS.COMPLETED].map((status) => (
        <StatCard
          key={status}
          label={STATUS_LABELS[status]}
          value={report.byStatus[status]}
          tone="text-indigo-700"
        />
      ))}
    </div>
  );
}

export default function ReportsPage() {
  const [assigneeInput, setAssigneeInput] = useState('');
  const [appliedAssigneeId, setAppliedAssigneeId] = useState(ALL_TASKS);
  const [assigneeError, setAssigneeError] = useState(null);
  const { data: report, error, loading, reload } = useReportSummary(appliedAssigneeId);

  // An invalid ID is reported inline and leaves the currently shown report unchanged.
  const handleApply = (event) => {
    event.preventDefault();
    const parsed = parseAssigneeId(assigneeInput);
    setAssigneeError(parsed.error);
    if (!parsed.error) {
      setAppliedAssigneeId(parsed.assigneeId);
    }
  };

  const handleClear = () => {
    setAssigneeInput('');
    setAssigneeError(null);
    setAppliedAssigneeId(ALL_TASKS);
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Reports</h1>
        <p className="text-sm text-slate-600">Task counts across the team, with an optional assignee filter.</p>
      </div>

      <form
        onSubmit={handleApply}
        noValidate
        aria-label="Report filters"
        className="flex flex-wrap items-end gap-4 rounded-lg border border-slate-200 bg-white p-4 shadow-sm"
      >
        <div className="w-full sm:w-64">
          <FormField
            id="report-assignee"
            label="Assignee user ID"
            error={assigneeError ?? undefined}
            hint="Leave blank to report on all tasks."
          >
            {(a11y) => (
              <input
                type="number"
                min={MIN_USER_ID}
                inputMode="numeric"
                value={assigneeInput}
                onChange={(event) => setAssigneeInput(event.target.value)}
                className={INPUT_CLASSES}
                {...a11y}
              />
            )}
          </FormField>
        </div>
        <div className="flex gap-3">
          <button
            type="submit"
            className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
          >
            Apply
          </button>
          <button
            type="button"
            onClick={handleClear}
            className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
          >
            Clear
          </button>
        </div>
      </form>

      {loading && <LoadingState label="Loading report…" />}

      {!loading && error && <ErrorState message={error.message} onRetry={reload} />}

      {!loading && !error && report?.total === 0 && (
        <EmptyState title="No tasks to report on" description="Once tasks exist, their totals will appear here." />
      )}

      {!loading && !error && report && report.total > 0 && <SummaryView report={report} />}
    </div>
  );
}
