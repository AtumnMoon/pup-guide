import { createMiddleware } from "@hono/hono/factory";
import { getCookie } from "@hono/hono/cookie";
import { sessions } from "../db/schema.ts";
import type { HonoVariables } from "@repo/types";

type Env = { Variables: HonoVariables };

export const sessionMiddleware = createMiddleware<Env>(async (c, next) => {
  const token = getCookie(c, "session");

  if (token) {
    const session = sessions.findValid(token);
    if (session) {
      c.set("user", session.user);
    }
  }

  await next();
});

export const requireAuth = createMiddleware<Env>(async (c, next) => {
  const user = c.get("user");
  if (!user) return c.json({ error: "Unauthorized" }, 401);
  await next();
});

export const requireAdmin = createMiddleware<Env>(async (c, next) => {
  const user = c.get("user");
  if (!user || user.role !== "admin") {
    return c.json({ error: "Forbidden" }, 403);
  }
  await next();
});
