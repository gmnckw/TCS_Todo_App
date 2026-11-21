import { sendSuccess } from '../utils/respond.js';

const HTTP_OK = 200;

export function getHealth(_req, res) {
  sendSuccess(res, HTTP_OK, { status: 'ok' });
}
