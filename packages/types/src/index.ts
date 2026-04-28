export interface HonoVariables {
  user: User;
}

export interface User {
  id: number;
  username: string;
  email: string;
  role: "user" | "admin";
  created_at: string;
}

export interface Article {
  id: number;
  slug: string;
  title: string;
  body_md: string;
  published: 0 | 1;
  author: string | null;
  created_at: string;
  updated_at: string;
}

export interface Submission {
  id: number;
  user_id: number | null; // null = anonymous
  type: "problem" | "request" | "question";
  body: string;
  status: "open" | "resolved" | "closed";
  created_at: string;
}

export interface FAQItem {
  id: number;
  question: string;
  answer: string;
  position: number;
}
