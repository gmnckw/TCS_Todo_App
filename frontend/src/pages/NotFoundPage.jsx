import { Link } from 'react-router-dom';
import { ROUTES } from '../config/constants';

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center">
      <h1 className="text-3xl font-bold text-slate-900">Page not found</h1>
      <p className="text-slate-600">The page you are looking for does not exist.</p>
      <Link to={ROUTES.TASKS} className="text-sm font-medium text-indigo-600 hover:text-indigo-800">
        Go to tasks
      </Link>
    </div>
  );
}
