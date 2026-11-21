import { AppError } from '../utils/AppError.js';

const BEARER_SCHEME = 'Bearer';

export function createAuthenticate(tokenService) {
  return function authenticate(req, _res, next) {
    const [scheme, token] = (req.headers.authorization ?? '').split(' ');
    if (scheme !== BEARER_SCHEME || !token) {
      return next(AppError.unauthorized());
    }
    req.user = tokenService.verify(token);
    next();
  };
}
