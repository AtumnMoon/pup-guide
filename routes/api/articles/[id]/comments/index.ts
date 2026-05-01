import { define } from "@/utils.ts";
import { articleComments, articles } from "@/db/schema.ts";
import { ArticleCommentSchema } from "@/lib/types.ts";
import { z } from "zod";

const CreateBody = ArticleCommentSchema.pick({ body: true });

export const handler = define.handlers({
  // GET /api/articles/:id/comments — public
  // Get every comments of a particular article
  GET(ctx) {
    const id = Number(ctx.params.id);
    if (isNaN(id)) {
      return Response.json({ error: "Invalid ID" }, { status: 400 });
    }

    const article = articles.findById(id);
    if (!article || !article.published) {
      return Response.json({ error: "Not found" }, { status: 404 });
    }

    return Response.json(articleComments.findByArticle(id));
  },

  // POST /api/articles/:id/comments — user, editor, admin
  // Post a comment in a particular article
  async POST(ctx) {
    const user = ctx.state.user;
    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const id = Number(ctx.params.id);
    if (isNaN(id)) {
      return Response.json({ error: "Invalid ID" }, { status: 400 });
    }

    const article = articles.findById(id);
    if (!article || !article.published) {
      return Response.json({ error: "Not found" }, { status: 404 });
    }

    const raw = await ctx.req.json().catch(() => null);
    const result = CreateBody.safeParse(raw);
    if (!result.success) {
      return Response.json({ error: z.treeifyError(result.error) }, { status: 400 });
    }

    const comment = articleComments.create(id, user.id, result.data.body);
    return Response.json(comment, { status: 201 });
  },
});
