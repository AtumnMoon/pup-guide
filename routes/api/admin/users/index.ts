import { define } from "@/utils.ts";
import { sessions, users } from "@/db/schema.ts";
import { UserSchema } from "@/lib/types.ts";
import { z } from "zod";

const PatchRoleBody = UserSchema.pick({ role: true });

export const handler = define.handlers({
  // GET /api/admin/users — admin only
  // Get every users
  GET() {
    return Response.json(users.findAll());
  },

  // PATCH /api/admin/users/:id/role — admin only
  // Set the another user's role
  async PATCH(ctx) {
    const id = Number(ctx.params.id);
    if (isNaN(id)) {
      return Response.json({ error: "Invalid ID" }, { status: 400 });
    }

    const target = users.findById(id);
    if (!target) {
      return Response.json({ error: "Not found" }, { status: 404 });
    }

    // Prevent admin from demoting themselves
    if (target.id === ctx.state.user!.id) {
      return Response.json({ error: "Cannot change your own role" }, {
        status: 403,
      });
    }

    const raw = await ctx.req.json().catch(() => null);
    const result = PatchRoleBody.safeParse(raw);
    if (!result.success) {
      return Response.json({ error: z.treeifyError(result.error) }, {
        status: 400,
      });
    }

    // Role change invalidates all existing sessions for that user
    sessions.revokeAllForUser(id);
    users.updateRole(id, result.data.role);

    return Response.json(users.findById(id));
  },

  // DELETE /api/admin/users/:id — admin only
  // Delete a user
  DELETE(ctx) {
    const id = Number(ctx.params.id);
    if (isNaN(id)) {
      return Response.json({ error: "Invalid ID" }, { status: 400 });
    }

    // Prevent admin from deleting themselves
    if (id === ctx.state.user!.id) {
      return Response.json({ error: "Cannot delete your own account" }, {
        status: 403,
      });
    }

    if (!users.findById(id)) {
      return Response.json({ error: "Not found" }, { status: 404 });
    }

    users.delete(id);
    return new Response(null, { status: 204 });
  },
});
