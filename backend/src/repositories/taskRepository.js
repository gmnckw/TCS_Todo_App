const TASK_COLUMNS = `
  id,
  title,
  description,
  priority,
  status,
  due_date AS dueDate,
  assignee_id AS assigneeId,
  created_at AS createdAt,
  updated_at AS updatedAt
`;

/** Maps a camelCase field name to its column. Keys come only from this whitelist. */
const COLUMN_BY_FIELD = Object.freeze({
  title: 'title',
  description: 'description',
  priority: 'priority',
  status: 'status',
  dueDate: 'due_date',
  assigneeId: 'assignee_id',
  updatedAt: 'updated_at',
});

const FILTER_COLUMN_BY_FIELD = Object.freeze({
  status: 'status',
  priority: 'priority',
  assigneeId: 'assignee_id',
});

function buildFilterClause(filter) {
  const conditions = [];
  const params = {};
  for (const [field, column] of Object.entries(FILTER_COLUMN_BY_FIELD)) {
    if (filter[field] !== undefined) {
      conditions.push(`${column} = @${field}`);
      params[field] = filter[field];
    }
  }
  const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
  return { where, params };
}

export function createTaskRepository(db) {
  const selectById = db.prepare(`SELECT ${TASK_COLUMNS} FROM tasks WHERE id = @id`);
  const insert = db.prepare(`
    INSERT INTO tasks (title, description, priority, status, due_date, assignee_id, created_at, updated_at)
    VALUES (@title, @description, @priority, @status, @dueDate, @assigneeId, @createdAt, @updatedAt)
  `);
  const remove = db.prepare('DELETE FROM tasks WHERE id = @id');

  return {
    create(task) {
      const { lastInsertRowid } = insert.run(task);
      return selectById.get({ id: lastInsertRowid });
    },

    findById: (id) => selectById.get({ id }) ?? null,

    findMany(filter = {}) {
      const { where, params } = buildFilterClause(filter);
      return db
        .prepare(`SELECT ${TASK_COLUMNS} FROM tasks ${where} ORDER BY id`)
        .all(params);
    },

    update(id, changes) {
      const assignments = Object.keys(changes).map(
        (field) => `${COLUMN_BY_FIELD[field]} = @${field}`,
      );
      db.prepare(`UPDATE tasks SET ${assignments.join(', ')} WHERE id = @id`).run({ ...changes, id });
      return selectById.get({ id });
    },

    delete: (id) => remove.run({ id }).changes > 0,
  };
}
