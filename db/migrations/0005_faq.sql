CREATE TABLE IF NOT EXISTS faq (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  question   TEXT    NOT NULL,
  answer     TEXT    NOT NULL,
  position   INTEGER NOT NULL DEFAULT 0,    -- for manual ordering
  created_at TEXT    NOT NULL DEFAULT (datetime('now'))
);
