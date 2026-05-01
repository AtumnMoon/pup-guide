import { define } from "@/utils.ts";
import { visits } from "@/db/schema.ts";

export const handler = define.handlers({
  // GET /api/admin/visits — admin only
  // GET /api/admin/visits?stats=true — unique visitor count
  GET(ctx) {
    const stats = ctx.url.searchParams.get("stats");

    if (stats === "true") {
      return Response.json(visits.countUnique());
    }

    const path = ctx.url.searchParams.get("path");
    if (path) {
      return Response.json(visits.findByPath(path));
    }

    return Response.json(visits.findAll());
  },
});
