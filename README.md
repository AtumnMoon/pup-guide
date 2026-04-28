# Guide

Techstack used for this project is as follows.

- Client
  - ??? - currently undecided
  
- Server
  - Hono - for API and Router
  - Argon2id - for hashing password with a custom 'Salt' for complexity
  - SQLite - for lightweight database

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
