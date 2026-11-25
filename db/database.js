const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'tasks.db');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error connecting to SQLite database:', err.message);
  } else {
    console.log('Connected to SQLite database at', dbPath);
  }
});

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT DEFAULT '',
      status TEXT NOT NULL DEFAULT 'pending',
      priority TEXT NOT NULL DEFAULT 'medium',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `, (err) => {
    if (err) {
      console.error('Error creating tasks table:', err.message);
    } else {
      db.get('SELECT COUNT(*) AS count FROM tasks', (countErr, row) => {
        if (!countErr && row.count === 0) {
          const stmt = db.prepare(
            'INSERT INTO tasks (title, description, status, priority) VALUES (?, ?, ?, ?)'
          );
          stmt.run(
            'Build Portfolio Website',
            'Responsive personal portfolio deployed on GitHub Pages (Task 2)',
            'completed',
            'high'
          );
          stmt.run(
            'Develop REST API & Backend',
            'Express + SQLite CRUD API with validation and documentation (Task 3)',
            'in-progress',
            'high'
          );
          stmt.finalize();
        }
      });
    }
  });
});

module.exports = db;
