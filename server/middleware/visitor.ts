import { createMiddleware } from "@hono/hono/factory";
import { visits } from "../db/schema.ts";

const SKIP_PATHS = ["/favicon.ico", "/health"];

// Silently logs every non-skipped request
export const visitorMiddleware = createMiddleware(async (c, next) => {
  const path = new URL(c.req.url).pathname;

  if (!SKIP_PATHS.includes(path)) {
    const user = c.get("user");
    visits.log({
      user_id: user?.id ?? null,
      ip: c.req.header("x-forwarded-for") ?? null,
      path,
      user_agent: c.req.header("user-agent") ?? null,
    });
  }

  await next();
});
