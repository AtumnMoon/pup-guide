import { define } from "@/utils.ts";
import { faq } from "@/db/schema.ts";
import { FAQItemSchema } from "@/lib/types.ts";
import { z } from "zod";

const CreateBody = FAQItemSchema.pick({ question: true, answer: true }).extend({
  position: z.number().int().positive().optional(),
});

export const handler = define.handlers({
  // GET /api/faq — public
  // Get every exising faq
  GET() {
    return Response.json(faq.findAll());
  },

  // POST /api/faq — admin only
  // Create a new faq
  async POST(ctx) {
    const user = ctx.state.user;
    if (!user || user.role !== "admin") {
      return Response.json({ error: "Forbidden" }, { status: 403 });
    }

    const raw = await ctx.req.json().catch(() => null);
    const result = CreateBody.safeParse(raw);
    if (!result.success) {
      return Response.json({ error: z.treeifyError(result.error) }, {
        status: 400,
      });
    }

    const { question, answer, position } = result.data;
    const item = faq.create(question, answer, position);
    return Response.json(item, { status: 201 });
  },
});
