# pup-guide — Project Handoff Summary

Required files for context awareness
- this file
- `deno.json`
- `db/schema.ts`
- `lib/types.ts`
- `utils.ts`

## Project Overview

A **student guide web app** for PUP Sta. Rosa Campus with a 2-week timeframe (currently around Day 8–9). Server-side rendered with selective client-side islands.

**Stack:**
- **Framework:** Fresh 2.3.3 (Preact, Vite, file-based routing)
- **Runtime:** Deno v2.7.13
- **DB:** SQLite via `@mainframe-api/deno-sqlite` (WASM, JSR)
- **Auth:** Session-based `httpOnly` cookie
- **Password hashing:** `hash-wasm` (Argon2id + `APP_PEPPER`)
- **Validation:** Zod 4 (`npm:zod@^4.3.6`)
- **Styling:** Tailwind CSS 4 + daisyUI v5 with a custom maroon/gold theme (two themes: `pup` light, `pup-dark` dark)
- **Markdown:** `@deno/gfm` for article rendering
- **Icons:** Heroicons (inline SVG, no package needed) — preferred for SSR pages. `lucide-preact` acceptable inside islands if needed.
- **Editor:** Helix (primary) + Zed, with Deno LSP + Biome

---

## Key Conventions

**Import alias:** `@/` maps to project root via `deno.json` imports.

**Route handlers:** Always use singular `handler`, not `handlers`.

**JSX:** `"jsx": "precompile"` with `"jsxImportSource": "preact"` in `deno.json`. Islands use `preact/hooks` directly — no React.

**JSX attribute:** Use `class` not `className` — this is Preact, not React.

**Page data pattern:** Use `page()` from `"fresh"` to return data from handlers — NOT `ctx.render()`. The `ctx.render()` typing does not propagate the data type correctly in Fresh 2.x.
```ts
import { page } from "fresh";

export const handler = define.handlers({
  GET(ctx) {
    return page({ someData: value });
  },
});

export default define.page<typeof handler>(({ data }) => {
  // data is typed from page() call above
});
```

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

**Layouts:** File-based (`_layout.tsx`), NOT programmatic. Uses `define.layout()` from `utils.ts`. Access user via `state.user` prop. Admin layout at `routes/admin/_layout.tsx` should use `skipInheritedLayouts: true`.

**`data-theme`:** Must be set on `<html>` in `_app.tsx` — either `"pup"` (light) or `"pup-dark"` (dark). Theme toggle is a small island that sets `document.documentElement.dataset.theme` and persists preference.

**Active nav links:** `_layout.tsx` receives `url` prop from Fresh. Use `url.pathname` to compare against each link's href and apply the daisyUI `active` class. Use exact match for `/` and `/about`, `startsWith` for section prefixes like `/articles`, `/submissions`, `/faq`.

**Navbar component:** Uses `menu menu-horizontal` (not `tabs`) — `tabs` is for panel-switching UI, not page navigation.

**Semantic HTML conventions used in this project:**
- Nav links: `nav > ul > li > a` (not bare `nav > a`) for screen reader list count
- Logo/brand: `<a href="/" aria-label="PUP Guide — Home">` — no `<h1>` in layout to avoid duplicate headings per page
- Use `<header>`, `<main>`, `<footer>` as landmark elements
- Empty states: inline SVG (not PNG) for scalability and theme compatibility
- Icon-only links must have `aria-label`

**Content width:** `<main>` is full width. Individual pages set their own max-width via Tailwind (`max-w-prose mx-auto px-4` for article pages, wider for admin tables, etc.).

---

## Theme

Currently paused the use of custom theme during development since the designer in-charge is away and haven't yet created the natural light and dark theme based on pup logo.

**daisyUI v5 conventions:** CSS variables use `--color-primary`, NOT `--p`. Component classes: `btn-primary`, `btn-ghost`, `badge-success`, etc.

---

## Submission Types

`submissions.type` enum is `"problem" | "request" | "question"` — NOT the old `"article" | "faq"`. This is correct in both `0006_submissions.sql` CHECK constraint and `lib/types.ts` Zod schema. The UI labels these as "Problem", "Request", "Question" for friendliness. The submissions nav link is called **"Help & Feedback"**.

---

## Layout Structure (planned)

```
routes/
├── _app.tsx              ← HTML shell, sets data-theme on <html>
├── _layout.tsx           ← Public navbar (logo, nav links, theme toggle)
├── login.tsx             ← skipInheritedLayouts: true (standalone page)
└── admin/
    └── _layout.tsx       ← Admin sidebar, skipInheritedLayouts: true
```

