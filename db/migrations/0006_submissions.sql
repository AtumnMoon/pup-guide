CREATE TABLE IF NOT EXISTS submissions (
  id        INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id   INTEGER REFERENCES users(id) ON DELETE SET NULL,
  type      TEXT    NOT NULL CHECK(type IN ('article', 'faq')),
  body      TEXT    NOT NULL,
  status    TEXT    NOT NULL DEFAULT 'pending' CHECK(status IN ('pending', 'approved', 'rejected')),
  anonymous INTEGER NOT NULL DEFAULT 0 CHECK(anonymous IN (0, 1)),
  created_at TEXT   NOT NULL DEFAULT (datetime('now'))
);
