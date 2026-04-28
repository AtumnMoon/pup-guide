CREATE TABLE IF NOT EXISTS submissions (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id    INTEGER REFERENCES users(id) ON DELETE SET NULL, -- null = anonymous
  type       TEXT    NOT NULL,              -- 'problem' | 'request' | 'question'
  body       TEXT    NOT NULL,
  status     TEXT    NOT NULL DEFAULT 'open', -- 'open' | 'resolved' | 'closed'
  created_at TEXT    NOT NULL DEFAULT (datetime('now'))
);
