import Database from 'better-sqlite3';
import { IN_MEMORY_DATABASE } from '../config/constants.js';
import { SCHEMA_SQL } from './schema.js';

export function createDatabase() {
  const db = new Database(IN_MEMORY_DATABASE);
  db.pragma('foreign_keys = ON');
  db.exec(SCHEMA_SQL);
  return db;
}
