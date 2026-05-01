CREATE TABLE IF NOT EXISTS submission_comments (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  submission_id INTEGER NOT NULL REFERENCES submissions(id) ON DELETE CASCADE,
  user_id       INTEGER REFERENCES users(id) ON DELETE SET NULL,
  body          TEXT    NOT NULL,
  anonymous     INTEGER NOT NULL DEFAULT 0 CHECK(anonymous IN (0, 1)),
  created_at    TEXT    NOT NULL DEFAULT (datetime('now'))
);
