import { visits } from "../db/schema.ts";
import { requireAdmin } from "../middleware/session.ts";
import { createRouter } from "../lib/hono.ts";

const visitRouter = createRouter()
  .get("/", requireAdmin, (c) => c.json(visits.findAll()))
  .get("/stats", requireAdmin, (c) => c.json(visits.countUnique()))
  .get("/path", requireAdmin, (c) => {
    const path = c.req.query("path");
    if (!path) return c.json({ error: "Missing path query param" }, 400);
    return c.json(visits.findByPath(path));
  });

export default visitRouter;
