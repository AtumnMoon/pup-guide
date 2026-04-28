import { DB } from "@mainframe-api/deno-sqlite";
import { join } from "@std/path";
import { ensureDirSync } from "@std/fs";

const DATA_DIR = join(import.meta.dirname!, "../data");
const DB_PATH = join(DATA_DIR, "app.db");

ensureDirSync(DATA_DIR);

const db = new DB(DB_PATH);

db.query("PRAGMA foreign_keys = ON;");

export default db;
