import { FILTER_ALL, OVERDUE_FILTER, PRIORITY_LABELS, STATUS_LABELS } from '../../config/constants';
import { INPUT_CLASSES } from '../common/FormField';
import { hasActiveFilters } from '../../utils/taskFilters';

const OVERDUE_OPTIONS = [
  { value: OVERDUE_FILTER.ALL, label: 'Any due date' },
  { value: OVERDUE_FILTER.OVERDUE, label: 'Overdue only' },
  { value: OVERDUE_FILTER.NOT_OVERDUE, label: 'Not overdue' },
];

const toOptions = (labels) =>
  Object.entries(labels).map(([value, label]) => ({ value, label }));

function FilterSelect({ id, label, value, options, onChange }) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-xs font-medium uppercase tracking-wide text-slate-500">
        {label}
      </label>
      <select id={id} value={value} onChange={(event) => onChange(event.target.value)} className={INPUT_CLASSES}>
        <option value={FILTER_ALL}>All</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export default function TaskFilters({ filters, onChange, onReset }) {
  const update = (key) => (value) => onChange({ ...filters, [key]: value });

  return (
    <section aria-labelledby="task-filters-heading" className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <h2 id="task-filters-heading" className="text-sm font-semibold text-slate-800">
          Filters
        </h2>
        <button
          type="button"
          onClick={onReset}
          disabled={!hasActiveFilters(filters)}
          className="text-sm font-medium text-indigo-600 hover:text-indigo-800 disabled:cursor-not-allowed disabled:text-slate-400"
        >
          Clear filters
        </button>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <FilterSelect
          id="filter-status"
          label="Status"
          value={filters.status}
          options={toOptions(STATUS_LABELS)}
          onChange={update('status')}
        />
        <FilterSelect
          id="filter-priority"
          label="Priority"
          value={filters.priority}
          options={toOptions(PRIORITY_LABELS)}
          onChange={update('priority')}
        />
        <FilterSelect
          id="filter-overdue"
          label="Overdue"
          value={filters.isOverdue}
          options={OVERDUE_OPTIONS.filter((option) => option.value !== FILTER_ALL)}
          onChange={update('isOverdue')}
        />
      </div>
    </section>
  );
}
