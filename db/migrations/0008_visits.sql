CREATE TABLE IF NOT EXISTS visits (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id    INTEGER REFERENCES users(id) ON DELETE SET NULL, -- null = guest
  ip         TEXT,
  path       TEXT    NOT NULL,
  user_agent TEXT,
  visited_at TEXT    NOT NULL DEFAULT (datetime('now'))
);
