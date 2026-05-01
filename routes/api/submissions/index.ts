import { define } from "@/utils.ts";
import { submissions } from "@/db/schema.ts";
import { SubmissionSchema } from "@/lib/types.ts";
import { z } from "zod";

const CreateBody = SubmissionSchema.pick({ type: true, body: true }).extend({
  anonymous: z.literal(0).or(z.literal(1)).optional(),
});

export const handler = define.handlers({
  // GET /api/submissions — admin only
  // Get every submissions
  GET(ctx) {
    const user = ctx.state.user;
    if (!user || user.role !== "admin") {
      return Response.json({ error: "Forbidden" }, { status: 403 });
    }

    return Response.json(submissions.findAll());
  },

  // POST /api/submissions — user, editor, admin
  // Create a new submission
  async POST(ctx) {
    const user = ctx.state.user;
    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const raw = await ctx.req.json().catch(() => null);
    const result = CreateBody.safeParse(raw);
    if (!result.success) {
      return Response.json({ error: z.treeifyError(result.error) }, {
        status: 400,
      });
    }

    const { type, body, anonymous = 0 } = result.data;
    const submission = submissions.create(body, type, user.id, anonymous);
    return Response.json(submission, { status: 201 });
  },
});
