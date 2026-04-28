import { deleteCookie, getCookie, setCookie } from "@hono/hono/cookie";
import { sessions, users } from "../db/schema.ts";
import { requireAuth } from "../middleware/session.ts";
import { verifyPassword } from "../utils/crypto.ts";
import { generateToken } from "../utils/token.ts";
import { createRouter } from "../lib/hono.ts";

const authRouter = createRouter()
  // Login the user then send a session-token as cookie
  .post("/login", async (c) => {
    const { email, password } = await c.req.json();
    const user = users.findByEmail(email);

    if (!user || !(await verifyPassword(password, user.password_hash))) {
      return c.json({ error: "Invalid credentials" }, 401);
    }

    const token = generateToken();
    sessions.create(token, user.id);

    setCookie(c, "session", token, {
      httpOnly: true,
      sameSite: "Lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return c.json({ ok: true });
  })
  // Logout the user then delete their cookie
  .post("/logout", requireAuth, (c) => {
    const token = getCookie(c, "session")!;
    sessions.revoke(token);
    deleteCookie(c, "session");
    return c.json({ ok: true });
  })
  // Get user data
  .get("/me", requireAuth, (c) => {
    return c.json(c.get("user"));
  });

export default authRouter;
