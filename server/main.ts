import { Hono } from "@hono/hono";
import { cors } from "@hono/hono/cors";
import { logger } from "@hono/hono/logger";
import { secureHeaders } from "@hono/hono/secure-headers";

import { sessionMiddleware } from "./middleware/session.ts";
import { visitorMiddleware } from "./middleware/visitor.ts";

import authRouter from "./routes/auth.ts";
import articleRouter from "./routes/articles.ts";
import faqRouter from "./routes/faq.ts";
import submissionRouter from "./routes/submissions.ts";
import visitRouter from "./routes/visits.ts";
import adminRouter from "./routes/admin.ts";

const HOST = Deno.env.get("HOST") ?? "0.0.0.0";
const PORT = Deno.env.get("PORT") ?? "8000";

const api = new Hono()
  // Each route
  .route("/auth", authRouter)
  .route("/articles", articleRouter)
  .route("/faq", faqRouter)
  .route("/submissions", submissionRouter)
  .route("/visits", visitRouter) // admin: GET /visits
  .route("/admin", adminRouter); // admin: user management, stats

const app = new Hono()
  // Global middleware - order matters here
  .use("*", logger()) // log every request to stdout
  .use("*", secureHeaders()) // X-Frame-Options, CSP, etc.
  .use(
    "*",
    cors({
      origin: Deno.env.get("CLIENT_ORIGIN") ?? "http://localhost:4321",
      credentials: true, // required for cookies to pass through
    }),
  )
  .use("*", sessionMiddleware) // attach user to context if cookie is valid
  .use("*", visitorMiddleware) // log visit after session is resolved
  .route("/api", api);

Deno.serve({ port: Number(PORT), hostname: HOST }, app.fetch);
