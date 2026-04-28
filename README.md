# GUIDE

Techstack used for this project is as follows.

- Client
  - Astro - static site generator

- Server
  - Hono - API framework
  - hash-wasm - Argon2id password hashing with pepper
  - SQLite (WASM) - lightweight database

## Running the Server

### Prerequisites
- [Deno](https://deno.land) v2.0+

### Setup

**1. Clone the repo and enter the project root:**
```sh
git clone <repo-url>
cd pup-guide
```

**2. Create the server environment file:**
```sh
cp server/.env.sample server/.env
```

Then fill in `server/.env`:
```sh
HOST=0.0.0.0
PORT=8000
APP_PEPPER=your-secret-pepper-here
```

**3. Run migrations, sync content, and start the server:**
```sh
deno task dev
```

This runs three steps in order:
- `deno task migrate` — creates the database and applies all migrations
- `deno task sync` — exports published articles to the Astro content folder
- `deno task --cwd server dev` — starts the Hono server

The API will be available at `http://localhost:8000/api`.

### Individual Tasks

| Task | Command | Description |
|------|---------|-------------|
| Start server only | `deno task --cwd server dev` | Skips migrate and sync |
| Run migrations only | `deno task migrate` | Applies any pending `.sql` migrations |
| Sync content only | `deno task sync` | Writes published articles as `.md` files |

---

## API Endpoints

Base URL: `http://localhost:8000/api`

### Auth
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/auth/login` | — | Login and receive session cookie |
| POST | `/auth/logout` | User | Logout and clear session cookie |
| GET | `/auth/me` | User | Get current user data |

### Articles
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/articles` | — | Get all published articles |
| GET | `/articles/:slug` | — | Get a specific article by slug |
| PATCH | `/articles/:id/edit` | User | Edit article body (appends to edit history) |
| DELETE | `/articles/:id` | Admin | Delete a specific article |

### FAQ
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/faq` | — | Get all FAQ items |
| POST | `/faq` | Admin | Create a new FAQ item |
| PATCH | `/faq/:id` | Admin | Update a FAQ item's question and answer |
| PATCH | `/faq/:id/reorder` | Admin | Change a FAQ item's position |
| DELETE | `/faq/:id` | Admin | Delete a FAQ item |

### Submissions
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/submissions` | — | Submit feedback or a report (anonymous ok) |
| GET | `/submissions` | Admin | Get all submissions (filter by `?status=`) |
| PATCH | `/submissions/:id/status` | Admin | Update a submission's status |
| DELETE | `/submissions/:id` | Admin | Delete a submission |

### Visits
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/visits` | Admin | Get all visit logs |
| GET | `/visits/stats` | Admin | Get unique visitor count |
| GET | `/visits/path?path=` | Admin | Get visits for a specific path |

### Admin
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/admin/stats` | Admin | Get counts of users, articles, submissions, visitors |
| GET | `/admin/users` | Admin | Get all users |
| DELETE | `/admin/users/:id` | Admin | Delete a specific user |
| GET | `/admin/articles` | Admin | Get all articles (including unpublished) |
| PATCH | `/admin/articles/:id/publish` | Admin | Set published status of an article |

### Auth Legend
| Value | Meaning |
|-------|---------|
| — | No authentication required |
| User | Requires valid session cookie |
| Admin | Requires admin role |
