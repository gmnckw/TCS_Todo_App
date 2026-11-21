import { useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { ROUTES, FLASH_STATE_KEY } from '../../config/constants';
import { useAuth } from '../../hooks/useAuth';
import { useLogin } from '../../hooks/useLogin';
import Alert from '../../components/common/Alert';
import FormField, { INPUT_CLASSES } from '../../components/common/FormField';
import { fieldErrorsFrom } from '../../services/apiError';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const validateCredentials = ({ email, password }) => {
  const errors = {};
  if (!EMAIL_PATTERN.test(email.trim())) {
    errors.email = 'Enter a valid email address.';
  }
  if (!password) {
    errors.password = 'Password is required.';
  }
  return errors;
};

export default function LoginPage() {
  const { isAuthenticated } = useAuth();
  const { submit, submitting, error } = useLogin();
  const navigate = useNavigate();
  const location = useLocation();
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [fieldErrors, setFieldErrors] = useState({});

  if (isAuthenticated) {
    return <Navigate to={ROUTES.TASKS} replace />;
  }

  const handleChange = (name) => (event) => {
    setCredentials((prev) => ({ ...prev, [name]: event.target.value }));
    setFieldErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const errors = validateCredentials(credentials);
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) {
      return;
    }
    try {
      const user = await submit({ email: credentials.email.trim(), password: credentials.password });
      const destination = location.state?.from ?? ROUTES.TASKS;
      navigate(destination, { replace: true, state: { [FLASH_STATE_KEY]: `Welcome back, ${user.name}.` } });
    } catch (apiError) {
      setFieldErrors(fieldErrorsFrom(apiError));
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-900">Sign in</h1>
        <p className="mt-1 text-sm text-slate-600">Use your work email to access your tasks.</p>

        <form onSubmit={handleSubmit} noValidate aria-busy={submitting} className="mt-6 flex flex-col gap-5">
          {error && <Alert variant="error">{error.message}</Alert>}

          <FormField id="login-email" label="Email" error={fieldErrors.email}>
            {(a11y) => (
              <input
                type="email"
                name="email"
                autoComplete="email"
                value={credentials.email}
                disabled={submitting}
                onChange={handleChange('email')}
                className={INPUT_CLASSES}
                {...a11y}
              />
            )}
          </FormField>

          <FormField id="login-password" label="Password" error={fieldErrors.password}>
            {(a11y) => (
              <input
                type="password"
                name="password"
                autoComplete="current-password"
                value={credentials.password}
                disabled={submitting}
                onChange={handleChange('password')}
                className={INPUT_CLASSES}
                {...a11y}
              />
            )}
          </FormField>

          <button
            type="submit"
            disabled={submitting}
            className="rounded-md bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  );
}
