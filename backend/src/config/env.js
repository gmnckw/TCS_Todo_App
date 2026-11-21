import { z } from 'zod';
import {
  BCRYPT_SALT_ROUNDS,
  DEFAULT_PORT,
  MIN_JWT_SECRET_LENGTH,
  MIN_SEED_PASSWORD_LENGTH,
} from './constants.js';

const envSchema = z.object({
  PORT: z.coerce.number().int().min(1).max(65535).default(DEFAULT_PORT),
  JWT_SECRET: z.string().min(MIN_JWT_SECRET_LENGTH),
  SEED_PASSWORD: z.string().min(MIN_SEED_PASSWORD_LENGTH),
});

/**
 * Reads and validates runtime configuration from environment variables.
 * Error messages name the offending variables but never echo their values.
 */
export function loadConfig(env = process.env) {
  const parsed = envSchema.safeParse(env);
  if (!parsed.success) {
    const invalid = parsed.error.issues.map((issue) => issue.path.join('.'));
    throw new Error(`Invalid environment configuration: ${invalid.join(', ')}`);
  }

  return {
    port: parsed.data.PORT,
    jwtSecret: parsed.data.JWT_SECRET,
    seedPassword: parsed.data.SEED_PASSWORD,
    bcryptSaltRounds: BCRYPT_SALT_ROUNDS,
  };
}
