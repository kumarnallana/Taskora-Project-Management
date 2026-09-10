import "dotenv/config";
import { z } from "zod";

const schema = z.object({
  DATABASE_URL: z.string().min(1),
  JWT_SECRET: z.string().min(8).default("taskora-jwt-secret-key-production-default-2026"),
  CLIENT_ORIGIN: z.string().optional(),
  CORS_ORIGIN: z.string().optional(),
  PORT: z.coerce.number().int().min(1).max(65535).default(4000),
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
});

const result = schema.safeParse(process.env);
if (!result.success) {
  console.error("Invalid environment variables:", result.error.issues);
  throw new Error(
    `Invalid environment variables: ${result.error.issues.map((issue) => issue.path.join(".")).join(", ")}`,
  );
}

const rawEnv = result.data;
const effectiveOrigin = rawEnv.CLIENT_ORIGIN || rawEnv.CORS_ORIGIN || "*";

export const env = {
  ...rawEnv,
  CLIENT_ORIGIN: effectiveOrigin,
};
