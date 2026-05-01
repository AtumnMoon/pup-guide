import { define } from "@/utils.ts";
import { articles } from "@/db/schema.ts";
import { ArticleSchema } from "@/lib/types.ts";
import { z } from "zod";

const CreateBody = ArticleSchema.pick({
  slug: true,
  title: true,
  body_md: true,
}).extend({
  published: z.literal(0).or(z.literal(1)).optional(),
});

export const handler = define.handlers({
  // GET /api/articles — public, published only
  // Get every published articles
  GET() {
    const data = articles.findAllPublished();
    return Response.json(data);
  },

  // POST /api/articles — editor, admin
  // Create an article
  async POST(ctx) {
    const user = ctx.state.user;
    if (!user || (user.role !== "editor" && user.role !== "admin")) {
      return Response.json({ error: "Forbidden" }, { status: 403 });
    }

    const raw = await ctx.req.json().catch(() => null);
    const result = CreateBody.safeParse(raw);
    if (!result.success) {
      return Response.json({ error: z.treeifyError(result.error) }, {
        status: 400,
      });
    }

    const { slug, title, body_md, published = 0 } = result.data;

    // Slug uniqueness check
    if (articles.findBySlug(slug)) {
      return Response.json({ error: "Slug already in use" }, { status: 409 });
    }

    const article = articles.create(slug, title, body_md, user.id, published);
    return Response.json(article, { status: 201 });
  },
});
