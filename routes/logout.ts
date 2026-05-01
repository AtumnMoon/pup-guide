import { define } from "@/utils.ts";
import { sessions } from "@/db/schema.ts";

export const handler = define.handlers({
  POST(ctx) {
    const cookie = ctx.req.headers.get("cookie") ?? "";
    const token = cookie
      .split(";")
      .map((c) => c.trim())
      .find((c) => c.startsWith("session="))
      ?.slice("session=".length) ?? null;

    if (token) sessions.revoke(token);

    return new Response(null, {
      status: 303,
      headers: {
        "Set-Cookie": "session=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax",
        "Location": "/",
      },
    });
  },
});
