import db from "./client.ts";
import { z } from "zod";
import {
  ArticleCommentSchema,
  ArticleSchema,
  FAQItemSchema,
  SubmissionCommentSchema,
  SubmissionSchema,
  UserSchema,
  VisitSchema,
  VisitStatsSchema,
} from "../lib/types.ts";

// Session schema is local and not shared across client/server
const SessionSchema = z.object({
  id: z.number(),
  token: z.string(),
  expires_at: z.string(),
  created_at: z.string(),
  user_id: z.number(),
  username: z.string(),
  email: z.string(),
  role: z.enum(["admin", "editor", "user"]),
  user_created_at: z.string(),
});

export const sessions = {
  create(token: string, user_id: number): void {
    const expires_at = new Date(
      Date.now() + 7 * 24 * 60 * 60 * 1000,
    ).toISOString();

    db.query(
      `INSERT INTO sessions (token, user_id, expires_at) VALUES (?, ?, ?)`,
      [token, user_id, expires_at],
    );
  },

  findValid(token: string) {
    const row = db.queryEntries(
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
    )[0];

    if (!row) return undefined;
    return SessionSchema.parse(row);
  },

  revoke(token: string): void {
    db.query("DELETE FROM sessions WHERE token = ?", [token]);
  },

  revokeAllForUser(user_id: number): void {
    db.query("DELETE FROM sessions WHERE user_id = ?", [user_id]);
  },
};

export const users = {
  findById(id: number) {
    const row = db.queryEntries(
      `SELECT id, username, email, role, created_at FROM users WHERE id = ?`,
      [id],
    )[0];
    if (!row) return undefined;
    return UserSchema.parse(row);
  },

  findByEmail(email: string) {
    const row = db.queryEntries(
      `SELECT * FROM users WHERE email = ?`,
      [email],
    )[0];
    if (!row) return undefined;
    return UserSchema.extend({ password_hash: z.string() }).parse(row);
  },

  create(
    username: string,
    email: string,
    password_hash: string,
    role: "user" | "editor" | "admin" = "user",
  ) {
    db.query(
      `INSERT INTO users (username, email, password_hash, role) VALUES (?, ?, ?, ?)`,
      [username, email, password_hash, role],
    );
    return users.findById(Number(db.lastInsertRowId))!;
  },

  updateRole(id: number, role: "user" | "editor" | "admin"): void {
    db.query("UPDATE users SET role = ? WHERE id = ?", [role, id]);
  },

  findAll() {
    const rows = db.queryEntries(
      `SELECT id, username, email, role, created_at FROM users ORDER BY created_at DESC`,
    );
    return z.array(UserSchema).parse(rows);
  },

  delete(id: number): void {
    db.query("DELETE FROM users WHERE id = ?", [id]);
  },
};

// Reusable article SELECT fragment
const ARTICLE_SELECT = `
  SELECT
    a.id, a.slug, a.title, a.body_md, a.published,
    a.created_at, a.updated_at,
    u.username AS author
  FROM articles a
  LEFT JOIN users u ON u.id = a.author_id
`;

export const articles = {
  findAllPublished() {
    const rows = db.queryEntries(
      `${ARTICLE_SELECT} WHERE a.published = 1 ORDER BY a.created_at DESC`,
    );
    return z.array(ArticleSchema).parse(rows);
  },

  findAll() {
    const rows = db.queryEntries(
      `${ARTICLE_SELECT} ORDER BY a.created_at DESC`,
    );
    return z.array(ArticleSchema).parse(rows);
  },

  findBySlug(slug: string) {
    const row = db.queryEntries(
      `${ARTICLE_SELECT} WHERE a.slug = ?`,
      [slug],
    )[0];
    if (!row) return undefined;
    return ArticleSchema.parse(row);
  },

  findById(id: number) {
    const row = db.queryEntries(
      `${ARTICLE_SELECT} WHERE a.id = ?`,
      [id],
    )[0];
    if (!row) return undefined;
    return ArticleSchema.parse(row);
  },

  create(
    slug: string,
    title: string,
    body_md: string,
    author_id: number,
    published: 0 | 1 = 0,
  ) {
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

// Visits are internal to the server
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
    const rows = db.queryEntries(`
        SELECT v.id, v.ip, v.path, v.user_agent, v.visited_at, u.username
        FROM visits v
        LEFT JOIN users u ON u.id = v.user_id
        ORDER BY v.visited_at DESC
      `);
    return z.array(VisitSchema).parse(rows);
  },

  findByPath(path: string) {
    const rows = db.queryEntries(
      `SELECT * FROM visits WHERE path = ? ORDER BY visited_at DESC`,
      [path],
    );
    return z.array(VisitSchema).parse(rows);
  },

  countUnique() {
    const row = db.queryEntries(
      `SELECT COUNT(DISTINCT ip) AS unique_visitors FROM visits`,
    )[0];
    return VisitStatsSchema.parse(row);
  },
};

