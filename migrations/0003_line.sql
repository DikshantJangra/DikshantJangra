-- Direct line: numbered member passes and one message thread per member.
CREATE TABLE IF NOT EXISTS members (
  login TEXT PRIMARY KEY,
  avatar TEXT NOT NULL,
  number INTEGER NOT NULL UNIQUE,
  created_at INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS messages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  login TEXT NOT NULL,          -- whose thread
  from_dj INTEGER NOT NULL DEFAULT 0,
  body TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  read_at INTEGER,              -- when the other side saw it
  tg_id INTEGER                 -- Telegram message it was forwarded as, so replies find their thread
);
CREATE INDEX IF NOT EXISTS messages_thread ON messages (login, id);
CREATE INDEX IF NOT EXISTS messages_tg ON messages (tg_id);
