import request from 'supertest';
import { createApp } from '../../src/app.js';
import { APP_MAJOR_VERSION } from '../../src/config/version.js';
import { DEMO_USERS } from '../../src/config/constants.js';

export const API_BASE = `/api/v${APP_MAJOR_VERSION}`;
export const START_TIME = '2026-06-01T09:00:00.000Z';
export const FUTURE_DATE = '2026-07-01T17:00:00.000Z';
export const PAST_DATE = '2026-05-01T17:00:00.000Z';

const TEST_BCRYPT_SALT_ROUNDS = 4; // bcrypt minimum; keeps the suite fast

const TEST_CONFIG = Object.freeze({
  port: 0,
  jwtSecret: 'test-secret-that-is-at-least-32-characters-long',
  seedPassword: 'test-seed-password',
  bcryptSaltRounds: TEST_BCRYPT_SALT_ROUNDS,
});

const demoEmail = (role) => DEMO_USERS.find((user) => user.role === role).email;
export const EMPLOYEE_EMAIL = demoEmail('EMPLOYEE');
export const MANAGER_EMAIL = demoEmail('MANAGER');

/** Clock whose time can be moved forward in tests. */
export function createFixedClock(isoTime) {
  let current = new Date(isoTime);
  return {
    now: () => new Date(current),
    set: (next) => {
      current = new Date(next);
    },
  };
}

export async function createTestContext(startTime = START_TIME) {
  const clock = createFixedClock(startTime);
  const { app } = await createApp({ config: TEST_CONFIG, clock });
  return { app, clock };
}

export async function loginAs(app, email) {
  const response = await request(app)
    .post(`${API_BASE}/auth/login`)
    .send({ email, password: TEST_CONFIG.seedPassword });
  return { token: response.body.data.token, user: response.body.data.user };
}

export const authHeader = (token) => ({ Authorization: `Bearer ${token}` });
