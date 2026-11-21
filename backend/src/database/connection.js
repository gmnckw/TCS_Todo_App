import { DatabaseSync } from 'node:sqlite';
import { IN_MEMORY_DATABASE } from '../config/constants.js';
import { SCHEMA_SQL } from './schema.js';

export function createDatabase() {
  const db = new DatabaseSync(IN_MEMORY_DATABASE, { enableForeignKeyConstraints: true });
  db.exec(SCHEMA_SQL);
  return db;
}
