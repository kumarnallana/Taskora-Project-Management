import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import { env } from "./config/env";
import { prisma } from "./db/prisma";
import { authenticate } from "./middleware/auth";
import { AppError, errorHandler } from "./middleware/error";
import { authRouter } from "./domains/auth/routes";
import { projectRouter } from "./domains/projects/routes";
import { memberRouter } from "./domains/members/routes";
import { projectTaskRouter, taskRouter } from "./domains/tasks/routes";

export const app = express();
app.disable("x-powered-by");
app.use(helmet());
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow any origin or reflection for credentials
      callback(null, true);
    },
    credentials: true,
  }),
);
app.use("/api", (_req, res, next) => {
  res.set("Cache-Control", "no-store");
  next();
});
app.use((req, _res, next) => {
  if (
    env.CLIENT_ORIGIN !== "*" &&
    !["GET", "HEAD", "OPTIONS"].includes(req.method) &&
    req.headers.origin &&
    req.headers.origin !== env.CLIENT_ORIGIN
  )
    throw new AppError(
      403,
      "INVALID_ORIGIN",
      "This request origin is not allowed.",
    );
  next();
});
app.use(express.json({ limit: "32kb" }));
app.use(cookieParser());
app.get("/api/health", async (_req, res) => {
  await prisma.$runCommandRaw({ ping: 1 });
  res.json({ status: "ok" });
});
app.use("/api/auth", authRouter);
app.use("/api/projects", authenticate, projectRouter);
app.use("/api/projects/:projectId/members", authenticate, memberRouter);
app.use("/api/projects/:projectId/tasks", authenticate, projectTaskRouter);
app.use("/api/tasks", authenticate, taskRouter);
app.use((_req, _res) => {
  throw new AppError(404, "NOT_FOUND", "Endpoint not found.");
});
app.use(errorHandler);
