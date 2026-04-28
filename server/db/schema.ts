import db from "./client.ts";
import type { Article, FAQItem, Submission, User } from "@repo/types";

// Sessions
interface Session {
  id: number;
  token: string;
  user_id: number;
  expires_at: string;
  created_at: string;
  user?: User;
}

export const sessions = {
  create(token: string, user_id: number): void {
    const expires_at = new Date(
      Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
    ).toISOString();

    db.query(
      `INSERT INTO sessions (token, user_id, expires_at) VALUES (?, ?, ?)`,
      [token, user_id, expires_at],
    );
  },

  findValid(token: string): (Session & { user: User }) | undefined {
    return db.queryEntries(
      `
      SELECT
        s.id, s.token, s.expires_at, s.created_at,
        u.id         AS user_id,
        u.username,
        u.email,
        u.role,
        u.created_at AS user_created_at
      FROM sessions s
      JOIN users u ON u.id = s.user_id
      WHERE s.token = ?
        AND datetime(s.expires_at) > datetime('now')
    `,
      [token],
    )[0] as unknown as (Session & { user: User }) | undefined;
  },

  revoke(token: string): void {
    db.query("DELETE FROM sessions WHERE token = ?", [token]);
  },

  revokeAllForUser(user_id: number): void {
    db.query("DELETE FROM sessions WHERE user_id = ?", [user_id]);
  },
};

// Users
export const users = {
  findById(id: number): User | undefined {
    return db.queryEntries(
      `SELECT id, username, email, role, created_at FROM users WHERE id = ?`,
      [id],
    )[0] as unknown as User | undefined;
  },

  findByEmail(email: string): (User & { password_hash: string }) | undefined {
    return db.queryEntries(
      `SELECT * FROM users WHERE email = ?`,
      [email],
    )[0] as unknown as (User & { password_hash: string }) | undefined;
  },

  create(
    username: string,
    email: string,
    password_hash: string,
    role: "user" | "admin" = "user",
  ): User {
    db.query(
      `INSERT INTO users (username, email, password_hash, role) VALUES (?, ?, ?, ?)`,
      [username, email, password_hash, role],
    );
    return users.findById(Number(db.lastInsertRowId))!;
  },

  findAll(): User[] {
    return db.queryEntries(
      `SELECT id, username, email, role, created_at FROM users ORDER BY created_at DESC`,
    ) as unknown as User[];
  },

  delete(id: number): void {
    db.query("DELETE FROM users WHERE id = ?", [id]);
  },
};

// Articles
export const articles = {
  findAllPublished(): Article[] {
    return db.queryEntries(`
      SELECT
        a.id, a.slug, a.title, a.body_md, a.published,
        a.created_at, a.updated_at,
        u.username AS author
      FROM articles a
      LEFT JOIN users u ON u.id = a.author_id
      WHERE a.published = 1
      ORDER BY a.created_at DESC
    `) as unknown as Article[];
  },

  findAll(): Article[] {
    return db.queryEntries(`
      SELECT
        a.id, a.slug, a.title, a.body_md, a.published,
        a.created_at, a.updated_at,
        u.username AS author
      FROM articles a
      LEFT JOIN users u ON u.id = a.author_id
      ORDER BY a.created_at DESC
    `) as unknown as Article[];
  },

  findBySlug(slug: string): Article | undefined {
    return db.queryEntries(
      `
      SELECT
        a.id, a.slug, a.title, a.body_md, a.published,
        a.created_at, a.updated_at,
        u.username AS author
      FROM articles a
      LEFT JOIN users u ON u.id = a.author_id
      WHERE a.slug = ?
    `,
      [slug],
    )[0] as unknown as Article | undefined;
  },

  findById(id: number): Article | undefined {
    return db.queryEntries(
      `
      SELECT
        a.id, a.slug, a.title, a.body_md, a.published,
        a.created_at, a.updated_at,
        u.username AS author
      FROM articles a
      LEFT JOIN users u ON u.id = a.author_id
      WHERE a.id = ?
    `,
      [id],
    )[0] as unknown as Article | undefined;
  },

  create(
    slug: string,
    title: string,
    body_md: string,
    author_id: number,
    published: 0 | 1 = 0,
  ): Article {
    db.query(
      `INSERT INTO articles (slug, title, body_md, author_id, published) VALUES (?, ?, ?, ?, ?)`,
      [slug, title, body_md, author_id, published],
    );
    return articles.findById(Number(db.lastInsertRowId))!;
  },

  updateBody(id: number, body_md: string): void {
    db.query(
      `UPDATE articles SET body_md = ?, updated_at = datetime('now') WHERE id = ?`,
      [body_md, id],
    );
  },

  setPublished(id: number, published: 0 | 1): void {
    db.query(
      `UPDATE articles SET published = ?, updated_at = datetime('now') WHERE id = ?`,
      [published, id],
    );
  },

  delete(id: number): void {
    db.query("DELETE FROM articles WHERE id = ?", [id]);
  },

  // ── Edit history ──

  saveEditSnapshot(
    article_id: number,
    editor_id: number | null,
    body_md: string,
  ): void {
    db.query(
      `INSERT INTO article_edits (article_id, editor_id, body_md) VALUES (?, ?, ?)`,
      [article_id, editor_id, body_md],
    );
  },

  findEditHistory(article_id: number) {
    return db.queryEntries(
      `
      SELECT
        e.id, e.body_md, e.edited_at,
        u.username AS editor
      FROM article_edits e
      LEFT JOIN users u ON u.id = e.editor_id
      WHERE e.article_id = ?
      ORDER BY e.edited_at DESC
    `,
      [article_id],
    );
  },
};

