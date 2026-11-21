import request from 'supertest';
import { API_BASE, EMPLOYEE_EMAIL, createTestContext, loginAs } from '../helpers/testApp.js';

describe('Auth and health', () => {
  let app;

  beforeEach(async () => {
    ({ app } = await createTestContext());
  });

  it('GET health is public and reports ok', async () => {
    const response = await request(app).get(`${API_BASE}/health`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ success: true, message: '', data: { status: 'ok' } });
  });

  it('logs in a seeded user and returns a token without the password hash', async () => {
    const { token, user } = await loginAs(app, EMPLOYEE_EMAIL);

    expect(token).toEqual(expect.any(String));
    expect(user).toEqual({ id: 1, name: 'Ana Torres', email: EMPLOYEE_EMAIL, role: 'EMPLOYEE' });
  });

  it('rejects a wrong password with 401 and a generic message', async () => {
    const response = await request(app)
      .post(`${API_BASE}/auth/login`)
      .send({ email: EMPLOYEE_EMAIL, password: 'wrong-password' });

    expect(response.status).toBe(401);
    expect(response.body).toEqual({ success: false, message: 'Invalid credentials', errors: [] });
  });

  it('rejects an invalid login body with 400', async () => {
    const response = await request(app).post(`${API_BASE}/auth/login`).send({ email: 'not-an-email' });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.errors.length).toBeGreaterThan(0);
  });

  it('rejects malformed JSON with 400 and no internals', async () => {
    const response = await request(app)
      .post(`${API_BASE}/auth/login`)
      .set('Content-Type', 'application/json')
      .send('{"email": ');

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ success: false, message: 'Malformed JSON body', errors: [] });
  });

  it('requires a valid bearer token on protected routes', async () => {
    const missing = await request(app).get(`${API_BASE}/tasks`);
    const invalid = await request(app).get(`${API_BASE}/tasks`).set('Authorization', 'Bearer abc.def.ghi');

    expect(missing.status).toBe(401);
    expect(invalid.status).toBe(401);
    expect(invalid.body.message).toBe('Invalid or expired token');
  });

  it('returns 404 JSON for unknown routes', async () => {
    const response = await request(app).get(`${API_BASE}/unknown`);

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ success: false, message: 'Route not found', errors: [] });
  });
});
