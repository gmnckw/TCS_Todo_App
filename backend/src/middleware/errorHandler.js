import { INTERNAL_ERROR_MESSAGE } from '../config/constants.js';
import { AppError } from '../utils/AppError.js';
import { sendError } from '../utils/respond.js';

const HTTP_BAD_REQUEST = 400;
const HTTP_PAYLOAD_TOO_LARGE = 413;
const HTTP_INTERNAL_ERROR = 500;

/** Translates body-parser failures into client errors without exposing their internals. */
function fromBodyParserError(err) {
  if (err.type === 'entity.parse.failed') {
    return new AppError(HTTP_BAD_REQUEST, 'Malformed JSON body');
  }
  if (err.type === 'entity.too.large') {
    return new AppError(HTTP_PAYLOAD_TOO_LARGE, 'Request body too large');
  }
  return null;
}

/** Central error handler. Stack traces are logged server-side only, never sent to clients. */
export function errorHandler(err, _req, res, _next) {
  const known = err instanceof AppError ? err : fromBodyParserError(err);
  if (known) {
    return sendError(res, known.statusCode, known.message, known.errors);
  }

  console.error('Unhandled error:', err);
  return sendError(res, HTTP_INTERNAL_ERROR, INTERNAL_ERROR_MESSAGE);
}
