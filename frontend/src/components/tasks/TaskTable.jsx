import { Link } from 'react-router-dom';
import { OverdueBadge, PriorityBadge, StatusBadge } from '../common/Badge';
import { formatDateTime } from '../../utils/formatters';
import { taskDetailPath } from '../../config/constants';

const HEADERS = ['Title', 'Status', 'Priority', 'Due', 'Assignee'];

export default function TaskTable({ tasks }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white shadow-sm">
      <table className="min-w-full divide-y divide-slate-200 text-sm">
        <thead className="bg-slate-50">
          <tr>
            {HEADERS.map((header) => (
              <th key={header} scope="col" className="px-4 py-3 text-left font-semibold text-slate-600">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {tasks.map((task) => (
            <tr key={task.id} className="hover:bg-slate-50">
              <td className="px-4 py-3">
                <Link
                  to={taskDetailPath(task.id)}
                  className="font-medium text-indigo-700 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                >
                  {task.title}
                </Link>
                {task.isOverdue && (
                  <span className="ml-2 align-middle">
                    <OverdueBadge />
                  </span>
                )}
              </td>
              <td className="px-4 py-3">
                <StatusBadge status={task.status} />
              </td>
              <td className="px-4 py-3">
                <PriorityBadge priority={task.priority} />
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-slate-700">{formatDateTime(task.dueDate)}</td>
              <td className="px-4 py-3 text-slate-700">#{task.assigneeId}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
