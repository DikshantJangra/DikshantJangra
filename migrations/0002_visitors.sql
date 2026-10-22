-- One row per unique visitor. fp = sha256(secret|ip|user-agent); raw IPs are never stored.
CREATE TABLE IF NOT EXISTS visitors (
  fp TEXT PRIMARY KEY,
  created_at INTEGER NOT NULL
);
