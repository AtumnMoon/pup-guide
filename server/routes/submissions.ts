import { submissions } from "../db/schema.ts";
import { requireAdmin } from "../middleware/session.ts";
import { createRouter } from "../lib/hono.ts";

const submissionRouter = createRouter()
  .post("/", async (c) => {
    const { body, type } = await c.req.json();
    const user = c.get("user");
    return c.json(submissions.create(body, type, user?.id ?? null), 201);
  })
  .get("/", requireAdmin, (c) => {
    const status = c.req.query("status");
    const result = status
      ? submissions.findByStatus(status as "open" | "resolved" | "closed")
      : submissions.findAll();
    return c.json(result);
  })
  .patch("/:id/status", requireAdmin, async (c) => {
    const { status } = await c.req.json();
    submissions.setStatus(Number(c.req.param("id")), status);
    return c.json({ ok: true });
  })
  .delete("/:id", requireAdmin, (c) => {
    submissions.delete(Number(c.req.param("id")));
    return c.json({ ok: true });
  });

export default submissionRouter;
