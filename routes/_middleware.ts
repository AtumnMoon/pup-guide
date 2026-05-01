import { define } from "@/utils.ts";
import { sessions, visits } from "@/db/schema.ts";

export default define.middleware(async (ctx) => {
  const ip =
    ctx.req.headers.get("x-forwarded-for") ??
    ctx.req.headers.get("cf-connecting-ip") ??
    null;
  const path = new URL(ctx.req.url).pathname;
  const user_agent = ctx.req.headers.get("user-agent");

  const cookie = ctx.req.headers.get("cookie") ?? "";
  const token =
    cookie
      .split(";")
      .map((c) => c.trim())
      .find((c) => c.startsWith("session="))
      ?.slice("session=".length) ?? null;

  const session = token ? sessions.findValid(token) : null;

  ctx.state.user = session
    ? {
        id: session.user_id,
        username: session.username,
        email: session.email,
        role: session.role,
        created_at: session.user_created_at,
      }
    : null;

  visits.log({
    user_id: session?.user_id ?? null,
    ip,
    path,
    user_agent,
  });

  return await ctx.next();
});
