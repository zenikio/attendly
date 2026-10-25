import * as SQLite from 'expo-sqlite';

const openDB = () => SQLite.openDatabaseAsync('subjects.db', { useNewConnection: true });

const setupSchema = async () => {
  const db = await openDB();
  try {
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS subjects (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        value INTEGER NOT NULL,
        total INTEGER NOT NULL,
        attended INTEGER NOT NULL
      );
    `);

    try {
      await db.execAsync('ALTER TABLE subjects ADD COLUMN is_fixed_total INTEGER DEFAULT 0;');
    } catch {
      // column already exists
    }

    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS history (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        subject_id INTEGER NOT NULL,
        date TEXT NOT NULL,
        is_present INTEGER NOT NULL,
        FOREIGN KEY (subject_id) REFERENCES subjects(id)
          ON DELETE CASCADE
      );
    `);
  } finally {
    await db.closeAsync();
  }
};

let schemaReady = null;

const withDB = async (fn) => {
  if (!schemaReady) {
    schemaReady = setupSchema().catch((error) => {
      schemaReady = null;
      throw error;
    });
  }
  await schemaReady;

  const db = await openDB();
  try {
    await db.execAsync('PRAGMA foreign_keys = ON;');
    return await fn(db);
  } finally {
    await db.closeAsync();
  }
};

export const addSubject = (subject) =>
  withDB((db) =>
    db.runAsync(
      'INSERT INTO subjects (name, value, total, attended, is_fixed_total) VALUES (?, ?, ?, ?, ?);',
      [subject.name, subject.value, subject.total, subject.attended, subject.is_fixed_total ? 1 : 0]
    )
  );

export const getAllSubjects = () =>
  withDB((db) => db.getAllAsync('SELECT * FROM subjects;'));

export const updateSubject = (id, updates) => {
  const columns = Object.keys(updates).map((key) => `${key} = ?`).join(', ');
  const values = Object.values(updates).map((val) => (typeof val === 'boolean' ? Number(val) : val));
  return withDB((db) => db.runAsync(`UPDATE subjects SET ${columns} WHERE id = ?`, [...values, id]));
};

export const deleteSubject = (id) =>
  withDB((db) => db.runAsync('DELETE FROM subjects WHERE id = ?;', id));

export const markAttendance = (subjectId, isPresent) => {
  const present = isPresent ? 1 : 0;
  return withDB((db) =>
    db.withTransactionAsync(async () => {
      await db.runAsync(
        `UPDATE subjects SET
           attended = CASE WHEN is_fixed_total = 1 THEN MIN(attended + ?, total) ELSE attended + ? END,
           total = CASE WHEN is_fixed_total = 1 THEN total ELSE total + 1 END
         WHERE id = ?`,
        [present, present, subjectId]
      );
      await db.runAsync(
        'INSERT INTO history (subject_id, date, is_present) VALUES (?, ?, ?);',
        [subjectId, new Date().toISOString(), present]
      );
    })
  );
};

export const getAttendanceHistory = (selectedDate = new Date()) => {
  const startOfDay = new Date(selectedDate);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(selectedDate);
  endOfDay.setHours(23, 59, 59, 999);

  return withDB((db) =>
    db.getAllAsync(
      `SELECT
         h.id AS history_id,
         h.date,
         h.is_present,
         s.id AS subject_id,
         s.name AS subject_name
       FROM history h
       JOIN subjects s ON h.subject_id = s.id
       WHERE h.date BETWEEN ? AND ?
       ORDER BY h.date DESC`,
      [startOfDay.toISOString(), endOfDay.toISOString()]
    )
  );
};

export const getSubjectHistory = (subjectId) =>
  withDB((db) =>
    db.getAllAsync('SELECT * FROM history WHERE subject_id = ? ORDER BY date DESC', [subjectId])
  );

export const deleteHistoryEntry = (historyId) =>
  withDB(async (db) => {
    let updated = null;
    await db.withTransactionAsync(async () => {
      const entry = await db.getFirstAsync('SELECT * FROM history WHERE id = ?', [historyId]);
      if (!entry) return;
      await db.runAsync(
        `UPDATE subjects SET
           attended = MAX(attended - ?, 0),
           total = CASE WHEN is_fixed_total = 1 THEN total ELSE MAX(total - 1, 0) END
         WHERE id = ?`,
        [entry.is_present, entry.subject_id]
      );
      await db.runAsync('UPDATE subjects SET attended = MIN(attended, total) WHERE id = ?', [entry.subject_id]);
      await db.runAsync('DELETE FROM history WHERE id = ?', [historyId]);
      updated = await db.getFirstAsync('SELECT * FROM subjects WHERE id = ?', [entry.subject_id]);
    });
    return updated;
  });
