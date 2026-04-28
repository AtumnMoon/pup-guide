import { faq } from "../db/schema.ts";
import { requireAdmin } from "../middleware/session.ts";
import { createRouter } from "../lib/hono.ts";

const faqRouter = createRouter()
  // Get every FAQs
  .get("/", (c) => c.json(faq.findAll()))
  // Upload new FAQ
  .post("/", requireAdmin, async (c) => {
    const { question, answer, position } = await c.req.json();
    return c.json(faq.create(question, answer, position), 201);
  })
  // Answer a specific FAQ
  .patch("/:id", requireAdmin, async (c) => {
    const { question, answer } = await c.req.json();
    faq.update(Number(c.req.param("id")), question, answer);
    return c.json({ ok: true });
  })
  // Reorder the position of FAQ
  .patch("/:id/reorder", requireAdmin, async (c) => {
    const { position } = await c.req.json();
    faq.reorder(Number(c.req.param("id")), position);
    return c.json({ ok: true });
  })
  // Delete a specific FAQ
  .delete("/:id", requireAdmin, (c) => {
    faq.delete(Number(c.req.param("id")));
    return c.json({ ok: true });
  });

export default faqRouter;
