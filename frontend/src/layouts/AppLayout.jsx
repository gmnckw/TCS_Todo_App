import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { ROUTES } from '../config/constants';

const NAV_LINK_BASE =
  'rounded-md px-3 py-2 text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500';

const navLinkClass = ({ isActive }) =>
  `${NAV_LINK_BASE} ${isActive ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}`;

export default function AppLayout() {
  const { user, isManager, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = () => {
    signOut();
    navigate(ROUTES.LOGIN, { replace: true });
  };

  return (
    <div className="min-h-screen">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center gap-6">
            <span className="text-lg font-bold text-slate-900">Todo App</span>
            <nav aria-label="Main" className="flex items-center gap-2">
              <NavLink to={ROUTES.TASKS} className={navLinkClass}>
                Tasks
              </NavLink>
              {isManager && (
                <NavLink to={ROUTES.REPORTS} className={navLinkClass}>
                  Reports
                </NavLink>
              )}
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right text-sm">
              <p className="font-medium text-slate-900">{user?.name}</p>
              <p className="text-xs text-slate-500">{isManager ? 'Manager' : 'Employee'}</p>
            </div>
            <button
              type="button"
              onClick={handleSignOut}
              className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
}