**Navbar link names (public):** Home, Guides, Help & Feedback, FAQ, About

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
│   └── styles.css                    ✅ pup + pup-dark daisyUI themes
├── data/
│   └── app.db
├── db/
│   ├── migrations/
│   │   ├── 0001_users.sql
│   │   ├── 0002_sessions.sql
│   │   ├── 0003_articles.sql
│   │   ├── 0004_article_comments.sql
│   │   ├── 0005_faq.sql
│   │   ├── 0006_submissions.sql      ✅ type: problem/request/question
│   │   ├── 0007_submissions_comments.sql
│   │   └── 0008_visits.sql
│   ├── client.ts
│   ├── migrate.ts
│   └── schema.ts                     ✅ fully updated
├── lib/
│   ├── types.ts                      ✅ submission type fixed to problem/request/question
│   ├── crypto.ts
│   └── token.ts
├── islands/
│   ├── LoginForm.tsx                 ✅
│   ├── CommentForm.tsx               ✅
│   ├── SubmissionForm.tsx            ✅
│   └── SubmissionCommentForm.tsx     ✅
├── routes/
│   ├── _app.tsx                      ⏳ needs data-theme on <html>
│   ├── _layout.tsx                   ⏳ navbar + footer done, theme toggle + user state pending
│   ├── _middleware.ts                ✅ session → User mapping + visit logging
│   ├── index.tsx                     ✅ article feed + search bar (SSR GET search)
│   ├── login.tsx                     ⏳ needs skipInheritedLayouts
│   ├── logout.ts                     ✅
│   ├── faq.tsx                       ⏳ placeholder only
│   ├── about.tsx                     ⏳ placeholder only
│   ├── articles/
│   │   └── [slug].tsx                ⏳ placeholder only
│   ├── submissions/
│   │   ├── index.tsx                 ⏳ placeholder only
│   │   └── [id].tsx                  ⏳ placeholder only
│   └── api/
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
│           ├── _middleware.ts        ✅ blocks non-admin/editor
│           ├── users/
│           │   └── index.ts          ✅
│           └── visits/
│               └── index.ts          ✅
├── static/
│   ├── favicon.ico
│   ├── logo.png
│   └── logo.svg                      ✅ used as <img src="/logo.svg"> in navbar + footer, h-10 w-auto
├── utils.ts                          ✅
├── deno.json                         ✅
└── vite.config.ts
```

---

## Current State

All API routes complete. DB layer complete. Islands complete. `_layout.tsx` navbar and footer are complete (logo, active nav, social links) but theme toggle and user state awareness are still pending. `_app.tsx` not yet wired with `data-theme`, so the custom maroon/gold theme does not apply visually yet (running on daisyUI built-in theme). `index.tsx` is fully functional with article feed and SSR search.

### Done ✅
- Entire DB layer: migrations, Zod schemas, query helpers
- All auth, article, FAQ, submission, and admin API routes
- All four islands (login form, comment form, submission form, submission comment form)
- Maroon/gold daisyUI CSS theme (light + dark)
- `_layout.tsx` — navbar (logo, active nav links, `menu menu-horizontal`), sticky footer, logo in both header and footer
- `index.tsx` — published article feed, SSR GET search, empty state inline SVG, article cards with excerpt helper
- Logout route (SSR POST, no JS needed)
- Visit logging in `routes/_middleware.ts`
- Submission type enum corrected to `problem/request/question`

### What's next ⏳
1. **`_app.tsx`** — wire up HTML shell with `data-theme="pup"` on `<html>`, import CSS
2. **Theme toggle island** — small island, click sets `document.documentElement.dataset.theme`, persists to cookie
3. **`_layout.tsx`** — add theme toggle button, add user state awareness (login/logout link, admin link if admin)
4. **`login.tsx`** — `skipInheritedLayouts: true`, use existing `LoginForm` island
5. **Public pages** — `faq.tsx`, `about.tsx`, `submissions/index.tsx`, `submissions/[id].tsx`, `articles/[slug].tsx`
6. **`routes/admin/_layout.tsx`** — admin sidebar, `skipInheritedLayouts: true`
7. **Admin pages** — dashboard, articles, FAQ, submissions, users (all SSR + PRG)
8. **Admin islands** — article editor (markdown preview), FAQ editor, role selector

**Approach for admin mutations:** Pure SSR + PRG (Post/Redirect/Get). Each admin page handles `GET` (load) and `POST` (with `_action` field to dispatch create/update/delete). No new islands until basic pages work.

---

## Important Gotchas

- **`daisyui` is v5** — CSS variable names follow v5 conventions (`--color-primary`, not `--p`)
- **`@tailwindcss/typography`** must be in `deno.json` imports for `@plugin "@tailwindcss/typography"` in styles.css
- **`class` not `className`** — this is Preact. `className` technically works but is not idiomatic and should be avoided
- **`page()` not `ctx.render()` for data** — `ctx.render(data)` causes TS2353 type errors in Fresh 2.x; use `import { page } from "fresh"` instead
- **Anonymous submissions:** `user_id` is always stored — `anonymous` flag only controls public exposure. Route layer strips `user_id`/`username` for non-admin views
- **`submission_comments`** has its own `anonymous` column independent of the parent submission's flag
- **`faq` has no `findById`** in schema.ts — use `faq.findAll().find(i => i.id === id)` in routes
- **`users.updateRole()`** exists in `db/schema.ts` — double-check before calling
- **Admin self-protection:** admins cannot change their own role or delete their own account — enforced in API, must also be reflected in UI (disable/hide controls when `user.id === row.id`)
- **Editor access:** `routes/admin/_middleware.ts` allows both `admin` and `editor` through. Pages that are admin-only (dashboard, users, submissions) must do an additional inline role check and redirect editors away
- **Empty states:** use inline SVG, not PNG — SVG scales and can be themed with CSS
- **Content width:** set per-page, not on `<main>` in layout. Use `max-w-prose mx-auto px-4` for reading content, wider containers for tables/dashboards
- **No `<h1>` in `_layout.tsx`** — every page has its own `<h1>`. Layout brand uses styled `<a>` with `aria-label` instead
- **`data-theme` not applied yet** — `_app.tsx` needs to set it on `<html>` before any theme styles render
