const USER_COLUMNS = 'id, name, email, role, password_hash AS passwordHash';

export function createUserRepository(db) {
  const selectById = db.prepare(`SELECT ${USER_COLUMNS} FROM users WHERE id = ?`);
  const selectByEmail = db.prepare(`SELECT ${USER_COLUMNS} FROM users WHERE email = ?`);
  const insert = db.prepare(
    'INSERT INTO users (name, email, password_hash, role) VALUES (@name, @email, @passwordHash, @role)',
  );

  return {
    findById: (id) => selectById.get(id) ?? null,
    findByEmail: (email) => selectByEmail.get(email) ?? null,
    create: (user) => {
      const { lastInsertRowid } = insert.run(user);
      return selectById.get(lastInsertRowid);
    },
  };
}
