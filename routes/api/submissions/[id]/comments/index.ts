import { define } from "@/utils.ts";
import { submissions, submissionComments } from "@/db/schema.ts";
import { SubmissionCommentSchema } from "@/lib/types.ts";
import { z } from "zod";

const CreateBody = SubmissionCommentSchema.pick({ body: true }).extend({
  anonymous: z.literal(0).or(z.literal(1)).optional(),
});

export const handler = define.handlers({
  // GET /api/submissions/:id/comments — admin, or owner
  // Get a specific comment
  GET(ctx) {
    const user = ctx.state.user;
    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const id = Number(ctx.params.id);
    if (isNaN(id)) {
      return Response.json({ error: "Invalid ID" }, { status: 400 });
    }

    const submission = submissions.findById(id);
    if (!submission) {
      return Response.json({ error: "Not found" }, { status: 404 });
    }

    const isAdmin = user.role === "admin";
    const isOwner = submission.user_id === user.id && !submission.anonymous;

    if (!isAdmin && !isOwner) {
      return Response.json({ error: "Forbidden" }, { status: 403 });
    }

    const comments = isAdmin
      ? submissionComments.findBySubmissionAsAdmin(id)
      : submissionComments.findBySubmission(id);

    return Response.json(comments);
  },

  // POST /api/submissions/:id/comments — user, editor, admin
  // Create new comment
  async POST(ctx) {
    const user = ctx.state.user;
    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const id = Number(ctx.params.id);
    if (isNaN(id)) {
      return Response.json({ error: "Invalid ID" }, { status: 400 });
    }

    const submission = submissions.findById(id);
    if (!submission) {
      return Response.json({ error: "Not found" }, { status: 404 });
    }

    const isAdmin = user.role === "admin";
    const isOwner = submission.user_id === user.id && !submission.anonymous;

    if (!isAdmin && !isOwner) {
      return Response.json({ error: "Forbidden" }, { status: 403 });
    }

    const raw = await ctx.req.json().catch(() => null);
    const result = CreateBody.safeParse(raw);
    if (!result.success) {
      return Response.json({ error: z.treeifyError(result.error) }, { status: 400 });
    }

    const { body, anonymous = 0 } = result.data;
    const comment = submissionComments.create(id, user.id, body, anonymous);
    return Response.json(comment, { status: 201 });
  },

  // DELETE /api/submissions/:id/comments/:cid — admin only
  // Delete a specific comment
  DELETE(ctx) {
    const user = ctx.state.user;
    if (!user || user.role !== "admin") {
      return Response.json({ error: "Forbidden" }, { status: 403 });
    }

    const cid = Number(ctx.params.cid);
    if (isNaN(cid)) {
      return Response.json({ error: "Invalid ID" }, { status: 400 });
    }

    if (!submissionComments.findById(cid)) {
      return Response.json({ error: "Not found" }, { status: 404 });
    }

    submissionComments.delete(cid);
    return new Response(null, { status: 204 });
  },
});
