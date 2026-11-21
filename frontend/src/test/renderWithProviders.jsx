import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const DEFAULT_USER = Object.freeze({ id: 1, name: 'Ana Torres', email: 'ana@example.com', role: 'EMPLOYEE' });

// Renders a component inside a router and an auth context without touching localStorage.
// Pass `user: null` to render as a signed-out visitor.
export function renderWithProviders(
  ui,
  { route = '/', user = DEFAULT_USER, signIn = jest.fn(), signOut = jest.fn() } = {},
) {
  const authValue = {
    token: user ? 'test-token' : null,
    user,
    isAuthenticated: Boolean(user),
    isManager: user?.role === 'MANAGER',
    signIn,
    signOut,
  };
  return render(
    <AuthContext.Provider value={authValue}>
      <MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter>
    </AuthContext.Provider>,
  );
}
