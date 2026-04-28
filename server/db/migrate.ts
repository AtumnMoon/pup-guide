import db from "./client.ts";
import { join } from "@std/path";
import { walk } from "@std/fs";

db.query(`
  CREATE TABLE IF NOT EXISTS _migrations (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    name       TEXT    NOT NULL UNIQUE,
    applied_at TEXT    NOT NULL DEFAULT (datetime('now'))
  );
`);

const migrationsDir = join(import.meta.dirname!, "./migrations");

for await (
  const entry of walk(migrationsDir, { exts: [".sql"], maxDepth: 1 })
) {
  const name = entry.name;

  const already =
    db.queryEntries("SELECT 1 FROM _migrations WHERE name = ?", [name])[0];
  if (already) continue;

  const sql = await Deno.readTextFile(entry.path);
  db.query(sql);
  db.query("INSERT INTO _migrations (name) VALUES (?)", [name]);

  console.log(`✓ Applied migration: ${name}`);
}

console.log("Migrations complete.");
