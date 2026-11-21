import { VALIDATION_FAILED_MESSAGE } from '../config/constants.js';

const HTTP_BAD_REQUEST = 400;
const HTTP_UNAUTHORIZED = 401;
const HTTP_FORBIDDEN = 403;
const HTTP_NOT_FOUND = 404;

/** Expected, client-facing error. Any other thrown error becomes a generic 500. */
export class AppError extends Error {
  constructor(statusCode, message, errors = []) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
    this.errors = errors;
  }

  static badRequest(message = VALIDATION_FAILED_MESSAGE, errors = []) {
    return new AppError(HTTP_BAD_REQUEST, message, errors);
  }

  static unauthorized(message = 'Authentication required') {
    return new AppError(HTTP_UNAUTHORIZED, message);
  }

  static forbidden(message = 'You are not allowed to perform this action') {
    return new AppError(HTTP_FORBIDDEN, message);
  }

  static notFound(message) {
    return new AppError(HTTP_NOT_FOUND, message);
  }
}
