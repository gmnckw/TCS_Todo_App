import { PRIORITY_LABELS, STATUS_LABELS, TASK_PRIORITY, TASK_STATUS } from '../../config/constants';

const STATUS_CLASSES = Object.freeze({
  [TASK_STATUS.TODO]: 'bg-slate-200 text-slate-800',
  [TASK_STATUS.IN_PROGRESS]: 'bg-blue-100 text-blue-800',
  [TASK_STATUS.COMPLETED]: 'bg-green-100 text-green-800',
});

const PRIORITY_CLASSES = Object.freeze({
  [TASK_PRIORITY.LOW]: 'bg-slate-100 text-slate-700',
  [TASK_PRIORITY.MEDIUM]: 'bg-amber-100 text-amber-800',
  [TASK_PRIORITY.HIGH]: 'bg-red-100 text-red-800',
});

const BADGE_BASE = 'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium';

export function StatusBadge({ status }) {
  return <span className={`${BADGE_BASE} ${STATUS_CLASSES[status]}`}>{STATUS_LABELS[status]}</span>;
}

export function PriorityBadge({ priority }) {
  return (
    <span className={`${BADGE_BASE} ${PRIORITY_CLASSES[priority]}`}>{PRIORITY_LABELS[priority]}</span>
  );
}

export function OverdueBadge() {
  return <span className={`${BADGE_BASE} bg-red-600 text-white`}>Overdue</span>;
}
