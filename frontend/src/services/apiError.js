const DEFAULT_ERROR_MESSAGE = 'Something went wrong. Please try again.';
const NETWORK_ERROR_MESSAGE = 'Unable to reach the server. Check your connection.';

export class ApiError extends Error {
  constructor({ status = null, message = DEFAULT_ERROR_MESSAGE, errors = [] } = {}) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.errors = errors;
  }
}

// Converts any Axios failure into an ApiError using the server's error envelope.
export const toApiError = (error) => {
  if (error instanceof ApiError) {
    return error;
  }
  const response = error?.response;
  if (!response) {
    return new ApiError({ message: NETWORK_ERROR_MESSAGE });
  }
  const body = response.data ?? {};
  return new ApiError({
    status: response.status,
    message: body.message || DEFAULT_ERROR_MESSAGE,
    errors: Array.isArray(body.errors) ? body.errors : [],
  });
};

// Maps per-field server errors ({ field, message }) to { fieldName: message }.
export const fieldErrorsFrom = (apiError) =>
  (apiError?.errors ?? []).reduce((acc, { field, message }) => {
    if (field && !acc[field]) {
      acc[field] = message;
    }
    return acc;
  }, {});
