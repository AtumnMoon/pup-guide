# PUP Guide

A pet care guide web app for **PUP Sta. Rosa Campus** — built with Fresh 2, Deno, and SQLite.

## Stack

| Layer | Technology |
|---|---|
| Framework | Fresh 2.3.3 (SSR + Preact islands) |
| Runtime | Deno 2 |
| Database | SQLite via `@mainframe-api/deno-sqlite` (WASM) |
| Auth | Session-based `httpOnly` cookie |
| Styling | Tailwind CSS 4 + daisyUI v5 |
| Validation | Zod 4 |
| Markdown | `@deno/gfm` |

## Prerequisites

- [Deno 2](https://docs.deno.com/runtime/getting_started/installation)

## Getting Started

1. Clone the repo and enter the directory:
   ```sh
   git clone <repo-url>
   cd pup-guide
   ```

2. Copy the environment file and fill in the values:
   ```sh
   cp .env.sample .env
   ```
   Set `APP_PEPPER` to any long random string. This is used to hash passwords — don't change it after users have registered.

3. Start the dev server (runs migrations automatically):
   ```sh
   deno task dev
   ```

The app will be available at `http://localhost:8000`.

## Tasks

```sh
# Development
deno task dev       # Run migrations then start the dev server with HMR
deno task migrate   # Run DB migrations manually
deno task check     # Format, lint, and type-check the project

# Production
deno task build     # Build the project for production
deno task start     # Serve the built output (requires build first)

# Maintenance
deno task update    # Update Fresh to the latest version
```

## Project Structure

```
routes/       # File-based routing (Fresh)
├── api/      # JSON API endpoints
├── admin/    # Admin-only pages (role-gated)
islands/      # Interactive Preact components (client-side)
db/
├── migrations/   # SQL migration files (auto-applied on dev/migrate)
├── schema.ts     # All DB query helpers
└── client.ts     # SQLite client singleton
lib/
├── types.ts      # Zod schemas + inferred TS types
└── crypto.ts     # Password hashing (Argon2id)
assets/
└── styles.css    # Tailwind + daisyUI theme (PUP maroon/gold)
```

## Default Roles

| Role | Description |
|---|---|
| `user` | Default on registration |
| `editor` | Can create and manage articles |
| `admin` | Full access including dashboard and user management |

Roles can be changed by an admin via the Admin Dashboard → Users.
