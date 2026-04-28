import { articles, submissions, users, visits } from "../db/schema.ts";
import { requireAdmin } from "../middleware/session.ts";
import { createRouter } from "../lib/hono.ts";

const adminRouter = createRouter()
  .use("*", requireAdmin)
  // Get every user, articles, submissions, and visitors
  .get("/stats", (c) => {
    return c.json({
      users: users.findAll().length,
      articles: articles.findAll().length,
      submissions: submissions.findAll().length,
      visitors: visits.countUnique(),
    });
  })
  // Get every user
  .get("/users", (c) => c.json(users.findAll()))
  // Delete a specific user
  .delete("/users/:id", (c) => {
    users.delete(Number(c.req.param("id")));
    return c.json({ ok: true });
  })
  // Get every articles
  .get("/articles", (c) => c.json(articles.findAll()))
  // Publish a specific article
  .patch("/articles/:id/publish", async (c) => {
    const { published } = await c.req.json();
    articles.setPublished(Number(c.req.param("id")), published);
    return c.json({ ok: true });
  });

export default adminRouter;
