import bcrypt from 'bcryptjs';
import { AppError } from '../utils/AppError.js';

const INVALID_CREDENTIALS_MESSAGE = 'Invalid credentials';

export function createAuthService({ userRepository, tokenService }) {
  return {
    async login(email, password) {
      const user = userRepository.findByEmail(email);
      const passwordMatches = user !== null && (await bcrypt.compare(password, user.passwordHash));
      if (!passwordMatches) {
        throw AppError.unauthorized(INVALID_CREDENTIALS_MESSAGE);
      }

      return {
        token: tokenService.sign(user),
        user: { id: user.id, name: user.name, email: user.email, role: user.role },
      };
    },
  };
}
