import { ApiError, fieldErrorsFrom, toApiError } from './apiError';

describe('toApiError', () => {
  it('uses the server envelope message and field errors', () => {
    const error = toApiError({
      response: {
        status: 400,
        data: {
          success: false,
          message: 'Validation failed',
          errors: [{ field: 'title', message: 'title is required' }],
        },
      },
    });
    expect(error).toBeInstanceOf(ApiError);
    expect(error.status).toBe(400);
    expect(error.message).toBe('Validation failed');
    expect(error.errors).toHaveLength(1);
  });

  it('falls back to a connection message when there is no response', () => {
    const error = toApiError({ message: 'Network Error' });
    expect(error.status).toBeNull();
    expect(error.message).toMatch(/Unable to reach the server/);
  });

  it('never exposes raw internals from an unexpected response body', () => {
    const error = toApiError({ response: { status: 500, data: '<html>stack trace</html>' } });
    expect(error.status).toBe(500);
    expect(error.message).toBe('Something went wrong. Please try again.');
  });
});

describe('fieldErrorsFrom', () => {
  it('maps the first message per field', () => {
    const error = new ApiError({
      status: 400,
      errors: [
        { field: 'dueDate', message: 'dueDate cannot be in the past' },
        { field: 'dueDate', message: 'ignored duplicate' },
      ],
    });
    expect(fieldErrorsFrom(error)).toEqual({ dueDate: 'dueDate cannot be in the past' });
  });
});
