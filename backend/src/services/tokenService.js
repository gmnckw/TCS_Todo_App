import jwt from 'jsonwebtoken';
import { JWT_ALGORITHM, JWT_EXPIRES_IN } from '../config/constants.js';
import { AppError } from '../utils/AppError.js';

export function createTokenService(secret) {
  const verifyOptions = { algorithms: [JWT_ALGORITHM] };

  return {
    sign(user) {
      return jwt.sign({ role: user.role }, secret, {
        algorithm: JWT_ALGORITHM,
        subject: String(user.id),
        expiresIn: JWT_EXPIRES_IN,
      });
    },

    /** Returns the authenticated principal, or throws 401 without revealing why. */
    verify(token) {
      try {
        const payload = jwt.verify(token, secret, verifyOptions);
        return { id: Number(payload.sub), role: payload.role };
      } catch {
        throw AppError.unauthorized('Invalid or expired token');
      }
    },
  };
}
