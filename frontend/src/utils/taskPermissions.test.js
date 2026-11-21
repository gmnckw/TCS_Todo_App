import { canModifyTask } from './taskPermissions';

const EMPLOYEE = { id: 1, role: 'EMPLOYEE' };
const ownTask = { assigneeId: 1, status: 'TODO' };
const otherTask = { assigneeId: 2, status: 'TODO' };
const ownCompletedTask = { assigneeId: 1, status: 'COMPLETED' };

describe('canModifyTask', () => {
  it('lets an employee modify their own open task', () => {
    expect(canModifyTask(ownTask, EMPLOYEE, false)).toBe(true);
  });

  it('blocks an employee from another user’s task', () => {
    expect(canModifyTask(otherTask, EMPLOYEE, false)).toBe(false);
  });

  it('blocks an employee from a completed task even when it is theirs', () => {
    expect(canModifyTask(ownCompletedTask, EMPLOYEE, false)).toBe(false);
  });

  it('lets a manager modify any task, including completed ones', () => {
    expect(canModifyTask(otherTask, null, true)).toBe(true);
    expect(canModifyTask(ownCompletedTask, null, true)).toBe(true);
  });
});
