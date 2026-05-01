# Project Goals

Guide web app built as a school project

---

## Pages

### Blog Articles
A markdown-rendered article feed maintained by editors and admins.

- [ ] List of published articles on the home page
- [ ] Individual article page with GFM markdown rendering
- [ ] Comment section per article (logged-in users only)
- [ ] Create / edit article (editor + admin)
- [ ] Delete article (editor + admin)
- [ ] Publish / unpublish toggle (editor + admin)

### FAQ
A curated list of frequently asked questions.

- [ ] Public FAQ listing page
- [ ] Create / edit FAQ items (admin only)
- [ ] Reorder FAQ items via position (admin only)
- [ ] Delete FAQ items (admin only)

### Submissions (Problem / Request / Question)
A channel for users to raise concerns or suggestions.

- [ ] Submit a problem, request, or question (logged-in users)
- [ ] Option to post anonymously — username is hidden publicly but visible to admin
- [ ] View own submissions and their status
- [ ] Comment on a submission (logged-in users)
- [ ] Option to comment anonymously — same visibility rules as submissions
- [ ] Update submission status: `pending → approved / rejected` (admin only)
- [ ] Delete submissions and comments (admin only)

### Admin Dashboard
Central control panel, accessible to admins only.

- [ ] Overview stats: total users, articles, submissions, unique visitors
- [ ] Recent visit log (path, IP, user agent, username if logged in)

### Admin Management Pages
- [ ] **Articles** — full list including unpublished; create, edit, publish/unpublish, delete
- [ ] **FAQ** — create, edit, reorder, delete items
- [ ] **Submissions** — full list with status filters; update status, delete
- [ ] **Users** — list all users; change role, delete account (cannot self-modify)

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

## Implementation Progress

### Done
- DB layer: migrations, Zod schemas, query helpers
- Auth: registration, login, session cookie, logout
- API routes: articles, comments, FAQ, submissions, admin (users, visits)
- Islands: login form, comment form, submission form, submission comment form
- PUP maroon/gold daisyUI theme
- App shell (`_app.tsx`, `_layout.tsx`, `_middleware.ts`)
- Visit logging middleware

### In Progress
- Public pages: home, article view, FAQ, login, submission form and view
- Admin frontend pages (`routes/admin/`)
  - `_middleware.ts` — redirect non-editors/admins
  - `index.tsx` — dashboard overview
  - `articles.tsx` — article management
  - `faq.tsx` — FAQ management
  - `submissions.tsx` — submission management
  - `users.tsx` — user management
- Admin islands for interactive actions (article editor, FAQ editor, role selector)

### Remaining
- Final integration testing
- Seed script for demo data
- Deployment setup