export const faq = {
  findAll() {
    const rows = db.queryEntries(`SELECT * FROM faq ORDER BY position ASC`);
    return z.array(FAQItemSchema).parse(rows);
  },

  create(question: string, answer: string, position?: number) {
    const pos = position ?? faq.findAll().length + 1;
    db.query(
      `INSERT INTO faq (question, answer, position) VALUES (?, ?, ?)`,
      [question, answer, pos],
    );
    const row = db.queryEntries(
      "SELECT * FROM faq WHERE id = ?",
      [Number(db.lastInsertRowId)],
    )[0];
    return FAQItemSchema.parse(row);
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

export const submissions = {
  create(
    body: string,
    type: z.infer<typeof SubmissionSchema>["type"],
    user_id: number,
    anonymous: 0 | 1 = 0,
  ) {
    db.query(
      `INSERT INTO submissions (user_id, type, body, anonymous) VALUES (?, ?, ?, ?)`,
      [user_id, type, body, anonymous],
    );
    const row = db.queryEntries(
      `
      SELECT
        s.id, s.type, s.body, s.status, s.anonymous, s.created_at,
        s.user_id,
        CASE WHEN s.anonymous = 1 THEN NULL ELSE u.username END AS username
      FROM submissions s
      LEFT JOIN users u ON u.id = s.user_id
      WHERE s.id = ?
      `,
      [Number(db.lastInsertRowId)],
    )[0];
    return SubmissionSchema.parse(row);
  },

  findAll() {
    const rows = db.queryEntries(`
      SELECT s.id, s.type, s.body, s.status, s.anonymous, s.created_at,
             s.user_id, u.username
      FROM submissions s
      LEFT JOIN users u ON u.id = s.user_id
      ORDER BY s.created_at DESC
    `);
    return z.array(SubmissionSchema).parse(rows);
  },

  findById(id: number) {
    const row = db.queryEntries(
      `
      SELECT s.id, s.type, s.body, s.status, s.anonymous, s.created_at,
             s.user_id, u.username
      FROM submissions s
      LEFT JOIN users u ON u.id = s.user_id
      WHERE s.id = ?
      `,
      [id],
    )[0];
    if (!row) return undefined;
    return SubmissionSchema.parse(row);
  },

  findByStatus(status: z.infer<typeof SubmissionSchema>["status"]) {
    const rows = db.queryEntries(
      `
      SELECT s.id, s.type, s.body, s.status, s.anonymous, s.created_at,
             s.user_id, u.username
      FROM submissions s
      LEFT JOIN users u ON u.id = s.user_id
      WHERE s.status = ?
      ORDER BY s.created_at DESC
      `,
      [status],
    );
    return z.array(SubmissionSchema).parse(rows);
  },

  setStatus(
    id: number,
    status: z.infer<typeof SubmissionSchema>["status"],
  ): void {
    db.query("UPDATE submissions SET status = ? WHERE id = ?", [status, id]);
  },

  delete(id: number): void {
    db.query("DELETE FROM submissions WHERE id = ?", [id]);
  },
};

export const articleComments = {
  findByArticle(article_id: number) {
    const rows = db.queryEntries(
      `
      SELECT c.id, c.article_id, c.user_id, c.body, c.created_at,
             u.username
      FROM article_comments c
      JOIN users u ON u.id = c.user_id
      WHERE c.article_id = ?
      ORDER BY c.created_at ASC
      `,
      [article_id],
    );
    return z.array(ArticleCommentSchema).parse(rows);
  },

  create(article_id: number, user_id: number, body: string) {
    db.query(
      `INSERT INTO article_comments (article_id, user_id, body) VALUES (?, ?, ?)`,
      [article_id, user_id, body],
    );
    const row = db.queryEntries(
      `
      SELECT c.id, c.article_id, c.user_id, c.body, c.created_at,
             u.username
      FROM article_comments c
      JOIN users u ON u.id = c.user_id
      WHERE c.id = ?
      `,
      [Number(db.lastInsertRowId)],
    )[0];
    return ArticleCommentSchema.parse(row);
  },
};

export const submissionComments = {
  findBySubmission(submission_id: number) {
    const rows = db.queryEntries(
      `
      SELECT
        c.id, c.submission_id, c.user_id, c.body, c.anonymous, c.created_at,
        CASE WHEN c.anonymous = 1 THEN NULL ELSE u.username END AS username
      FROM submission_comments c
      LEFT JOIN users u ON u.id = c.user_id
      WHERE c.submission_id = ?
      ORDER BY c.created_at ASC
      `,
      [submission_id],
    );
    return z.array(SubmissionCommentSchema).parse(rows);
  },

  findBySubmissionAsAdmin(submission_id: number) {
    const rows = db.queryEntries(
      `
      SELECT
        c.id, c.submission_id, c.user_id, c.body, c.anonymous, c.created_at,
        u.username
      FROM submission_comments c
      LEFT JOIN users u ON u.id = c.user_id
      WHERE c.submission_id = ?
      ORDER BY c.created_at ASC
      `,
      [submission_id],
    );
    return z.array(SubmissionCommentSchema).parse(rows);
  },

  create(
    submission_id: number,
    user_id: number,
    body: string,
    anonymous: 0 | 1 = 0,
  ) {
    db.query(
      `INSERT INTO submission_comments (submission_id, user_id, body, anonymous) VALUES (?, ?, ?, ?)`,
      [submission_id, user_id, body, anonymous],
    );
    const row = db.queryEntries(
      `
      SELECT
        c.id, c.submission_id, c.user_id, c.body, c.anonymous, c.created_at,
        CASE WHEN c.anonymous = 1 THEN NULL ELSE u.username END AS username
      FROM submission_comments c
      LEFT JOIN users u ON u.id = c.user_id
      WHERE c.id = ?
      `,
      [Number(db.lastInsertRowId)],
    )[0];
    return SubmissionCommentSchema.parse(row);
  },

  delete(id: number): void {
    db.query("DELETE FROM submission_comments WHERE id = ?", [id]);
  },

  findById(id: number) {
    const row = db.queryEntries(
      `SELECT * FROM submission_comments WHERE id = ?`,
      [id],
    )[0];
    if (!row) return undefined;
    return SubmissionCommentSchema.parse(row);
  },
};
