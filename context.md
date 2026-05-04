
# pup-guide — Project Handoff Summary

Required files for context awareness
- this file
- `deno.json`
- `db/schema`
- `lib/types.ts`
- utils.ts

## Project Overview

A **student guide web app** with a 2-week timeframe (currently around Day 6–7). Server-side rendered with selective client-side islands.

**Stack:**
- **Framework:** Fresh 2.3.3 (Preact, Vite, file-based routing)
- **Runtime:** Deno v2.7.13
- **DB:** SQLite via `@mainframe-api/deno-sqlite` (WASM, JSR)
- **Auth:** Session-based `httpOnly` cookie
- **Password hashing:** `hash-wasm` (Argon2id + `APP_PEPPER`)
- **Validation:** Zod 4 (`npm:zod@^4.3.6`)
- **Styling:** Tailwind CSS 4 + daisyUI v5 with a custom maroon/gold theme
- **Markdown:** `@deno/gfm` for article rendering
- **Editor:** Helix (primary) + Zed, with Deno LSP + Biome

---

## Key Conventions

**Import alias:** `@/` maps to project root via `deno.json` imports.

**Route handlers:** Always use singular `handler`, not `handlers`.

**JSX:** `"jsx": "precompile"` with `"jsxImportSource": "preact"` in `deno.json`. Islands use `preact/hooks` directly — no React.

**Schema query pattern (`db/schema.ts`):**
```ts
// SELECT — always parse with Zod
const row = db.queryEntries(`SELECT ...`, [params])[0];
if (!row) return undefined;
return SomeSchema.parse(row);

// Writes — no return value
db.query(`INSERT/UPDATE/DELETE ...`, [params]);
```

**Input validation:** Derive from existing schemas using `.pick()` / `.omit()` / `.extend()`. Use `z.treeifyError(result.error)` (NOT `.flatten()` — deprecated in Zod 4) for error responses.

**Role checks:** Done inline per handler. Only `/api/admin/` uses a directory-level middleware guard.

**Not found:** Use `return new Response("Not Found", { status: 404 })` — `ctx.renderNotFound()` does not exist in Fresh 2.x.

**No data pages:** Use `ctx.render(null)` not `ctx.render({})`.

**JSX comments:** Do NOT use `{/* comment */}` as standalone children inside layout returns — causes "JSX must have one parent element" errors with Fresh's precompile mode.

**Visit logging:** Handled exclusively in `routes/_middleware.ts`. The `routes/api/_middleware.ts` file has been deleted — do not recreate it.

---

## Role Permission Matrix

| Feature | Anonymous | User | Editor | Admin |
|---|---|---|---|---|
| View published articles | ✅ | ✅ | ✅ | ✅ |
| Comment on articles | ❌ | ✅ | ✅ | ✅ |
| Create / edit / delete articles | ❌ | ❌ | ✅ | ✅ |
| Publish / unpublish articles | ❌ | ❌ | ✅ | ✅ |
| View FAQ | ✅ | ✅ | ✅ | ✅ |
| Manage FAQ | ❌ | ❌ | ❌ | ✅ |
| Submit problem / request / question | ❌ | ✅ | ✅ | ✅ |
| Submit / comment anonymously | ❌ | ✅ | ✅ | ✅ |
| View real identity behind anonymous posts | ❌ | ❌ | ❌ | ✅ |
| Comment on submissions | ❌ | ✅ | ✅ | ✅ |
| Update submission status | ❌ | ❌ | ❌ | ✅ |
| Delete submissions / comments | ❌ | ❌ | ❌ | ✅ |
| Access Admin Dashboard | ❌ | ❌ | ❌ | ✅ |
| Manage users (roles, deletion) | ❌ | ❌ | ❌ | ✅ |

---

## Directory Structure

