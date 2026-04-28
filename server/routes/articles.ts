import { articles } from "../db/schema.ts";
import { requireAdmin, requireAuth } from "../middleware/session.ts";
import { createRouter } from "../lib/hono.ts";

const articleRouter = createRouter()
  // Find every published article
  .get("/", (c) => c.json(articles.findAllPublished()))
  // Find specific article
  .get("/:slug", (c) => {
    const article = articles.findBySlug(c.req.param("slug"));
    if (!article) return c.json({ error: "Not found" }, 404);
    return c.json(article);
  })
  // Save the specific edited article
  .patch("/:id/edit", requireAuth, async (c) => {
    const user = c.get("user");
    const { body_md } = await c.req.json();
    const id = Number(c.req.param("id"));

    articles.updateBody(id, body_md);
    articles.saveEditSnapshot(id, user.id, body_md);

    return c.json({ ok: true });
  })
  // Delete a specific article
  .delete("/:id", requireAdmin, (c) => {
    articles.delete(Number(c.req.param("id")));
    return c.json({ ok: true });
  });

export default articleRouter;
