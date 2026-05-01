import { define } from "@/utils.ts";
import { articles } from "@/db/schema.ts";
import { ArticleSchema } from "@/lib/types.ts";
import { z } from "zod";

const PatchBody = ArticleSchema.pick({ body_md: true }).extend({
  published: z.literal(0).or(z.literal(1)).optional(),
}).refine(
  (d) => d.body_md !== undefined || d.published !== undefined,
  { message: "At least one field required" },
);

export const handler = define.handlers({
  // GET /api/articles/:id — public, published only
  // Get a specific published article
  GET(ctx) {
    const id = Number(ctx.params.id);
    if (isNaN(id)) {
      return Response.json({ error: "Invalid ID" }, { status: 400 });
    }

    const article = articles.findById(id);
    if (!article || !article.published) {
      return Response.json({ error: "Not found" }, { status: 404 });
    }

    return Response.json(article);
  },

  // PATCH /api/articles/:id — editor, admin
  // Edit an existing article
  async PATCH(ctx) {
    const user = ctx.state.user;
    if (!user || (user.role !== "editor" && user.role !== "admin")) {
      return Response.json({ error: "Forbidden" }, { status: 403 });
    }

    const id = Number(ctx.params.id);
    if (isNaN(id)) {
      return Response.json({ error: "Invalid ID" }, { status: 400 });
    }

    const article = articles.findById(id);
    if (!article) {
      return Response.json({ error: "Not found" }, { status: 404 });
    }

    const raw = await ctx.req.json().catch(() => null);
    const result = PatchBody.safeParse(raw);
    if (!result.success) {
      return Response.json({ error: z.treeifyError(result.error) }, { status: 400 });
    }

    const { body_md, published } = result.data;

    if (body_md !== undefined) {
      articles.saveEditSnapshot(article.id, user.id, article.body_md);
      articles.updateBody(id, body_md);
    }

    if (published !== undefined) {
      articles.setPublished(id, published);
    }

    return Response.json(articles.findById(id));
  },

  // DELETE /api/articles/:id — editor, admin
  // Delete a specific article
  DELETE(ctx) {
    const user = ctx.state.user;
    if (!user || (user.role !== "editor" && user.role !== "admin")) {
      return Response.json({ error: "Forbidden" }, { status: 403 });
    }

    const id = Number(ctx.params.id);
    if (isNaN(id)) {
      return Response.json({ error: "Invalid ID" }, { status: 400 });
    }

    if (!articles.findById(id)) {
      return Response.json({ error: "Not found" }, { status: 404 });
    }

    articles.delete(id);
    return new Response(null, { status: 204 });
  },
});
