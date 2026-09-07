import "dotenv/config";
import { z } from "zod";

const schema = z.object({
  DATABASE_URL: z.url(),
  JWT_SECRET: z.string().min(32),
  CLIENT_ORIGIN: z.url(),
  PORT: z.coerce.number().int().min(1).max(65535).default(4000),
  NODE_ENV: z.enum(["development", "test", "production"]).default("development")
});

const result = schema.safeParse(process.env);
if (!result.success) throw new Error(`Invalid environment variables: ${result.error.issues.map(issue => issue.path.join(".")).join(", ")}`);
export const env = result.data;
if (new URL(env.CLIENT_ORIGIN).origin !== env.CLIENT_ORIGIN) throw new Error("CLIENT_ORIGIN must be an origin without a path or trailing slash.");
if (env.NODE_ENV === "production" && !env.CLIENT_ORIGIN.startsWith("https://")) throw new Error("Production CLIENT_ORIGIN requires HTTPS.");
