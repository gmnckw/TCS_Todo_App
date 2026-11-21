import request from 'supertest';
import {
  API_BASE,
  EMPLOYEE_EMAIL,
  FUTURE_DATE,
  MANAGER_EMAIL,
  PAST_DATE,
  authHeader,
  createTestContext,
  loginAs,
} from '../helpers/testApp.js';

describe('Tasks API', () => {
  let app;
  let clock;
  let employee;
  let manager;

  const tasks = () => `${API_BASE}/tasks`;

  async function createTask(token, body) {
    return request(app).post(tasks()).set(authHeader(token)).send(body);
  }

  beforeEach(async () => {
    ({ app, clock } = await createTestContext());
    employee = await loginAs(app, EMPLOYEE_EMAIL);
    manager = await loginAs(app, MANAGER_EMAIL);
  });

  describe('create', () => {
    it('creates a task for the caller with TODO status and MEDIUM priority by default', async () => {
      const response = await createTask(employee.token, { title: 'Write report', dueDate: FUTURE_DATE });

      expect(response.status).toBe(201);
      expect(response.body.data).toMatchObject({
        title: 'Write report',
        description: null,
        priority: 'MEDIUM',
        status: 'TODO',
        dueDate: FUTURE_DATE,
        assigneeId: employee.user.id,
        isOverdue: false,
      });
    });

    it('rejects a due date in the past with 400', async () => {
      const response = await createTask(employee.token, { title: 'Late', dueDate: PAST_DATE });

      expect(response.status).toBe(400);
      expect(response.body.errors).toEqual([
        { field: 'dueDate', message: 'dueDate cannot be in the past' },
      ]);
    });

    it('requires title and dueDate', async () => {
      const response = await createTask(employee.token, { description: 'No title' });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Validation failed');
    });

    it('forbids an employee from assigning a task to someone else', async () => {
      const response = await createTask(employee.token, {
        title: 'Delegate',
        dueDate: FUTURE_DATE,
        assigneeId: manager.user.id,
      });

      expect(response.status).toBe(403);
    });

    it('lets a manager assign a task to another user', async () => {
      const response = await createTask(manager.token, {
        title: 'Assigned',
        dueDate: FUTURE_DATE,
        assigneeId: employee.user.id,
      });

      expect(response.status).toBe(201);
      expect(response.body.data.assigneeId).toBe(employee.user.id);
    });

    it('returns 404 when a manager assigns a task to an unknown user', async () => {
      const response = await createTask(manager.token, {
        title: 'Ghost',
        dueDate: FUTURE_DATE,
        assigneeId: 9999,
      });

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('User not found');
    });

    it('rejects unknown fields such as the server-computed isOverdue', async () => {
      const response = await createTask(employee.token, {
        title: 'Sneaky',
        dueDate: FUTURE_DATE,
        isOverdue: false,
      });

      expect(response.status).toBe(400);
    });
  });

  describe('list and get', () => {
    beforeEach(async () => {
      await createTask(employee.token, { title: 'Mine', dueDate: FUTURE_DATE });
      await createTask(manager.token, {
        title: 'Theirs',
        dueDate: FUTURE_DATE,
        assigneeId: manager.user.id,
      });
    });

    it('returns only the caller’s tasks to an employee', async () => {
      const response = await request(app).get(tasks()).set(authHeader(employee.token));

      expect(response.body.data.map((task) => task.title)).toEqual(['Mine']);
    });

    it('returns all tasks to a manager and supports assigneeId filtering', async () => {
      const all = await request(app).get(tasks()).set(authHeader(manager.token));
      const filtered = await request(app)
        .get(`${tasks()}?assigneeId=${manager.user.id}`)
        .set(authHeader(manager.token));

      expect(all.body.data).toHaveLength(2);
      expect(filtered.body.data.map((task) => task.title)).toEqual(['Theirs']);
    });

    it('forbids an employee from filtering by another assignee', async () => {
      const response = await request(app)
        .get(`${tasks()}?assigneeId=${manager.user.id}`)
        .set(authHeader(employee.token));

      expect(response.status).toBe(403);
    });

    it('filters overdue tasks using the server clock', async () => {
      clock.set('2026-08-01T00:00:00.000Z');
      const response = await request(app)
        .get(`${tasks()}?isOverdue=true`)
        .set(authHeader(manager.token));

      expect(response.body.data.every((task) => task.isOverdue)).toBe(true);
      expect(response.body.data).toHaveLength(2);
    });

    it('rejects an invalid status filter with 400', async () => {
      const response = await request(app)
        .get(`${tasks()}?status=DONE`)
        .set(authHeader(manager.token));

      expect(response.status).toBe(400);
    });

    it('forbids an employee from reading another user’s task', async () => {
      const theirs = (await request(app).get(tasks()).set(authHeader(manager.token))).body.data.find(
        (task) => task.title === 'Theirs',
      );

      const response = await request(app).get(`${tasks()}/${theirs.id}`).set(authHeader(employee.token));

      expect(response.status).toBe(403);
    });

    it('returns 404 for a missing task and 400 for a malformed id', async () => {
      const missing = await request(app).get(`${tasks()}/9999`).set(authHeader(manager.token));
      const malformed = await request(app).get(`${tasks()}/abc`).set(authHeader(manager.token));

      expect(missing.status).toBe(404);
      expect(missing.body.message).toBe('Task not found');
      expect(malformed.status).toBe(400);
    });
  });

  describe('update', () => {
    let taskId;

    beforeEach(async () => {
      const created = await createTask(employee.token, { title: 'Draft', dueDate: FUTURE_DATE });
      taskId = created.body.data.id;
    });

    it('lets an employee update their own task', async () => {
      const response = await request(app)
        .patch(`${tasks()}/${taskId}`)
        .set(authHeader(employee.token))
        .send({ status: 'IN_PROGRESS' });

      expect(response.status).toBe(200);
      expect(response.body.data.status).toBe('IN_PROGRESS');
    });

    it('rejects an empty update with 400', async () => {
      const response = await request(app)
        .patch(`${tasks()}/${taskId}`)
        .set(authHeader(employee.token))
        .send({});

      expect(response.status).toBe(400);
    });

    it('forbids an employee from reassigning their task', async () => {
      const response = await request(app)
        .patch(`${tasks()}/${taskId}`)
        .set(authHeader(employee.token))
        .send({ assigneeId: manager.user.id });

      expect(response.status).toBe(403);
    });

    it('lets a manager reassign a task', async () => {
      const response = await request(app)
        .patch(`${tasks()}/${taskId}`)
        .set(authHeader(manager.token))
        .send({ assigneeId: manager.user.id });

      expect(response.status).toBe(200);
      expect(response.body.data.assigneeId).toBe(manager.user.id);
    });

    it('makes a completed task read-only for an employee', async () => {
      await request(app).patch(`${tasks()}/${taskId}`).set(authHeader(employee.token)).send({ status: 'COMPLETED' });

      const response = await request(app)
        .patch(`${tasks()}/${taskId}`)
        .set(authHeader(employee.token))
        .send({ title: 'Changed' });

      expect(response.status).toBe(403);
    });

    it('lets a manager reopen a completed task by changing its status', async () => {
      await request(app).patch(`${tasks()}/${taskId}`).set(authHeader(employee.token)).send({ status: 'COMPLETED' });

      const response = await request(app)
        .patch(`${tasks()}/${taskId}`)
        .set(authHeader(manager.token))
        .send({ status: 'IN_PROGRESS' });

      expect(response.status).toBe(200);
      expect(response.body.data.status).toBe('IN_PROGRESS');
    });

    it('blocks a manager from editing a completed task without reopening it', async () => {
      await request(app).patch(`${tasks()}/${taskId}`).set(authHeader(employee.token)).send({ status: 'COMPLETED' });

      const response = await request(app)
        .patch(`${tasks()}/${taskId}`)
        .set(authHeader(manager.token))
        .send({ title: 'Changed' });

      expect(response.status).toBe(403);
    });
  });

  describe('delete', () => {
    it('lets an employee delete their own open task', async () => {
      const created = await createTask(employee.token, { title: 'Temp', dueDate: FUTURE_DATE });

      const response = await request(app)
        .delete(`${tasks()}/${created.body.data.id}`)
        .set(authHeader(employee.token));

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ success: true, message: '', data: {} });
    });

    it('forbids an employee from deleting a completed task', async () => {
      const created = await createTask(employee.token, { title: 'Done', dueDate: FUTURE_DATE });
      await request(app)
        .patch(`${tasks()}/${created.body.data.id}`)
        .set(authHeader(employee.token))
        .send({ status: 'COMPLETED' });

      const response = await request(app)
        .delete(`${tasks()}/${created.body.data.id}`)
        .set(authHeader(employee.token));

      expect(response.status).toBe(403);
    });

    it('lets a manager delete any task, including completed ones', async () => {
      const created = await createTask(employee.token, { title: 'Done', dueDate: FUTURE_DATE });
      await request(app)
        .patch(`${tasks()}/${created.body.data.id}`)
        .set(authHeader(employee.token))
        .send({ status: 'COMPLETED' });

      const response = await request(app)
        .delete(`${tasks()}/${created.body.data.id}`)
        .set(authHeader(manager.token));

      expect(response.status).toBe(200);
    });
  });
});