```
pup-guide/
├── assets/
│   └── styles.css                    ✅ maroon/gold daisyUI theme
├── data/
│   └── app.db
├── db/
│   ├── migrations/
│   │   ├── 0001_users.sql
│   │   ├── 0002_sessions.sql
│   │   ├── 0003_articles.sql
│   │   ├── 0004_article_comments.sql
│   │   ├── 0005_faq.sql
│   │   ├── 0006_submissions.sql
│   │   ├── 0007_submissions_comments.sql
│   │   └── 0008_visits.sql
│   ├── client.ts
│   ├── migrate.ts
│   └── schema.ts                     ✅ fully updated
├── lib/
│   ├── types.ts                      ✅ fully updated
│   ├── crypto.ts
│   └── token.ts
├── islands/
│   ├── LoginForm.tsx                 ✅
│   ├── CommentForm.tsx               ✅
│   ├── SubmissionForm.tsx            ✅
│   └── SubmissionCommentForm.tsx     ✅
├── routes/
│   ├── _app.tsx                      ✅
│   ├── _layout.tsx                   ✅ role-aware navbar dropdown
│   ├── _middleware.ts                ✅ session → User mapping + visit logging
│   ├── index.tsx                     ✅
│   ├── login.tsx                     ✅
│   ├── logout.ts                     ✅
│   ├── faq.tsx                       ✅
│   ├── about.tsx                     ✅
│   ├── articles/
│   │   └── [slug].tsx                ✅ GFM markdown + comments
│   ├── submissions/
│   │   ├── index.tsx                 ✅
│   │   └── [id].tsx                  ✅
│   └── api/
│       ├── _middleware.ts            ✅ DELETED — auth is inline per handler
│       ├── auth/
│       │   ├── login.ts              ✅
│       │   ├── logout.ts             ✅
│       │   └── me.ts                 ✅
│       ├── articles/
│       │   ├── index.ts              ✅
│       │   └── [id]/
│       │       ├── index.ts          ✅
│       │       └── comments/
│       │           └── index.ts      ✅
│       ├── faq/
│       │   ├── index.ts              ✅
│       │   └── [id].ts               ✅
│       ├── submissions/
│       │   ├── index.ts              ✅
│       │   └── [id]/
│       │       ├── index.ts          ✅
│       │       └── comments/
│       │           └── index.ts      ✅
│       └── admin/
│           ├── _middleware.ts        ✅ blocks non-admin
│           ├── users/
│           │   └── index.ts          ✅
│           └── visits/
│               └── index.ts          ✅
├── utils.ts                          ✅
├── deno.json                         ✅
└── vite.config.ts
```

---

## Current State

All API routes are complete. All existing public frontend pages and islands are written. Public pages that are pending a designer's visual (e.g. a redesigned home, article, FAQ, submission pages) are intentionally untouched for now — do not rewrite them until the designer delivers assets.

### Done ✅
- Entire DB layer: migrations, Zod schemas, query helpers
- All auth, article, FAQ, submission, and admin API routes
- All four islands (login form, comment form, submission form, submission comment form)
- Maroon/gold daisyUI CSS theme
- App shell (`_app.tsx`, `_layout.tsx`)
- Logout route (SSR POST, no JS needed)
- Visit logging in `routes/_middleware.ts`

### What's next ⏳
Admin frontend pages — these are the only remaining files:

- Public frontend: home, article page, FAQ, login, submission form/view, about, admin, article editor
- Then admin islands for interactive actions (article editor, FAQ editor, role selector).

**Approach agreed on:** Pure SSR + PRG (Post/Redirect/Get) for all admin mutations — no new islands until the basic pages work. Each page handles `GET` (load data) and `POST` (with a `_action` field to dispatch create/update/delete).

---

## Important Gotchas

- **`daisyui` is v5** — CSS variable names follow v5 conventions (`--color-primary`, not `--p`)
- **`@tailwindcss/typography`** must be in `deno.json` imports for `@plugin "@tailwindcss/typography"` in styles.css
- **Anonymous submissions:** `user_id` is always stored — `anonymous` flag only controls public exposure. Route layer strips `user_id`/`username` for non-admin views
- **`submission_comments`** has its own `anonymous` column independent of the parent submission's flag
- **`faq` has no `findById`** in schema.ts — use `faq.findAll().find(i => i.id === id)` in routes
- **`users.updateRole()`** exists in `db/schema.ts` — double-check before calling
- **Admin self-protection:** admins cannot change their own role or delete their own account — this is enforced in the API and must also be reflected in the UI (disable/hide those controls when `user.id === row.id`)
- **Editor access:** the `routes/admin/_middleware.ts` allows both `admin` and `editor` roles through. Individual pages that are admin-only (dashboard, users, submissions) must do an additional inline role check and redirect editors away
