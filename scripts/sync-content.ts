/**
 * Runs on every server restart (before Hono boots).
 * Reads all published articles from DB → writes them as .md files
 * into the Astro content collection folder.
 *
 * Para maging static contents nalang yung mga user-created
 * contents imbis na need pa basahin sa database everytime
 */

import { DB } from "@mainframe-api/deno-sqlite";
import { join } from "@std/path";
import { ensureDir } from "@std/fs";

const DB_PATH = join(import.meta.dirname!, "../server/data/app.db");
const CONTENT_DIR = join(
  import.meta.dirname!,
  "../client/src/content/articles",
);

// DB won't exist on first run before migrate, exit cleanly
try {
  await Deno.stat(DB_PATH);
} catch {
  console.log("No DB found, skipping sync.");
  Deno.exit(0);
}

const db = new DB(DB_PATH);

interface Article {
  slug: string;
  title: string;
  body_md: string;
  author: string | null;
  created_at: string;
  updated_at: string;
}

const rows = db.queryEntries(`
  SELECT
    a.slug,
    a.title,
    a.body_md,
    u.username AS author,
    a.created_at,
    a.updated_at
  FROM articles a
  LEFT JOIN users u ON u.id = a.author_id
  WHERE a.published = 1
`) as unknown as Article[];

await ensureDir(CONTENT_DIR);

// Remove stale .md files that are no longer in DB
for await (const entry of Deno.readDir(CONTENT_DIR)) {
  if (!entry.name.endsWith(".md")) continue;
  const slug = entry.name.replace(/\.md$/, "");
  const stillExists = rows.some((r) => r.slug === slug);
  if (!stillExists) {
    await Deno.remove(join(CONTENT_DIR, entry.name));
    console.log(`✗ Removed stale: ${entry.name}`);
  }
}

// Write/overwrite each article
for (const row of rows) {
  const frontmatter = [
    "---",
    `title: "${row.title.replace(/"/g, '\\"')}"`,
    `author: "${row.author ?? "Anonymous"}"`,
    `pubDate: "${row.created_at}"`,
    `updatedDate: "${row.updated_at}"`,
    "---",
  ].join("\n");

  const content = `${frontmatter}\n\n${row.body_md}`;
  const filePath = join(CONTENT_DIR, `${row.slug}.md`);

  await Deno.writeTextFile(filePath, content);
  console.log(`✓ Synced: ${row.slug}.md`);
}

console.log(`Synced ${rows.length} articles → ${CONTENT_DIR}`);
db.close();
