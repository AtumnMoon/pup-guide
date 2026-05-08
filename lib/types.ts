import { z } from "zod";

export const UserSchema = z.object({
  id: z.number(),
  username: z.string(),
  email: z.string(),
  role: z.enum(["admin", "editor", "user"]),
  created_at: z.string(),
});

export const ArticleSchema = z.object({
  id: z.number(),
  slug: z.string(),
  title: z.string(),
  body_md: z.string(),
  author: z.string().nullable(),
  published: z.coerce.boolean(),
  created_at: z.string(),
  updated_at: z.string(),
});

export const ArticleCommentSchema = z.object({
  id: z.number(),
  article_id: z.number(),
  user_id: z.number(),
  username: z.string(),
  body: z.string(),
  created_at: z.string(),
});

export const SubmissionSchema = z.object({
  id: z.number(),
  body: z.string(),
  type: z.enum(["problem", "request", "question"]),
  status: z.enum(["pending", "approved", "rejected"]),
  user_id: z.number().nullable(),
  username: z.string().nullable(),
  anonymous: z.coerce.boolean(),
  created_at: z.string(),
});

export const SubmissionCommentSchema = z.object({
  id: z.number(),
  submission_id: z.number(),
  user_id: z.number().nullable(),
  username: z.string().nullable(),
  body: z.string(),
  anonymous: z.coerce.boolean(),
  created_at: z.string(),
});

export const VisitSchema = z.object({
  id: z.number(),
  ip: z.string().nullable(),
  path: z.string(),
  user_agent: z.string().nullable(),
  visited_at: z.string(),
  username: z.string().nullable(),
});

export const VisitStatsSchema = z.object({
  unique_visitors: z.number(),
});

export const FAQItemSchema = z.object({
  id: z.number(),
  question: z.string(),
  answer: z.string(),
  position: z.number(),
});

// Inferred types use this as interfaces
export type User = z.infer<typeof UserSchema>;
export type Article = z.infer<typeof ArticleSchema>;
export type ArticleComment = z.infer<typeof ArticleCommentSchema>;
export type Submission = z.infer<typeof SubmissionSchema>;
export type SubmissionComment = z.infer<typeof SubmissionCommentSchema>;
export type Visit = z.infer<typeof VisitSchema>;
export type VisitStats = z.infer<typeof VisitStatsSchema>;
export type FAQItem = z.infer<typeof FAQItemSchema>;
