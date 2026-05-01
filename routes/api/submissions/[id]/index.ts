import { define } from "@/utils.ts";
import { submissions } from "@/db/schema.ts";
import { SubmissionSchema } from "@/lib/types.ts";
import { z } from "zod";

const PatchStatusBody = SubmissionSchema.pick({ status: true });

export const handler = define.handlers({
  // GET /api/submissions/:id — admin, or owner (non-anonymous)
  // Get existing submission
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

    // Strip sensitive fields from owner view
    if (!isAdmin && submission.anonymous) {
      const { user_id, username, ...safe } = submission;
      return Response.json(safe);
    }

    return Response.json(submission);
  },

  // PATCH /api/submissions/:id — admin only (status update)
  // Update the status of a specific submission
  async PATCH(ctx) {
    const user = ctx.state.user;
    if (!user || user.role !== "admin") {
      return Response.json({ error: "Forbidden" }, { status: 403 });
    }

    const id = Number(ctx.params.id);
    if (isNaN(id)) {
      return Response.json({ error: "Invalid ID" }, { status: 400 });
    }

    if (!submissions.findById(id)) {
      return Response.json({ error: "Not found" }, { status: 404 });
    }

    const raw = await ctx.req.json().catch(() => null);
    const result = PatchStatusBody.safeParse(raw);
    if (!result.success) {
      return Response.json({ error: z.treeifyError(result.error) }, { status: 400 });
    }

    submissions.setStatus(id, result.data.status);
    return Response.json(submissions.findById(id));
  },

  // DELETE /api/submissions/:id — admin only
  // Delete a submission
  DELETE(ctx) {
    const user = ctx.state.user;
    if (!user || user.role !== "admin") {
      return Response.json({ error: "Forbidden" }, { status: 403 });
    }

    const id = Number(ctx.params.id);
    if (isNaN(id)) {
      return Response.json({ error: "Invalid ID" }, { status: 400 });
    }

    if (!submissions.findById(id)) {
      return Response.json({ error: "Not found" }, { status: 404 });
    }

    submissions.delete(id);
    return new Response(null, { status: 204 });
  },
});
