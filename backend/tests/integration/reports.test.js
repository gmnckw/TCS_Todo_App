import request from 'supertest';
import {
  API_BASE,
  EMPLOYEE_EMAIL,
  FUTURE_DATE,
  MANAGER_EMAIL,
  authHeader,
  createTestContext,
  loginAs,
} from '../helpers/testApp.js';

describe('Task summary report', () => {
  let app;
  let clock;
  let employee;
  let manager;

  const summary = () => `${API_BASE}/reports/summary`;

  async function createTask(token, body) {
    return request(app).post(`${API_BASE}/tasks`).set(authHeader(token)).send(body);
  }

  beforeEach(async () => {
    ({ app, clock } = await createTestContext());
    employee = await loginAs(app, EMPLOYEE_EMAIL);
    manager = await loginAs(app, MANAGER_EMAIL);

    await createTask(employee.token, { title: 'Open', dueDate: FUTURE_DATE });
    const done = await createTask(employee.token, { title: 'Done', dueDate: FUTURE_DATE });
    await request(app)
      .patch(`${API_BASE}/tasks/${done.body.data.id}`)
      .set(authHeader(employee.token))
      .send({ status: 'COMPLETED' });
    await createTask(manager.token, {
      title: 'Managers',
      dueDate: FUTURE_DATE,
      assigneeId: manager.user.id,
    });
  });

  it('counts all tasks by status and overdue for a manager', async () => {
    const response = await request(app).get(summary()).set(authHeader(manager.token));

    expect(response.status).toBe(200);
    expect(response.body.data).toEqual({
      total: 3,
      overdue: 0,
      byStatus: { TODO: 2, IN_PROGRESS: 0, COMPLETED: 1 },
    });
  });

  it('counts overdue tasks as of the server clock, excluding completed ones', async () => {
    clock.set('2026-08-01T00:00:00.000Z');
    const response = await request(app).get(summary()).set(authHeader(manager.token));

    expect(response.body.data.overdue).toBe(2);
  });

  it('scopes an employee report to their own tasks', async () => {
    const response = await request(app).get(summary()).set(authHeader(employee.token));

    expect(response.body.data).toEqual({
      total: 2,
      overdue: 0,
      byStatus: { TODO: 1, IN_PROGRESS: 0, COMPLETED: 1 },
    });
  });

  it('forbids an employee from requesting another assignee’s report', async () => {
    const response = await request(app)
      .get(`${summary()}?assigneeId=${manager.user.id}`)
      .set(authHeader(employee.token));

    expect(response.status).toBe(403);
  });
});
