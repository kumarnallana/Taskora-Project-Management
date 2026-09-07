import { randomBytes } from "node:crypto";
import { writeFile } from "node:fs/promises";
const password = randomBytes(24).toString("hex");
const jwt = randomBytes(48).toString("hex");
const content = `DATABASE_URL=postgresql://taskora:${password}@127.0.0.1:5433/taskora
JWT_SECRET=${jwt}
CLIENT_ORIGIN=http://localhost:3000
API_INTERNAL_URL=http://127.0.0.1:4000
PORT=4000
NODE_ENV=development
`;
try {
  await writeFile(".env", content, { flag: "wx", mode: 0o600 });
  console.log("Created .env with random local credentials.");
} catch (error) {
  if (error.code === "EEXIST")
    console.log(".env already exists; preserving your configuration.");
  else throw error;
}
