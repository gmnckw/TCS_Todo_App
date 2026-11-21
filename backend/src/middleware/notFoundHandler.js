import { sendError } from '../utils/respond.js';

const HTTP_NOT_FOUND = 404;

export function notFoundHandler(_req, res) {
  sendError(res, HTTP_NOT_FOUND, 'Route not found');
}
