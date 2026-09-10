import "dotenv/config";
import EmbeddedPostgres from "embedded-postgres";
import { access, mkdir } from "node:fs/promises";

const url = new URL(process.env.DATABASE_URL || "");
if (process.env.NODE_ENV === "production" || url.hostname !== "127.0.0.1")
  throw new Error(
    "Local database requires a development DATABASE_URL on 127.0.0.1.",
  );
await mkdir(".local", { recursive: true });
const pg = new EmbeddedPostgres({
  databaseDir: ".local/postgres",
  user: decodeURIComponent(url.username),
  password: decodeURIComponent(url.password),
  port: Number(url.port || 5432),
  persistent: true,
  authMethod: "scram-sha-256",
  postgresFlags: ["-h", "127.0.0.1"],
});
const initialized = await access(".local/postgres/PG_VERSION")
  .then(() => true)
  .catch(() => false);
if (!initialized) await pg.initialise();
await pg.start();
const client = pg.getPgClient();
await client.connect();
const name = url.pathname.slice(1);
if (!/^[a-z][a-z0-9_]*$/.test(name))
  throw new Error("Use a simple lowercase local database name.");
const exists = await client.query(
  "SELECT 1 FROM pg_database WHERE datname = $1",
  [name],
);
await client.end();
if (!exists.rowCount) await pg.createDatabase(name);
console.log(`Local PostgreSQL is ready on port ${url.port || 5432}.`);
for (const signal of ["SIGINT", "SIGTERM"])
  process.once(signal, async () => {
    await pg.stop();
    process.exit(0);
  });
