import { useCallback, useState } from 'react';
import { login } from '../services/authService';
import { useAuth } from './useAuth';

export function useLogin() {
  const { signIn } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const submit = useCallback(
    async (credentials) => {
      setSubmitting(true);
      setError(null);
      try {
        const { token, user } = await login(credentials);
        signIn({ token, user });
        return user;
      } catch (apiError) {
        setError(apiError);
        throw apiError;
      } finally {
        setSubmitting(false);
      }
    },
    [signIn],
  );

  return { submit, submitting, error };
}
