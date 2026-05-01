import { define } from "@/utils.ts";
import { faq } from "@/db/schema.ts";
import { FAQItemSchema } from "@/lib/types.ts";
import { z } from "zod";

const PatchBody = FAQItemSchema.pick({ question: true, answer: true }).extend({
  position: z.number().int().positive().optional(),
}).partial().refine(
  (d) => Object.values(d).some((v) => v !== undefined),
  { message: "At least one field required" },
);

export const handler = define.handlers({
  // PATCH /api/faq/:id — admin only
  // Edit the existing faq — for example answering the question or something
  async PATCH(ctx) {
    const user = ctx.state.user;
    if (!user || user.role !== "admin") {
      return Response.json({ error: "Forbidden" }, { status: 403 });
    }

    const id = Number(ctx.params.id);
    if (isNaN(id)) {
      return Response.json({ error: "Invalid ID" }, { status: 400 });
    }

    const items = faq.findAll();
    const item = items.find((i) => i.id === id);
    if (!item) {
      return Response.json({ error: "Not found" }, { status: 404 });
    }

    const raw = await ctx.req.json().catch(() => null);
    const result = PatchBody.safeParse(raw);
    if (!result.success) {
      return Response.json({ error: z.treeifyError(result.error) }, { status: 400 });
    }

    const { question, answer, position } = result.data;

    if (question !== undefined || answer !== undefined) {
      faq.update(id, question ?? item.question, answer ?? item.answer);
    }

    if (position !== undefined) {
      faq.reorder(id, position);
    }

    return Response.json(faq.findAll().find((i) => i.id === id));
  },

  // DELETE /api/faq/:id — admin only
  // Delete a specific faq
  DELETE(ctx) {
    const user = ctx.state.user;
    if (!user || user.role !== "admin") {
      return Response.json({ error: "Forbidden" }, { status: 403 });
    }

    const id = Number(ctx.params.id);
    if (isNaN(id)) {
      return Response.json({ error: "Invalid ID" }, { status: 400 });
    }

    if (!faq.findAll().find((i) => i.id === id)) {
      return Response.json({ error: "Not found" }, { status: 404 });
    }

    faq.delete(id);
    return new Response(null, { status: 204 });
  },
});
