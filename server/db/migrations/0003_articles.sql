CREATE TABLE IF NOT EXISTS articles (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  slug        TEXT    NOT NULL UNIQUE,
  title       TEXT    NOT NULL,
  body_md     TEXT    NOT NULL DEFAULT '',   -- source of truth for content
  published   INTEGER NOT NULL DEFAULT 0,    -- 0 = draft, 1 = published
  author_id   INTEGER REFERENCES users(id) ON DELETE SET NULL,
  created_at  TEXT    NOT NULL DEFAULT (datetime('now')),
  updated_at  TEXT    NOT NULL DEFAULT (datetime('now'))
);

-- Edit history (wiki-like)
CREATE TABLE IF NOT EXISTS article_edits (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  article_id  INTEGER NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
  editor_id   INTEGER REFERENCES users(id) ON DELETE SET NULL,
  body_md     TEXT    NOT NULL,              -- full snapshot at time of edit
  edited_at   TEXT    NOT NULL DEFAULT (datetime('now'))
);
