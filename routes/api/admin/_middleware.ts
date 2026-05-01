import { define } from "@/utils.ts";

export const handler = define.handlers((ctx) => {
  const user = ctx.state.user;

  if (!user || user.role != "admin") {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  return ctx.next();
});
