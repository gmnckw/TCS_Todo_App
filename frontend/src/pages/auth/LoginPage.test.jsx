import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as authService from '../../services/authService';
import { ApiError } from '../../services/apiError';
import { renderWithProviders } from '../../test/renderWithProviders';
import LoginPage from './LoginPage';

jest.mock('../../services/authService');

const renderSignedOut = () => renderWithProviders(<LoginPage />, { route: '/login', user: null });

describe('LoginPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('shows validation errors without calling the API', async () => {
    renderSignedOut();

    await userEvent.click(screen.getByRole('button', { name: 'Sign in' }));

    expect(await screen.findByText('Enter a valid email address.')).toBeInTheDocument();
    expect(screen.getByText('Password is required.')).toBeInTheDocument();
    expect(authService.login).not.toHaveBeenCalled();
  });

  it('shows the server error message when credentials are rejected', async () => {
    authService.login.mockRejectedValue(new ApiError({ status: 401, message: 'Invalid credentials' }));
    renderSignedOut();

    await userEvent.type(screen.getByLabelText('Email'), 'ana@example.com');
    await userEvent.type(screen.getByLabelText('Password'), 'wrong-password');
    await userEvent.click(screen.getByRole('button', { name: 'Sign in' }));

    expect(await screen.findByRole('alert')).toHaveTextContent('Invalid credentials');
  });
});
