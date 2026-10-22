-- Direct line: numbered member passes and one message thread per member.
-- Keyed by GitHub's numeric user id; login/avatar are refreshed on each visit and only shown.
CREATE TABLE IF NOT EXISTS members (
  id INTEGER PRIMARY KEY,       -- GitHub user id
  login TEXT NOT NULL,
  avatar TEXT NOT NULL,
  number INTEGER NOT NULL UNIQUE,
  created_at INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS messages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  member_id INTEGER NOT NULL,   -- whose thread
  from_dj INTEGER NOT NULL DEFAULT 0,
  body TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  read_at INTEGER,              -- when the other side saw it
  tg_id INTEGER                 -- Telegram message it was forwarded as, so replies find their thread
);
CREATE INDEX IF NOT EXISTS messages_thread ON messages (member_id, id);
CREATE INDEX IF NOT EXISTS messages_tg ON messages (tg_id);
