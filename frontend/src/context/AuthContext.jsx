import { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { ROLES } from '../config/constants';
import { setUnauthorizedHandler } from '../services/apiClient';
import { readStoredAuth, writeStoredAuth } from '../services/authStorage';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(readStoredAuth);

  const signIn = useCallback(({ token, user }) => {
    writeStoredAuth({ token, user });
    setAuth({ token, user });
  }, []);

  const signOut = useCallback(() => {
    writeStoredAuth({ token: null, user: null });
    setAuth({ token: null, user: null });
  }, []);

  useEffect(() => {
    setUnauthorizedHandler(signOut);
  }, [signOut]);

  const value = useMemo(
    () => ({
      token: auth.token,
      user: auth.user,
      isAuthenticated: Boolean(auth.token),
      isManager: auth.user?.role === ROLES.MANAGER,
      signIn,
      signOut,
    }),
    [auth, signIn, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
