import { SUCCESS_MESSAGE } from '../config/constants.js';

export function sendSuccess(res, statusCode, data = {}, message = SUCCESS_MESSAGE) {
  res.status(statusCode).json({ success: true, message, data });
}

export function sendError(res, statusCode, message, errors = []) {
  res.status(statusCode).json({ success: false, message, errors });
}
