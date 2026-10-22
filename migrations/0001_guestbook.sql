CREATE TABLE IF NOT EXISTS entries (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  login TEXT NOT NULL,
  avatar TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS entries_created ON entries (created_at DESC);
CREATE INDEX IF NOT EXISTS entries_login ON entries (login, created_at DESC);
