import { ROLES, TASK_PRIORITY, TASK_STATUS } from '../config/constants.js';

const sqlList = (values) => values.map((value) => `'${value}'`).join(', ');

export const SCHEMA_SQL = `
CREATE TABLE IF NOT EXISTS users (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  name          TEXT NOT NULL,
  email         TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role          TEXT NOT NULL CHECK (role IN (${sqlList(Object.values(ROLES))}))
);

CREATE TABLE IF NOT EXISTS tasks (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  title       TEXT NOT NULL,
  description TEXT,
  priority    TEXT NOT NULL CHECK (priority IN (${sqlList(Object.values(TASK_PRIORITY))})),
  status      TEXT NOT NULL CHECK (status IN (${sqlList(Object.values(TASK_STATUS))})),
  due_date    TEXT NOT NULL,
  assignee_id INTEGER NOT NULL REFERENCES users (id),
  created_at  TEXT NOT NULL,
  updated_at  TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_tasks_assignee_id ON tasks (assignee_id);
`;
