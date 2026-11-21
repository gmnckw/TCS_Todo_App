import { Navigate, Route, Routes } from 'react-router-dom';
import { ROUTES } from './config/constants';
import ProtectedRoute from './components/routing/ProtectedRoute';
import AppLayout from './layouts/AppLayout';
import LoginPage from './pages/auth/LoginPage';
import NotFoundPage from './pages/NotFoundPage';
import ReportsPage from './pages/reports/ReportsPage';
import TaskDetailPage from './pages/tasks/TaskDetailPage';
import TaskFormPage from './pages/tasks/TaskFormPage';
import TasksPage from './pages/tasks/TasksPage';

export default function App() {
  return (
    <Routes>
      <Route path={ROUTES.LOGIN} element={<LoginPage />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route index element={<Navigate to={ROUTES.TASKS} replace />} />
          <Route path={ROUTES.TASKS} element={<TasksPage />} />
          <Route path={ROUTES.TASK_NEW} element={<TaskFormPage />} />
          <Route path={ROUTES.TASK_DETAIL} element={<TaskDetailPage />} />
          <Route path={ROUTES.TASK_EDIT} element={<TaskFormPage />} />

          <Route element={<ProtectedRoute requireManager />}>
            <Route path={ROUTES.REPORTS} element={<ReportsPage />} />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