// Visits
interface VisitLog {
  user_id: number | null;
  ip: string | null;
  path: string;
  user_agent: string | null;
}

export const visits = {
  log({ user_id, ip, path, user_agent }: VisitLog): void {
    db.query(
      `INSERT INTO visits (user_id, ip, path, user_agent) VALUES (?, ?, ?, ?)`,
      [user_id, ip, path, user_agent],
    );
  },

  findAll() {
    return db.queryEntries(`
      SELECT
        v.id, v.ip, v.path, v.user_agent, v.visited_at,
        u.username
      FROM visits v
      LEFT JOIN users u ON u.id = v.user_id
      ORDER BY v.visited_at DESC
    `);
  },

  findByPath(path: string) {
    return db.queryEntries(
      `SELECT * FROM visits WHERE path = ? ORDER BY visited_at DESC`,
      [path],
    );
  },

  countUnique() {
    return db.queryEntries(
      `SELECT COUNT(DISTINCT ip) AS unique_visitors FROM visits`,
    )[0] as unknown as { unique_visitors: number };
  },
};

// FAQ
export const faq = {
  findAll(): FAQItem[] {
    return db.queryEntries(
      `SELECT * FROM faq ORDER BY position ASC`,
    ) as unknown as FAQItem[];
  },

  create(question: string, answer: string, position?: number): FAQItem {
    const pos = position ?? (faq.findAll().length + 1);

    db.query(
      `INSERT INTO faq (question, answer, position) VALUES (?, ?, ?)`,
      [question, answer, pos],
    );

    return db.queryEntries(
      "SELECT * FROM faq WHERE id = ?",
      [Number(db.lastInsertRowId)],
    )[0] as unknown as FAQItem;
  },

  update(id: number, question: string, answer: string): void {
    db.query(
      `UPDATE faq SET question = ?, answer = ? WHERE id = ?`,
      [question, answer, id],
    );
  },

  reorder(id: number, position: number): void {
    db.query("UPDATE faq SET position = ? WHERE id = ?", [position, id]);
  },

  delete(id: number): void {
    db.query("DELETE FROM faq WHERE id = ?", [id]);
  },
};

// Submissions
export const submissions = {
  create(
    body: string,
    type: Submission["type"],
    user_id: number | null = null, // null = anonymous
  ): Submission {
    db.query(
      `INSERT INTO submissions (user_id, type, body) VALUES (?, ?, ?)`,
      [user_id, type, body],
    );

    return db.queryEntries(
      "SELECT * FROM submissions WHERE id = ?",
      [Number(db.lastInsertRowId)],
    )[0] as unknown as Submission;
  },

  findAll(): Submission[] {
    return db.queryEntries(`
      SELECT s.*, u.username
      FROM submissions s
      LEFT JOIN users u ON u.id = s.user_id
      ORDER BY s.created_at DESC
    `) as unknown as Submission[];
  },

  findByStatus(status: Submission["status"]): Submission[] {
    return db.queryEntries(
      `
      SELECT s.*, u.username
      FROM submissions s
      LEFT JOIN users u ON u.id = s.user_id
      WHERE s.status = ?
      ORDER BY s.created_at DESC
    `,
      [status],
    ) as unknown as Submission[];
  },

  setStatus(id: number, status: Submission["status"]): void {
    db.query("UPDATE submissions SET status = ? WHERE id = ?", [status, id]);
  },

  delete(id: number): void {
    db.query("DELETE FROM submissions WHERE id = ?", [id]);
  },
};
