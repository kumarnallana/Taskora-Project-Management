# Taskora - Complete Codebase Repository Export

> This document contains the complete, unabridged source code for all modules, services, backend routes, database schemas, frontend components, pages, styles, and configurations developed for the Taskora project management platform.

## Table of Contents

- [prisma/schema.prisma](#prisma-schema-prisma)
- [prisma/migrations/20260907000000_initial/migration.sql](#prisma-migrations-20260907000000-initial-migration-sql)
- [server/tsconfig.json](#server-tsconfig-json)
- [server/src/types/express.d.ts](#server-src-types-express-d-ts)
- [server/src/config/env.ts](#server-src-config-env-ts)
- [server/src/db/prisma.ts](#server-src-db-prisma-ts)
- [server/src/middleware/auth.ts](#server-src-middleware-auth-ts)
- [server/src/middleware/error.ts](#server-src-middleware-error-ts)
- [server/src/domains/auth/routes.ts](#server-src-domains-auth-routes-ts)
- [server/src/domains/projects/access.ts](#server-src-domains-projects-access-ts)
- [server/src/domains/projects/routes.ts](#server-src-domains-projects-routes-ts)
- [server/src/domains/members/routes.ts](#server-src-domains-members-routes-ts)
- [server/src/domains/tasks/routes.ts](#server-src-domains-tasks-routes-ts)
- [server/src/app.ts](#server-src-app-ts)
- [server/src/server.ts](#server-src-server-ts)
- [server/tests/api.test.ts](#server-tests-api-test-ts)
- [src/types/domain.ts](#src-types-domain-ts)
- [src/services/api/client.ts](#src-services-api-client-ts)
- [src/services/api/auth.ts](#src-services-api-auth-ts)
- [src/services/api/projects.ts](#src-services-api-projects-ts)
- [src/services/api/tasks.ts](#src-services-api-tasks-ts)
- [src/components/shared/Brand.tsx](#src-components-shared-brand-tsx)
- [src/components/shared/Avatar.tsx](#src-components-shared-avatar-tsx)
- [src/components/shared/Feedback.tsx](#src-components-shared-feedback-tsx)
- [src/components/shared/Dialog.tsx](#src-components-shared-dialog-tsx)
- [src/components/shell/AppShell.tsx](#src-components-shell-appshell-tsx)
- [src/components/auth/AuthForm.tsx](#src-components-auth-authform-tsx)
- [src/components/projects/ProjectCard.tsx](#src-components-projects-projectcard-tsx)
- [src/components/projects/ProjectForm.tsx](#src-components-projects-projectform-tsx)
- [src/components/projects/ProjectWorkspace.tsx](#src-components-projects-projectworkspace-tsx)
- [src/components/tasks/TaskBoard.tsx](#src-components-tasks-taskboard-tsx)
- [src/components/tasks/TaskForm.tsx](#src-components-tasks-taskform-tsx)
- [src/components/tasks/TaskList.tsx](#src-components-tasks-tasklist-tsx)
- [src/components/members/MembersPanel.tsx](#src-components-members-memberspanel-tsx)
- [src/app/layout.tsx](#src-app-layout-tsx)
- [src/app/page.tsx](#src-app-page-tsx)
- [src/app/error.tsx](#src-app-error-tsx)
- [src/app/not-found.tsx](#src-app-not-found-tsx)
- [src/app/(auth)/layout.tsx](#src-app--auth--layout-tsx)
- [src/app/(auth)/login/page.tsx](#src-app--auth--login-page-tsx)
- [src/app/(auth)/register/page.tsx](#src-app--auth--register-page-tsx)
- [src/app/(workspace)/layout.tsx](#src-app--workspace--layout-tsx)
- [src/app/(workspace)/dashboard/page.tsx](#src-app--workspace--dashboard-page-tsx)
- [src/app/(workspace)/projects/page.tsx](#src-app--workspace--projects-page-tsx)
- [src/app/(workspace)/projects/[projectId]/page.tsx](#src-app--workspace--projects--projectid--page-tsx)
- [src/app/(workspace)/my-tasks/page.tsx](#src-app--workspace--my-tasks-page-tsx)
- [data/brand/index.ts](#data-brand-index-ts)
- [data/navigation/index.ts](#data-navigation-index-ts)
- [data/marketing/index.ts](#data-marketing-index-ts)
- [data/tasks.ts](#data-tasks-ts)
- [src/styles/tokens.css](#src-styles-tokens-css)
- [src/styles/animations.css](#src-styles-animations-css)
- [src/styles/globals.css](#src-styles-globals-css)
- [package.json](#package-json)
- [tsconfig.json](#tsconfig-json)
- [next.config.ts](#next-config-ts)
- [Dockerfile](#dockerfile)
- [compose.yaml](#compose-yaml)
- [scripts/setup-env.mjs](#scripts-setup-env-mjs)
- [scripts/local-db.mjs](#scripts-local-db-mjs)
- [playwright.config.ts](#playwright-config-ts)
- [e2e/workspace.spec.ts](#e2e-workspace-spec-ts)
- [.env.example](#-env-example)
- [README.md](#readme-md)

---

### `prisma/schema.prisma`

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

enum TaskStatus {
  TODO
  IN_PROGRESS
  DONE
}

model User {
  id           String          @id @default(uuid()) @db.Uuid
  name         String          @db.VarChar(80)
  email        String          @unique @db.VarChar(254)
  passwordHash String
  createdAt    DateTime        @default(now())
  updatedAt    DateTime        @updatedAt
  projects     Project[]
  memberships  ProjectMember[]
  assignments  Task[]
}

model Project {
  id          String          @id @default(uuid()) @db.Uuid
  name        String          @db.VarChar(120)
  description String          @default("") @db.VarChar(4000)
  ownerId     String          @db.Uuid
  owner       User            @relation(fields: [ownerId], references: [id], onDelete: Restrict)
  createdAt   DateTime        @default(now())
  updatedAt   DateTime        @updatedAt
  members     ProjectMember[]
  tasks       Task[]

  @@index([ownerId])
}

model ProjectMember {
  projectId String   @db.Uuid
  userId    String   @db.Uuid
  createdAt DateTime @default(now())
  project   Project  @relation(fields: [projectId], references: [id], onDelete: Cascade)
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@id([projectId, userId])
  @@index([userId])
}

model Task {
  id          String     @id @default(uuid()) @db.Uuid
  projectId   String     @db.Uuid
  title       String     @db.VarChar(160)
  description String     @default("") @db.VarChar(4000)
  status      TaskStatus @default(TODO)
  assigneeId  String?    @db.Uuid
  createdAt   DateTime   @default(now())
  updatedAt   DateTime   @updatedAt
  project     Project    @relation(fields: [projectId], references: [id], onDelete: Cascade)
  assignee    User?      @relation(fields: [assigneeId], references: [id], onDelete: SetNull)

  @@index([projectId, status])
  @@index([assigneeId])
}
```

---

### `prisma/migrations/20260907000000_initial/migration.sql`

```sql
CREATE TYPE "TaskStatus" AS ENUM ('TODO', 'IN_PROGRESS', 'DONE');
CREATE TABLE "User" (
  "id" UUID NOT NULL,
  "name" VARCHAR(80) NOT NULL,
  "email" VARCHAR(254) NOT NULL,
  "passwordHash" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "Project" (
  "id" UUID NOT NULL,
  "name" VARCHAR(120) NOT NULL,
  "description" VARCHAR(4000) NOT NULL DEFAULT '',
  "ownerId" UUID NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "ProjectMember" (
  "projectId" UUID NOT NULL,
  "userId" UUID NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ProjectMember_pkey" PRIMARY KEY ("projectId", "userId")
);
CREATE TABLE "Task" (
  "id" UUID NOT NULL,
  "projectId" UUID NOT NULL,
  "title" VARCHAR(160) NOT NULL,
  "description" VARCHAR(4000) NOT NULL DEFAULT '',
  "status" "TaskStatus" NOT NULL DEFAULT 'TODO',
  "assigneeId" UUID,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Task_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE INDEX "Project_ownerId_idx" ON "Project"("ownerId");
CREATE INDEX "ProjectMember_userId_idx" ON "ProjectMember"("userId");
CREATE INDEX "Task_projectId_status_idx" ON "Task"("projectId", "status");
CREATE INDEX "Task_assigneeId_idx" ON "Task"("assigneeId");
ALTER TABLE "Project" ADD CONSTRAINT "Project_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "ProjectMember" ADD CONSTRAINT "ProjectMember_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ProjectMember" ADD CONSTRAINT "ProjectMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Task" ADD CONSTRAINT "Task_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Task" ADD CONSTRAINT "Task_assigneeId_fkey" FOREIGN KEY ("assigneeId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
```

---

### `server/tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "CommonJS",
    "moduleResolution": "node",
    "rootDir": "src",
    "outDir": "../dist/server",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true
  },
  "include": ["src/**/*.ts"]
}
```

---

### `server/src/types/express.d.ts`

```typescript
declare global {
  namespace Express {
    interface Locals {
      user: { id: string; name: string; email: string };
    }
  }
}

export {};
```

---

### `server/src/config/env.ts`

```typescript
import "dotenv/config";
import { z } from "zod";

const schema = z.object({
  DATABASE_URL: z.url(),
  JWT_SECRET: z.string().min(32),
  CLIENT_ORIGIN: z.url(),
  PORT: z.coerce.number().int().min(1).max(65535).default(4000),
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
});

const result = schema.safeParse(process.env);
if (!result.success)
  throw new Error(
    `Invalid environment variables: ${result.error.issues.map((issue) => issue.path.join(".")).join(", ")}`,
  );
export const env = result.data;
if (new URL(env.CLIENT_ORIGIN).origin !== env.CLIENT_ORIGIN)
  throw new Error(
    "CLIENT_ORIGIN must be an origin without a path or trailing slash.",
  );
if (env.NODE_ENV === "production" && !env.CLIENT_ORIGIN.startsWith("https://"))
  throw new Error("Production CLIENT_ORIGIN requires HTTPS.");
```

---

### `server/src/db/prisma.ts`

```typescript
import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();
export const safeUser = { id: true, name: true, email: true } as const;
```

---

### `server/src/middleware/auth.ts`

```typescript
import type { RequestHandler, CookieOptions } from "express";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { env } from "../config/env";
import { prisma, safeUser } from "../db/prisma";
import { AppError } from "./error";

export const cookieName = "taskora_session";
export const cookieOptions: CookieOptions = {
  httpOnly: true,
  secure: env.NODE_ENV === "production",
  sameSite: "lax",
  path: "/",
};
export const sessionSeconds = 60 * 60 * 24 * 7;

export const authenticate: RequestHandler = async (req, res, next) => {
  const token = req.cookies[cookieName];
  if (typeof token !== "string")
    throw new AppError(401, "UNAUTHENTICATED", "Sign in to continue.");
  let userId: string;
  try {
    const payload = jwt.verify(token, env.JWT_SECRET, {
      algorithms: ["HS256"],
      issuer: "taskora",
      audience: "taskora-web",
    });
    if (typeof payload === "string") throw new Error("Invalid session");
    userId = z.uuid().parse(payload.sub);
  } catch {
    res.clearCookie(cookieName, cookieOptions);
    throw new AppError(
      401,
      "SESSION_EXPIRED",
      "Your session has expired. Please sign in again.",
    );
  }
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: safeUser,
  });
  if (!user) throw new AppError(401, "UNAUTHENTICATED", "Sign in to continue.");
  res.locals.user = user;
  next();
};
```

---

### `server/src/middleware/error.ts`

```typescript
import type { ErrorRequestHandler } from "express";
import { Prisma } from "@prisma/client";
import { ZodError } from "zod";

export class AppError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string,
  ) {
    super(message);
  }
}

export const errorHandler: ErrorRequestHandler = (
  error: unknown,
  _req,
  res,
  _next,
) => {
  if (error instanceof AppError) {
    res
      .status(error.status)
      .json({ error: { code: error.code, message: error.message } });
    return;
  }
  if (error instanceof ZodError) {
    res
      .status(400)
      .json({
        error: {
          code: "INVALID_INPUT",
          message: error.issues
            .map(
              (issue) => `${issue.path.join(".") || "Input"}: ${issue.message}`,
            )
            .join(" "),
        },
      });
    return;
  }
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2002") {
      res
        .status(409)
        .json({
          error: {
            code: "ALREADY_EXISTS",
            message: "This record already exists.",
          },
        });
      return;
    }
    if (error.code === "P2025") {
      res
        .status(404)
        .json({
          error: {
            code: "NOT_FOUND",
            message: "This record no longer exists.",
          },
        });
      return;
    }
    if (["P2003", "P2034"].includes(error.code)) {
      res
        .status(409)
        .json({
          error: {
            code: "WRITE_CONFLICT",
            message:
              "The project changed during this action. Refresh and try again.",
          },
        });
      return;
    }
  }
  if (
    typeof error === "object" &&
    error !== null &&
    "status" in error &&
    (error.status === 400 || error.status === 413)
  ) {
    res
      .status(error.status)
      .json({
        error: {
          code: "INVALID_BODY",
          message: "The request body is invalid or too large.",
        },
      });
    return;
  }
  console.error(error);
  res
    .status(500)
    .json({
      error: {
        code: "INTERNAL_ERROR",
        message: "Something went wrong. Please try again.",
      },
    });
};
```

---

### `server/src/domains/auth/routes.ts`

```typescript
import { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { rateLimit } from "express-rate-limit";
import { z } from "zod";
import { env } from "../../config/env";
import { prisma, safeUser } from "../../db/prisma";
import {
  authenticate,
  cookieName,
  cookieOptions,
  sessionSeconds,
} from "../../middleware/auth";
import { AppError } from "../../middleware/error";

export const emailSchema = z.string().trim().toLowerCase().email().max(254);
const passwordSchema = z
  .string()
  .min(8, "Use at least 8 characters.")
  .refine(
    (value) => Buffer.byteLength(value, "utf8") <= 72,
    "Use at most 72 bytes.",
  );
const credentials = z
  .object({ email: emailSchema, password: passwordSchema })
  .strict();
const register = credentials.extend({ name: z.string().trim().min(2).max(80) });
const authLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 30,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    error: {
      code: "RATE_LIMITED",
      message: "Too many attempts. Please try again in 15 minutes.",
    },
  },
});

export const authRouter = Router();

authRouter.post("/register", authLimit, async (req, res) => {
  const input = register.parse(req.body);
  if (
    await prisma.user.findUnique({
      where: { email: input.email },
      select: { id: true },
    })
  )
    throw new AppError(
      409,
      "EMAIL_EXISTS",
      "An account with this email already exists.",
    );
  const passwordHash = await bcrypt.hash(input.password, 12);
  const user = await prisma.user.create({
    data: { name: input.name, email: input.email, passwordHash },
    select: safeUser,
  });
  const token = jwt.sign({}, env.JWT_SECRET, {
    subject: user.id,
    expiresIn: sessionSeconds,
    algorithm: "HS256",
    issuer: "taskora",
    audience: "taskora-web",
  });
  res
    .cookie(cookieName, token, {
      ...cookieOptions,
      maxAge: sessionSeconds * 1000,
    })
    .status(201)
    .json(user);
});

authRouter.post("/login", authLimit, async (req, res) => {
  const input = credentials.parse(req.body);
  const user = await prisma.user.findUnique({ where: { email: input.email } });
  const matches = await bcrypt.compare(
    input.password,
    user?.passwordHash ??
      "$2b$12$R9h/cIPz0gi.URNNX3kh2OPST9/PgBkqquzi.Ss7KIUgO2t0jWMUW",
  );
  if (!user || !matches)
    throw new AppError(
      401,
      "INVALID_CREDENTIALS",
      "Email or password is incorrect.",
    );
  const token = jwt.sign({}, env.JWT_SECRET, {
    subject: user.id,
    expiresIn: sessionSeconds,
    algorithm: "HS256",
    issuer: "taskora",
    audience: "taskora-web",
  });
  res
    .cookie(cookieName, token, {
      ...cookieOptions,
      maxAge: sessionSeconds * 1000,
    })
    .json({ id: user.id, name: user.name, email: user.email });
});

authRouter.post("/logout", (_req, res) => {
  res.clearCookie(cookieName, cookieOptions).status(204).end();
});
authRouter.get("/me", authenticate, (_req, res) => {
  res.json(res.locals.user);
});
```

---

### `server/src/domains/projects/access.ts`

```typescript
import { Prisma } from "@prisma/client";
import { AppError } from "../../middleware/error";
import { z } from "zod";

export const routeId = z.uuid();
export const projectVisibility = (
  userId: string,
): Prisma.ProjectWhereInput => ({
  OR: [{ ownerId: userId }, { members: { some: { userId } } }],
});

export async function requireProject(
  db: Prisma.TransactionClient,
  id: string,
  userId: string,
  ownerOnly = false,
) {
  const project = await db.project.findFirst({
    where: { id, ...projectVisibility(userId) },
    select: { id: true, ownerId: true },
  });
  if (!project)
    throw new AppError(404, "PROJECT_NOT_FOUND", "Project not found.");
  if (ownerOnly && project.ownerId !== userId)
    throw new AppError(
      403,
      "OWNER_REQUIRED",
      "Only the project owner can do this.",
    );
  return project;
}

export async function lockProject(db: Prisma.TransactionClient, id: string) {
  await db.$queryRaw`SELECT "id" FROM "Project" WHERE "id" = ${id}::uuid FOR UPDATE`;
}
```

---

### `server/src/domains/projects/routes.ts`

```typescript
import { Router } from "express";
import { z } from "zod";
import { prisma, safeUser } from "../../db/prisma";
import {
  lockProject,
  projectVisibility,
  requireProject,
  routeId,
} from "./access";
import { taskSelect } from "../tasks/routes";

const projectInput = z
  .object({
    name: z.string().trim().min(1).max(120),
    description: z.string().trim().max(4000).default(""),
  })
  .strict();
const projectPatch = projectInput
  .partial()
  .refine(
    (value) => Object.keys(value).length > 0,
    "Provide at least one field.",
  );
export const projectRouter = Router();

projectRouter.get("/", async (_req, res) => {
  const projects = await prisma.project.findMany({
    where: projectVisibility(res.locals.user.id),
    orderBy: { updatedAt: "desc" },
    include: {
      owner: { select: safeUser },
      members: { select: { userId: true } },
      tasks: { select: { status: true } },
    },
  });
  res.json(
    projects.map(({ tasks, members, ...project }) => {
      const completed = tasks.filter((task) => task.status === "DONE").length;
      return {
        ...project,
        memberIds: members.map((member) => member.userId),
        memberCount: members.length,
        taskCount: tasks.length,
        completedTaskCount: completed,
        progress: tasks.length
          ? Math.round((completed / tasks.length) * 100)
          : 0,
      };
    }),
  );
});

projectRouter.post("/", async (req, res) => {
  const input = projectInput.parse(req.body);
  const project = await prisma.project.create({
    data: {
      ...input,
      ownerId: res.locals.user.id,
      members: { create: { userId: res.locals.user.id } },
    },
  });
  res.status(201).json(project);
});

projectRouter.get("/:projectId", async (req, res) => {
  const id = routeId.parse(req.params.projectId);
  await requireProject(prisma, id, res.locals.user.id);
  const project = await prisma.project.findFirstOrThrow({
    where: { id, ...projectVisibility(res.locals.user.id) },
    include: {
      owner: { select: safeUser },
      members: {
        select: { createdAt: true, user: { select: safeUser } },
        orderBy: { createdAt: "asc" },
      },
      tasks: { select: taskSelect, orderBy: { createdAt: "desc" } },
    },
  });
  const completed = project.tasks.filter(
    (task) => task.status === "DONE",
  ).length;
  res.json({
    ...project,
    progress: project.tasks.length
      ? Math.round((completed / project.tasks.length) * 100)
      : 0,
  });
});

projectRouter.patch("/:projectId", async (req, res) => {
  const id = routeId.parse(req.params.projectId);
  const input = projectPatch.parse(req.body);
  const project = await prisma.$transaction(async (db) => {
    await lockProject(db, id);
    await requireProject(db, id, res.locals.user.id, true);
    return db.project.update({ where: { id }, data: input });
  });
  res.json(project);
});

projectRouter.delete("/:projectId", async (req, res) => {
  const id = routeId.parse(req.params.projectId);
  await prisma.$transaction(async (db) => {
    await lockProject(db, id);
    await requireProject(db, id, res.locals.user.id, true);
    await db.project.delete({ where: { id } });
  });
  res.status(204).end();
});
```

---

### `server/src/domains/members/routes.ts`

```typescript
import { Router } from "express";
import { z } from "zod";
import { prisma, safeUser } from "../../db/prisma";
import { emailSchema } from "../auth/routes";
import { lockProject, requireProject, routeId } from "../projects/access";
import { AppError } from "../../middleware/error";

export const memberRouter = Router({ mergeParams: true });
memberRouter.get<{ projectId: string }>("/", async (req, res) => {
  const projectId = routeId.parse(req.params.projectId);
  await requireProject(prisma, projectId, res.locals.user.id);
  res.json(
    await prisma.projectMember.findMany({
      where: {
        projectId,
        project: {
          OR: [
            { ownerId: res.locals.user.id },
            { members: { some: { userId: res.locals.user.id } } },
          ],
        },
      },
      select: { createdAt: true, user: { select: safeUser } },
      orderBy: { createdAt: "asc" },
    }),
  );
});

memberRouter.post<{ projectId: string }>("/", async (req, res) => {
  const projectId = routeId.parse(req.params.projectId);
  const { email } = z.object({ email: emailSchema }).strict().parse(req.body);
  const member = await prisma.$transaction(async (db) => {
    await lockProject(db, projectId);
    await requireProject(db, projectId, res.locals.user.id, true);
    const user = await db.user.findUnique({
      where: { email },
      select: safeUser,
    });
    if (!user)
      throw new AppError(
        404,
        "USER_NOT_FOUND",
        "No registered account uses this email.",
      );
    if (
      await db.projectMember.findUnique({
        where: { projectId_userId: { projectId, userId: user.id } },
      })
    )
      throw new AppError(
        409,
        "ALREADY_MEMBER",
        "This person is already a project member.",
      );
    return db.projectMember.create({
      data: { projectId, userId: user.id },
      select: { createdAt: true, user: { select: safeUser } },
    });
  });
  res.status(201).json(member);
});

memberRouter.delete<{ projectId: string; userId: string }>(
  "/:userId",
  async (req, res) => {
    const projectId = routeId.parse(req.params.projectId);
    const userId = routeId.parse(req.params.userId);
    await prisma.$transaction(async (db) => {
      await lockProject(db, projectId);
      const project = await requireProject(
        db,
        projectId,
        res.locals.user.id,
        true,
      );
      if (project.ownerId === userId)
        throw new AppError(
          400,
          "OWNER_MEMBERSHIP",
          "The project owner cannot be removed.",
        );
      await db.task.updateMany({
        where: { projectId, assigneeId: userId },
        data: { assigneeId: null },
      });
      await db.projectMember.delete({
        where: { projectId_userId: { projectId, userId } },
      });
    });
    res.status(204).end();
  },
);
```

---

### `server/src/domains/tasks/routes.ts`

```typescript
import { Router } from "express";
import { Prisma } from "@prisma/client";
import { z } from "zod";
import { prisma, safeUser } from "../../db/prisma";
import {
  lockProject,
  projectVisibility,
  requireProject,
  routeId,
} from "../projects/access";
import { AppError } from "../../middleware/error";

export const taskSelect = {
  id: true,
  projectId: true,
  title: true,
  description: true,
  status: true,
  assigneeId: true,
  createdAt: true,
  updatedAt: true,
  assignee: { select: safeUser },
} satisfies Prisma.TaskSelect;
const taskInput = z
  .object({
    title: z.string().trim().min(1).max(160),
    description: z.string().trim().max(4000).default(""),
    status: z.enum(["TODO", "IN_PROGRESS", "DONE"]).default("TODO"),
    assigneeId: z.uuid().nullable().default(null),
  })
  .strict();
const taskPatch = taskInput
  .partial()
  .refine(
    (value) => Object.keys(value).length > 0,
    "Provide at least one field.",
  );

async function checkAssignee(
  db: Prisma.TransactionClient,
  projectId: string,
  assigneeId: string | null | undefined,
) {
  if (
    assigneeId &&
    !(await db.projectMember.findUnique({
      where: { projectId_userId: { projectId, userId: assigneeId } },
    }))
  )
    throw new AppError(
      400,
      "INVALID_ASSIGNEE",
      "Assign tasks only to a member of this project.",
    );
}

export const projectTaskRouter = Router({ mergeParams: true });
export const taskRouter = Router();

projectTaskRouter.get<{ projectId: string }>("/", async (req, res) => {
  const projectId = routeId.parse(req.params.projectId);
  await requireProject(prisma, projectId, res.locals.user.id);
  res.json(
    await prisma.task.findMany({
      where: { projectId, project: projectVisibility(res.locals.user.id) },
      select: taskSelect,
      orderBy: { createdAt: "desc" },
    }),
  );
});

projectTaskRouter.post<{ projectId: string }>("/", async (req, res) => {
  const projectId = routeId.parse(req.params.projectId);
  const input = taskInput.parse(req.body);
  const task = await prisma.$transaction(async (db) => {
    await lockProject(db, projectId);
    await requireProject(db, projectId, res.locals.user.id);
    await checkAssignee(db, projectId, input.assigneeId);
    const created = await db.task.create({
      data: { ...input, projectId },
      select: taskSelect,
    });
    await db.project.update({
      where: { id: projectId },
      data: { updatedAt: new Date() },
    });
    return created;
  });
  res.status(201).json(task);
});

taskRouter.get("/mine", async (_req, res) => {
  res.json(
    await prisma.task.findMany({
      where: {
        assigneeId: res.locals.user.id,
        project: projectVisibility(res.locals.user.id),
      },
      select: { ...taskSelect, project: { select: { id: true, name: true } } },
      orderBy: { updatedAt: "desc" },
    }),
  );
});

taskRouter.patch("/:taskId", async (req, res) => {
  const id = routeId.parse(req.params.taskId);
  const input = taskPatch.parse(req.body);
  const task = await prisma.$transaction(async (db) => {
    const existing = await db.task.findFirst({
      where: { id, project: projectVisibility(res.locals.user.id) },
      select: { projectId: true },
    });
    if (!existing) throw new AppError(404, "TASK_NOT_FOUND", "Task not found.");
    await lockProject(db, existing.projectId);
    await requireProject(db, existing.projectId, res.locals.user.id);
    await checkAssignee(db, existing.projectId, input.assigneeId);
    const updated = await db.task.update({
      where: { id },
      data: input,
      select: taskSelect,
    });
    await db.project.update({
      where: { id: existing.projectId },
      data: { updatedAt: new Date() },
    });
    return updated;
  });
  res.json(task);
});

taskRouter.delete("/:taskId", async (req, res) => {
  const id = routeId.parse(req.params.taskId);
  await prisma.$transaction(async (db) => {
    const task = await db.task.findFirst({
      where: { id, project: projectVisibility(res.locals.user.id) },
      select: { projectId: true },
    });
    if (!task) throw new AppError(404, "TASK_NOT_FOUND", "Task not found.");
    await lockProject(db, task.projectId);
    await requireProject(db, task.projectId, res.locals.user.id);
    await db.task.delete({ where: { id } });
    await db.project.update({
      where: { id: task.projectId },
      data: { updatedAt: new Date() },
    });
  });
  res.status(204).end();
});
```

---

### `server/src/app.ts`

```typescript
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
app.use(cors({ origin: env.CLIENT_ORIGIN, credentials: true }));
app.use("/api", (_req, res, next) => {
  res.set("Cache-Control", "no-store");
  next();
});
app.use((req, _res, next) => {
  if (
    !["GET", "HEAD", "OPTIONS"].includes(req.method) &&
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
  await prisma.$queryRaw`SELECT 1`;
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
```

---

### `server/src/server.ts`

```typescript
import { env } from "./config/env";
import { app } from "./app";
import { prisma } from "./db/prisma";

async function start() {
  await prisma.$connect();
  const server = app.listen(env.PORT, "0.0.0.0", () =>
    console.log(`Taskora API listening on ${env.PORT}`),
  );
  for (const signal of ["SIGINT", "SIGTERM"] as const) {
    process.once(signal, () => {
      server.close(() => {
        void prisma.$disconnect().then(() => process.exit(0));
      });
      setTimeout(() => process.exit(1), 10000).unref();
    });
  }
}

start().catch((error) => {
  console.error(error);
  process.exit(1);
});
```

---

### `server/tests/api.test.ts`

```typescript
import "dotenv/config";
import test from "node:test";
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import jwt from "jsonwebtoken";
import { app } from "../src/app";
import { prisma } from "../src/db/prisma";
import { env } from "../src/config/env";

test(
  "authenticated project lifecycle and authorization boundaries",
  { timeout: 60000 },
  async (t) => {
    assert.notEqual(
      env.NODE_ENV,
      "production",
      "Do not run integration tests in production.",
    );
    const server = app.listen(0, "127.0.0.1");
    await new Promise<void>((resolve) => server.once("listening", resolve));
    const address = server.address();
    assert(address && typeof address === "object");
    const base = `http://127.0.0.1:${address.port}/api`;
    const suffix = randomUUID();
    const password = `Taskora-${randomUUID()}`;
    const userIds: string[] = [];
    let projectId = "";
    let taskId = "";
    type Account = { id: string; cookie: string; email: string };
    async function request(
      path: string,
      method = "GET",
      body?: unknown,
      cookie = "",
      origin = env.CLIENT_ORIGIN,
    ) {
      const response = await fetch(base + path, {
        method,
        headers: {
          Origin: origin,
          Cookie: cookie,
          ...(body === undefined ? {} : { "Content-Type": "application/json" }),
        },
        body: body === undefined ? undefined : JSON.stringify(body),
      });
      const data = response.status === 204 ? null : await response.json();
      return { response, data };
    }
    async function register(name: string): Promise<Account> {
      const email = `${name}.${suffix}@example.test`;
      const result = await request("/auth/register", "POST", {
        name,
        email: email.toUpperCase(),
        password,
      });
      assert.equal(result.response.status, 201);
      assert.equal(result.data.email, email.toLowerCase());
      assert.equal("passwordHash" in result.data, false);
      const cookie = result.response.headers.get("set-cookie")!;
      assert.match(cookie, /HttpOnly/i);
      assert.match(cookie, /SameSite=Lax/i);
      assert.match(cookie, /Max-Age=604800/i);
      userIds.push(result.data.id);
      return { id: result.data.id, email, cookie: cookie.split(";")[0] };
    }
    try {
      const owner = await register("Owner");
      const member = await register("Member");
      const outsider = await register("Outsider");
      await t.test(
        "validates authentication and rejects forged sessions and origins",
        async () => {
          assert.equal((await request("/projects")).response.status, 401);
          assert.equal(
            (
              await request(
                "/projects",
                "GET",
                undefined,
                "taskora_session=forged",
              )
            ).response.status,
            401,
          );
          assert.equal(
            (
              await request("/auth/login", "POST", {
                email: owner.email,
                password: "wrong-password",
              })
            ).response.status,
            401,
          );
          const login = await request("/auth/login", "POST", {
            email: owner.email,
            password,
          });
          assert.equal(login.response.status, 200);
          assert.equal(
            (await request("/auth/me", "GET", undefined, owner.cookie)).data.id,
            owner.id,
          );
          assert.equal(
            (
              await request("/auth/register", "POST", {
                name: "Duplicate",
                email: owner.email,
                password,
              })
            ).response.status,
            409,
          );
          assert.equal(
            (
              await request("/auth/register", "POST", {
                name: "X",
                email: "invalid",
                password: "short",
              })
            ).response.status,
            400,
          );
          assert.equal(
            (
              await request(
                "/projects",
                "POST",
                { name: "Rejected" },
                owner.cookie,
                "https://untrusted.test",
              )
            ).response.status,
            403,
          );
          const expired = jwt.sign({}, env.JWT_SECRET, {
            subject: owner.id,
            expiresIn: -1,
            issuer: "taskora",
            audience: "taskora-web",
          });
          assert.equal(
            (
              await request(
                "/auth/me",
                "GET",
                undefined,
                `taskora_session=${expired}`,
              )
            ).response.status,
            401,
          );
        },
      );
      await t.test(
        "creates persistent projects and scopes project reads",
        async () => {
          const created = await request(
            "/projects",
            "POST",
            { name: "Launch", description: "A real database project" },
            owner.cookie,
          );
          assert.equal(created.response.status, 201);
          projectId = created.data.id;
          assert.equal(
            (
              await prisma.project.findUniqueOrThrow({
                where: { id: projectId },
              })
            ).ownerId,
            owner.id,
          );
          const detail = await request(
            `/projects/${projectId}`,
            "GET",
            undefined,
            owner.cookie,
          );
          assert.equal(detail.data.progress, 0);
          assert.equal(detail.data.members[0].user.id, owner.id);
          assert.equal(
            JSON.stringify(detail.data).includes("passwordHash"),
            false,
          );
          assert.equal(
            (await request("/projects", "GET", undefined, outsider.cookie)).data
              .length,
            0,
          );
          assert.equal(
            (
              await request(
                `/projects/${projectId}`,
                "GET",
                undefined,
                outsider.cookie,
              )
            ).response.status,
            404,
          );
          assert.equal(
            (
              await request(
                "/projects/not-a-uuid",
                "GET",
                undefined,
                owner.cookie,
              )
            ).response.status,
            400,
          );
          assert.equal(
            (
              await request(
                `/projects/${projectId}`,
                "PATCH",
                { name: "Launch revised" },
                owner.cookie,
              )
            ).response.status,
            200,
          );
        },
      );
      await t.test("enforces owner membership controls", async () => {
        assert.equal(
          (
            await request(
              `/projects/${projectId}/members`,
              "POST",
              { email: member.email },
              owner.cookie,
            )
          ).response.status,
          201,
        );
        assert.equal(
          (
            await request(
              `/projects/${projectId}/members`,
              "POST",
              { email: member.email },
              owner.cookie,
            )
          ).response.status,
          409,
        );
        assert.equal(
          (
            await request(
              `/projects/${projectId}/members`,
              "POST",
              { email: outsider.email },
              member.cookie,
            )
          ).response.status,
          403,
        );
        assert.equal(
          (
            await request(
              `/projects/${projectId}/members/${owner.id}`,
              "DELETE",
              undefined,
              owner.cookie,
            )
          ).response.status,
          400,
        );
        assert.equal(
          (
            await request(
              `/projects/${projectId}`,
              "PATCH",
              { name: "Unauthorized" },
              member.cookie,
            )
          ).response.status,
          403,
        );
        assert.equal(
          (
            await request(
              `/projects/${projectId}`,
              "DELETE",
              undefined,
              member.cookie,
            )
          ).response.status,
          403,
        );
        assert.equal(
          (
            await request(
              `/projects/${projectId}/members`,
              "GET",
              undefined,
              member.cookie,
            )
          ).data.length,
          2,
        );
      });
      await t.test(
        "supports member task creation, assignment, status, progress and My Tasks",
        async () => {
          assert.equal(
            (
              await request(
                `/projects/${projectId}/tasks`,
                "POST",
                { title: "Invalid", assigneeId: outsider.id },
                member.cookie,
              )
            ).response.status,
            400,
          );
          const created = await request(
            `/projects/${projectId}/tasks`,
            "POST",
            { title: "Ship the workspace", assigneeId: member.id },
            member.cookie,
          );
          assert.equal(created.response.status, 201);
          taskId = created.data.id;
          assert.equal(
            (await request("/tasks/mine", "GET", undefined, member.cookie))
              .data[0].id,
            taskId,
          );
          assert.equal(
            (await request("/tasks/mine", "GET", undefined, outsider.cookie))
              .data.length,
            0,
          );
          assert.equal(
            (
              await request(
                `/tasks/${taskId}`,
                "PATCH",
                { status: "DONE" },
                outsider.cookie,
              )
            ).response.status,
            404,
          );
          assert.equal(
            (
              await request(
                `/tasks/${taskId}`,
                "DELETE",
                undefined,
                outsider.cookie,
              )
            ).response.status,
            404,
          );
          assert.equal(
            (
              await request(
                `/tasks/${taskId}`,
                "PATCH",
                { projectId },
                member.cookie,
              )
            ).response.status,
            400,
          );
          assert.equal(
            (
              await request(
                `/tasks/${taskId}`,
                "PATCH",
                { status: "UNKNOWN" },
                member.cookie,
              )
            ).response.status,
            400,
          );
          assert.equal(
            (
              await request(
                `/tasks/${taskId}`,
                "PATCH",
                { status: "IN_PROGRESS", description: "Real work" },
                member.cookie,
              )
            ).response.status,
            200,
          );
          assert.equal(
            (
              await request(
                `/tasks/${taskId}`,
                "PATCH",
                { status: "DONE" },
                member.cookie,
              )
            ).response.status,
            200,
          );
          assert.equal(
            (
              await request(
                `/projects/${projectId}`,
                "GET",
                undefined,
                owner.cookie,
              )
            ).data.progress,
            100,
          );
          assert.equal(
            (await prisma.task.findUniqueOrThrow({ where: { id: taskId } }))
              .status,
            "DONE",
          );
          assert.equal(
            (
              await request(
                `/projects/${projectId}/tasks`,
                "GET",
                undefined,
                member.cookie,
              )
            ).data.length,
            1,
          );
        },
      );
      await t.test(
        "keeps assignments valid during concurrent membership removal",
        async () => {
          const results = await Promise.all([
            request(
              `/projects/${projectId}/members/${member.id}`,
              "DELETE",
              undefined,
              owner.cookie,
            ),
            request(
              `/tasks/${taskId}`,
              "PATCH",
              { assigneeId: member.id },
              owner.cookie,
            ),
          ]);
          assert.equal(results[0].response.status, 204);
          assert([200, 400].includes(results[1].response.status));
          assert.equal(
            (await prisma.task.findUniqueOrThrow({ where: { id: taskId } }))
              .assigneeId,
            null,
          );
          assert.equal(
            (
              await request(
                `/projects/${projectId}`,
                "GET",
                undefined,
                member.cookie,
              )
            ).response.status,
            404,
          );
          assert.equal(
            (await request("/tasks/mine", "GET", undefined, member.cookie)).data
              .length,
            0,
          );
        },
      );
      await t.test(
        "deletes tasks, cascades projects, and clears the session cookie",
        async () => {
          assert.equal(
            (
              await request(
                `/tasks/${taskId}`,
                "DELETE",
                undefined,
                owner.cookie,
              )
            ).response.status,
            204,
          );
          assert.equal(
            await prisma.task.findUnique({ where: { id: taskId } }),
            null,
          );
          assert.equal(
            (
              await request(
                `/projects/${projectId}`,
                "GET",
                undefined,
                owner.cookie,
              )
            ).data.progress,
            0,
          );
          await request(
            `/projects/${projectId}/tasks`,
            "POST",
            { title: "Cascade check" },
            owner.cookie,
          );
          assert.equal(
            (
              await request(
                `/projects/${projectId}`,
                "DELETE",
                undefined,
                owner.cookie,
              )
            ).response.status,
            204,
          );
          assert.equal(await prisma.task.count({ where: { projectId } }), 0);
          assert.equal(
            await prisma.projectMember.count({ where: { projectId } }),
            0,
          );
          const logout = await request(
            "/auth/logout",
            "POST",
            undefined,
            owner.cookie,
          );
          assert.equal(logout.response.status, 204);
          assert.match(
            logout.response.headers.get("set-cookie")!,
            /Expires=Thu, 01 Jan 1970/,
          );
        },
      );
    } finally {
      await prisma.project.deleteMany({ where: { ownerId: { in: userIds } } });
      await prisma.user.deleteMany({ where: { id: { in: userIds } } });
      await new Promise<void>((resolve, reject) =>
        server.close((error) => (error ? reject(error) : resolve())),
      );
      await prisma.$disconnect();
    }
  },
);
```

---

### `src/types/domain.ts`

```typescript
export type User = { id: string; name: string; email: string };
export type TaskStatus = "TODO" | "IN_PROGRESS" | "DONE";
export type Task = {
  id: string;
  projectId: string;
  title: string;
  description: string;
  status: TaskStatus;
  assigneeId: string | null;
  assignee: User | null;
  createdAt: string;
  updatedAt: string;
};
export type MyTask = Task & { project: { id: string; name: string } };
export type Member = { createdAt: string; user: User };
export type Project = {
  id: string;
  name: string;
  description: string;
  ownerId: string;
  owner: User;
  createdAt: string;
  updatedAt: string;
  progress: number;
};
export type ProjectSummary = Project & {
  memberIds: string[];
  memberCount: number;
  taskCount: number;
  completedTaskCount: number;
};
export type ProjectDetail = Project & { members: Member[]; tasks: Task[] };
export type ProjectInput = { name: string; description: string };
export type TaskInput = {
  title: string;
  description: string;
  status: TaskStatus;
  assigneeId: string | null;
};
```

---

### `src/services/api/client.ts`

```typescript
export class ApiError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string,
  ) {
    super(message);
  }
}
export async function api<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  let response: Response;
  try {
    response = await fetch(path, {
      ...options,
      credentials: "include",
      cache: "no-store",
      headers: {
        ...(options.body ? { "Content-Type": "application/json" } : {}),
        ...options.headers,
      },
    });
  } catch {
    throw new ApiError(
      0,
      "NETWORK_ERROR",
      "Unable to connect. Check your connection and try again.",
    );
  }
  if (response.status === 204) return undefined as T;
  const body = await response.json().catch(() => null);
  if (!response.ok) {
    if (
      response.status === 401 &&
      typeof window !== "undefined" &&
      !["/", "/login", "/register"].includes(window.location.pathname)
    )
      window.location.replace("/login");
    throw new ApiError(
      response.status,
      body?.error?.code || "REQUEST_FAILED",
      body?.error?.message || "The service is unavailable. Please try again.",
    );
  }
  return body as T;
}
```

---

### `src/services/api/auth.ts`

```typescript
import { api } from "./client";
import type { User } from "@/types/domain";
export const authApi = {
  me: "/api/auth/me",
  login: (input: { email: string; password: string }) =>
    api<User>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(input),
    }),
  register: (input: { name: string; email: string; password: string }) =>
    api<User>("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(input),
    }),
  logout: () => api<void>("/api/auth/logout", { method: "POST" }),
};
```

---

### `src/services/api/projects.ts`

```typescript
import { api } from "./client";
import type { ProjectInput, Project, Member } from "@/types/domain";
export const projectsApi = {
  list: "/api/projects",
  detail: (id: string) => `/api/projects/${id}`,
  create: (input: ProjectInput) =>
    api<Project>("/api/projects", {
      method: "POST",
      body: JSON.stringify(input),
    }),
  update: (id: string, input: ProjectInput) =>
    api<Project>(`/api/projects/${id}`, {
      method: "PATCH",
      body: JSON.stringify(input),
    }),
  remove: (id: string) =>
    api<void>(`/api/projects/${id}`, { method: "DELETE" }),
  addMember: (id: string, email: string) =>
    api<Member>(`/api/projects/${id}/members`, {
      method: "POST",
      body: JSON.stringify({ email }),
    }),
  removeMember: (id: string, userId: string) =>
    api<void>(`/api/projects/${id}/members/${userId}`, { method: "DELETE" }),
};
```

---

### `src/services/api/tasks.ts`

```typescript
import { api } from "./client";
import type { Task, TaskInput } from "@/types/domain";
export const tasksApi = {
  mine: "/api/tasks/mine",
  create: (projectId: string, input: TaskInput) =>
    api<Task>(`/api/projects/${projectId}/tasks`, {
      method: "POST",
      body: JSON.stringify(input),
    }),
  update: (id: string, input: Partial<TaskInput>) =>
    api<Task>(`/api/tasks/${id}`, {
      method: "PATCH",
      body: JSON.stringify(input),
    }),
  remove: (id: string) => api<void>(`/api/tasks/${id}`, { method: "DELETE" }),
};
```

---

### `src/components/shared/Brand.tsx`

```typescript
import Link from "next/link";
import { Layers2 } from "lucide-react";
import { brand } from "@data/brand";

export function Brand({ href = "/" }: { href?: string }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-2.5 text-xl font-semibold tracking-tight"
      aria-label="Taskora home"
    >
      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent text-white">
        <Layers2 size={20} strokeWidth={1.7} />
      </span>
      {brand.name}
      <span className="mb-2 h-1 w-1 rounded-full bg-accent" />
    </Link>
  );
}
```

---

### `src/components/shared/Avatar.tsx`

```typescript
export function Avatar({ name }: { name: string }) {
  return (
    <span className="avatar" aria-hidden="true">
      {name
        .split(/\s+/)
        .slice(0, 2)
        .map((part) => part[0])
        .join("")
        .toUpperCase()}
    </span>
  );
}
```

---

### `src/components/shared/Feedback.tsx`

```typescript
import { FolderOpen, RefreshCw } from "lucide-react";
import type { ReactNode } from "react";

export function ErrorMessage({ error }: { error: unknown }) {
  if (!error) return null;
  return (
    <div className="error-message" role="alert">
      {error instanceof Error
        ? error.message
        : "Something went wrong. Please try again."}
    </div>
  );
}
export function Loading() {
  return (
    <div role="status" aria-label="Loading workspace" className="space-y-5">
      <span className="sr-only">Loading…</span>
      <div className="skeleton h-10 w-52" />
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <div className="skeleton h-44" />
        <div className="skeleton h-44" />
        <div className="skeleton h-44" />
      </div>
    </div>
  );
}
export function LoadError({
  error,
  retry,
}: {
  error: unknown;
  retry: () => void;
}) {
  return (
    <div className="card space-y-4 p-6">
      <ErrorMessage error={error} />
      <button className="btn btn-secondary" onClick={retry}>
        <RefreshCw size={16} />
        Try again
      </button>
    </div>
  );
}
export function EmptyState({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children?: ReactNode;
}) {
  return (
    <div className="card flex flex-col items-center px-5 py-14 text-center">
      <span className="mb-5 rounded-xl bg-canvas p-4 text-muted">
        <FolderOpen size={26} strokeWidth={1.4} />
      </span>
      <h2 className="text-lg">{title}</h2>
      <p className="mt-2 mb-6 max-w-sm leading-relaxed text-muted">
        {description}
      </p>
      {children}
    </div>
  );
}
```

---

### `src/components/shared/Dialog.tsx`

```typescript
"use client";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { X } from "lucide-react";
import { ErrorMessage } from "./Feedback";

export function Dialog({
  title,
  onClose,
  children,
  busy = false,
}: {
  title: string;
  onClose: () => void;
  children: ReactNode;
  busy?: boolean;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const reduced = useReducedMotion();
  useEffect(() => {
    const element = ref.current;
    element?.showModal();
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      element?.close();
      document.body.style.overflow = previous;
    };
  }, []);
  return (
    <dialog
      ref={ref}
      className="dialog"
      aria-labelledby="dialog-title"
      onCancel={(event) => {
        event.preventDefault();
        if (!busy) onClose();
      }}
      onClick={(event) => {
        if (event.target === ref.current && !busy) {
          const bounds = ref.current.getBoundingClientRect();
          if (
            event.clientX < bounds.left ||
            event.clientX > bounds.right ||
            event.clientY < bounds.top ||
            event.clientY > bounds.bottom
          )
            onClose();
        }
      }}
    >
      <motion.div
        initial={reduced ? false : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.16 }}
        className="p-6"
      >
        <div className="mb-6 flex items-center justify-between gap-3">
          <h2 id="dialog-title" className="text-xl tracking-tight">
            {title}
          </h2>
          <button
            className="icon-button"
            aria-label="Close dialog"
            onClick={onClose}
            disabled={busy}
          >
            <X size={18} />
          </button>
        </div>
        {children}
      </motion.div>
    </dialog>
  );
}
export function ConfirmDialog({
  title,
  description,
  onClose,
  action,
  label = "Delete",
}: {
  title: string;
  description: string;
  onClose: () => void;
  action: () => Promise<void>;
  label?: string;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<unknown>();
  return (
    <Dialog title={title} onClose={onClose} busy={busy}>
      <p className="mb-5 leading-relaxed text-muted">{description}</p>
      <ErrorMessage error={error} />
      <div className="mt-6 flex justify-end gap-3">
        <button className="btn btn-secondary" onClick={onClose} disabled={busy}>
          Cancel
        </button>
        <button
          className="btn btn-danger"
          disabled={busy}
          onClick={async () => {
            setBusy(true);
            setError(undefined);
            try {
              await action();
              onClose();
            } catch (failure) {
              setError(failure);
              setBusy(false);
            }
          }}
        >
          {busy ? "Working…" : label}
        </button>
      </div>
    </Dialog>
  );
}
```

---

### `src/components/shell/AppShell.tsx`

```typescript
"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import useSWR, { useSWRConfig } from "swr";
import {
  LayoutDashboard,
  FolderKanban,
  CheckCheck,
  Menu,
  LogOut,
  ArrowUpRight,
} from "lucide-react";
import { Brand } from "@/components/shared/Brand";
import { Avatar } from "@/components/shared/Avatar";
import { Dialog } from "@/components/shared/Dialog";
import { Loading, LoadError, ErrorMessage } from "@/components/shared/Feedback";
import { api, ApiError } from "@/services/api/client";
import { authApi } from "@/services/api/auth";
import { navigation } from "@data/navigation";
import type { User } from "@/types/domain";

const icons = {
  dashboard: LayoutDashboard,
  projects: FolderKanban,
  tasks: CheckCheck,
};
export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { mutate } = useSWRConfig();
  const {
    data: user,
    error,
    mutate: retry,
  } = useSWR<User>(authApi.me, api, { shouldRetryOnError: false });
  const [drawer, setDrawer] = useState(false);
  const [busy, setBusy] = useState(false);
  const [logoutError, setLogoutError] = useState<unknown>();
  useEffect(() => {
    if (error instanceof ApiError && error.status === 401)
      router.replace("/login");
  }, [error, router]);
  if (error)
    return (
      <main id="main" className="mx-auto max-w-lg p-8">
        <LoadError error={error} retry={() => void retry()} />
      </main>
    );
  if (!user)
    return (
      <main id="main" className="p-8">
        <Loading />
      </main>
    );
  const current = navigation.find((item) => pathname.startsWith(item.href));
  const nav = (
    <nav aria-label="Workspace" className="space-y-1">
      {navigation.map((item) => {
        const Icon = icons[item.icon];
        const active = pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`nav-link ${active ? "active" : ""}`}
            aria-current={active ? "page" : undefined}
            onClick={() => setDrawer(false)}
          >
            <Icon size={18} strokeWidth={1.7} />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
  const account = (
    <div className="space-y-3 border-t border-line pt-5">
      <div className="flex min-w-0 items-center gap-3">
        <Avatar name={user.name} />
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">{user.name}</p>
          <p className="mt-1 truncate text-xs text-muted">{user.email}</p>
        </div>
      </div>
      <ErrorMessage error={logoutError} />
      <button
        className="nav-link w-full"
        disabled={busy}
        onClick={async () => {
          setBusy(true);
          setLogoutError(undefined);
          try {
            await authApi.logout();
            await mutate(() => true, undefined, { revalidate: false });
            router.replace("/login");
          } catch (failure) {
            setLogoutError(failure);
            setBusy(false);
          }
        }}
      >
        <LogOut size={16} />
        {busy ? "Signing out…" : "Sign out"}
      </button>
    </div>
  );
  return (
    <div className="min-h-dvh">
      <aside className="fixed inset-y-0 left-0 hidden w-60 flex-col border-r border-line bg-white px-5 py-8 lg:flex">
        <Brand href="/dashboard" />
        <p className="eyebrow mt-12 mb-4 px-3">Workspace</p>
        {nav}
        <div className="mt-auto">
          <div className="my-8 rounded-lg bg-canvas p-4">
            <p className="text-xs font-semibold">A little more clarity.</p>
            <p className="mt-2 text-xs leading-relaxed text-muted">
              Keep your team moving,
              <br />
              one task at a time.
            </p>
          </div>
          {account}
        </div>
      </aside>
      <div className="lg:pl-60">
        <header className="sticky top-0 z-20 flex h-20 items-center justify-between gap-3 border-b border-line bg-white/95 px-5 backdrop-blur-sm md:px-9">
          <div className="flex items-center gap-3">
            <button
              className="icon-button lg:hidden"
              aria-label="Open navigation"
              aria-expanded={drawer}
              onClick={() => setDrawer(true)}
            >
              <Menu size={20} />
            </button>
            <span className="text-sm font-medium">
              Workspace <span className="mx-2 text-[#c5c1bc]">/</span>{" "}
              <span className="text-muted">{current?.label || "Project"}</span>
            </span>
          </div>
          <Link
            href="/my-tasks"
            className="hidden items-center gap-2 text-xs text-muted sm:flex"
          >
            Your next move
            <ArrowUpRight size={15} />
          </Link>
          <span className="lg:hidden">
            <Avatar name={user.name} />
          </span>
        </header>
        <main
          id="main"
          className="mx-auto max-w-[1440px] px-5 py-8 md:px-9 md:py-10"
        >
          {children}
        </main>
        <footer className="mx-5 flex justify-between border-t border-line py-6 text-[11px] text-muted md:mx-9">
          <span>Taskora</span>
          <span>Plan. Assign. Deliver.</span>
        </footer>
      </div>
      {drawer && (
        <Dialog title="Your workspace" onClose={() => setDrawer(false)}>
          <div className="mb-8">{nav}</div>
          {account}
        </Dialog>
      )}
    </div>
  );
}
```

---

### `src/components/auth/AuthForm.tsx`

```typescript
"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { useSWRConfig } from "swr";
import { ArrowRight } from "lucide-react";
import { authApi } from "@/services/api/auth";
import { ErrorMessage } from "@/components/shared/Feedback";

export function AuthForm({ register = false }: { register?: boolean }) {
  const router = useRouter();
  const { mutate } = useSWRConfig();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<unknown>();
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const password = String(form.get("password"));
    if (register && password !== form.get("confirm")) {
      setError(new Error("Your passwords do not match."));
      return;
    }
    if (new TextEncoder().encode(password).length > 72) {
      setError(new Error("Your password must be at most 72 bytes."));
      return;
    }
    setBusy(true);
    setError(undefined);
    try {
      const input = { email: String(form.get("email")), password };
      const user = register
        ? await authApi.register({ ...input, name: String(form.get("name")) })
        : await authApi.login(input);
      await mutate(() => true, undefined, { revalidate: false });
      await mutate(authApi.me, user, false);
      router.replace("/dashboard");
    } catch (failure) {
      setError(failure);
      setBusy(false);
    }
  }
  return (
    <div className="w-full max-w-sm">
      <p className="eyebrow mb-4">Your work, together</p>
      <h1 className="text-3xl">
        {register ? "A fresh start for your team." : "Welcome back."}
      </h1>
      <p className="mt-3 mb-8 leading-relaxed text-muted">
        {register
          ? "Create your account and give your next project a home."
          : "Sign in to pick up where your team left off."}
      </p>
      <form onSubmit={submit} className="space-y-5">
        <ErrorMessage error={error} />
        <fieldset disabled={busy} className="space-y-5">
          {register && (
            <label className="field">
              Full Name
              <input
                className="input"
                name="name"
                autoComplete="name"
                required
                minLength={2}
                maxLength={80}
                placeholder="Your full name"
              />
            </label>
          )}
          <label className="field">
            Email
            <input
              className="input"
              name="email"
              type="email"
              autoComplete="email"
              required
              maxLength={254}
              placeholder="you@company.com"
            />
          </label>
          <label className="field">
            Password
            <input
              className="input"
              name="password"
              type="password"
              autoComplete={register ? "new-password" : "current-password"}
              required
              minLength={8}
              maxLength={72}
              placeholder={
                register ? "At least 8 characters" : "Enter your password"
              }
            />
          </label>
          {register && (
            <label className="field">
              Confirm Password
              <input
                className="input"
                name="confirm"
                type="password"
                autoComplete="new-password"
                required
                minLength={8}
                maxLength={72}
                placeholder="Enter your password again"
              />
            </label>
          )}
          <button className="btn btn-primary mt-2 w-full" type="submit">
            {busy ? "Please wait…" : register ? "Create account" : "Sign In"}
            {!busy && <ArrowRight size={16} />}
          </button>
        </fieldset>
      </form>
      <p className="mt-7 text-center text-sm text-muted">
        {register ? "Already have an account?" : "New to Taskora?"}{" "}
        <Link
          href={register ? "/login" : "/register"}
          className="font-semibold text-accent"
        >
          {register ? "Sign In" : "Create an account"}
        </Link>
      </p>
    </div>
  );
}
```

---

### `src/components/projects/ProjectCard.tsx`

```typescript
import type { ProjectSummary } from "@/types/domain";
import { ArrowUpRight, CheckCheck, FolderKanban, Users } from "lucide-react";
import Link from "next/link";
export function ProjectCard({ project }: { project: ProjectSummary }) {
  return (
    <Link
      href={`/projects/${project.id}`}
      className="project-card card flex min-w-0 flex-col p-6"
    >
      <div className="mb-5 flex items-center justify-between">
        <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-canvas text-accent">
          <FolderKanban size={21} strokeWidth={1.5} />
        </span>
        <ArrowUpRight size={18} className="text-muted" />
      </div>
      <h2 className="truncate text-base">{project.name}</h2>
      <p className="mt-2 mb-6 line-clamp-2 min-h-10 text-xs leading-relaxed text-muted">
        {project.description || "A fresh project, ready to take shape."}
      </p>
      <div className="mt-auto">
        <div className="mb-2 flex justify-between text-xs">
          <span className="text-muted">Progress</span>
          <span className="font-semibold">{project.progress}%</span>
        </div>
        <div
          className="progress-track"
          role="progressbar"
          aria-label={`${project.name} progress`}
          aria-valuenow={project.progress}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div
            className="progress-fill"
            style={{ width: `${project.progress}%` }}
          />
        </div>
        <div className="mt-5 flex items-center justify-between border-t border-line pt-4 text-[11px] text-muted">
          <span className="flex items-center gap-1.5">
            <CheckCheck size={14} />
            {project.completedTaskCount}/{project.taskCount} tasks
          </span>
          <span className="flex items-center gap-1.5">
            <Users size={14} />
            {project.memberCount}{" "}
            {project.memberCount === 1 ? "member" : "members"}
          </span>
        </div>
      </div>
    </Link>
  );
}
```

---

### `src/components/projects/ProjectForm.tsx`

```typescript
"use client";
import { Dialog } from "@/components/shared/Dialog";
import { ErrorMessage } from "@/components/shared/Feedback";
import { projectsApi } from "@/services/api/projects";
import type { Project } from "@/types/domain";
import { useState, type FormEvent } from "react";
export function ProjectForm({
  project,
  onClose,
  onSaved,
}: {
  project?: Pick<Project, "id" | "name" | "description">;
  onClose: () => void;
  onSaved: (id: string) => void;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<unknown>();
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError(undefined);
    const form = new FormData(event.currentTarget);
    const input = {
      name: String(form.get("name")).trim(),
      description: String(form.get("description")).trim(),
    };
    try {
      const saved = project
        ? await projectsApi.update(project.id, input)
        : await projectsApi.create(input);
      onSaved(saved.id);
      onClose();
    } catch (failure) {
      setError(failure);
      setBusy(false);
    }
  }
  return (
    <Dialog
      title={project ? "Edit project" : "Create a project"}
      onClose={onClose}
      busy={busy}
    >
      <form onSubmit={submit} className="space-y-5">
        <ErrorMessage error={error} />
        <fieldset disabled={busy} className="space-y-5">
          <label className="field">
            Project name
            <input
              name="name"
              className="input"
              required
              maxLength={120}
              defaultValue={project?.name}
              placeholder="e.g. Website launch"
              autoFocus
            />
          </label>
          <label className="field">
            Description{" "}
            <span className="font-normal text-muted">
              Give your team a little direction.
            </span>
            <textarea
              name="description"
              className="input"
              maxLength={4000}
              defaultValue={project?.description}
              placeholder="What are we working towards?"
            />
          </label>
          <div className="flex justify-end gap-3 pt-3">
            <button
              className="btn btn-secondary"
              type="button"
              onClick={onClose}
            >
              Cancel
            </button>
            <button className="btn btn-primary" type="submit">
              {busy ? "Saving…" : project ? "Save changes" : "Create project"}
            </button>
          </div>
        </fieldset>
      </form>
    </Dialog>
  );
}
```

---

### `src/components/projects/ProjectWorkspace.tsx`

```typescript
"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import useSWR, { useSWRConfig } from "swr";
import {
  ArrowLeft,
  Pencil,
  Trash2,
  ArrowRight,
  Users,
  CheckCheck,
} from "lucide-react";
import { api } from "@/services/api/client";
import { projectsApi } from "@/services/api/projects";
import { authApi } from "@/services/api/auth";
import { tasksApi } from "@/services/api/tasks";
import type { ProjectDetail, User } from "@/types/domain";
import { Loading, LoadError } from "@/components/shared/Feedback";
import { Avatar } from "@/components/shared/Avatar";
import { ConfirmDialog } from "@/components/shared/Dialog";
import { ProjectForm } from "./ProjectForm";
import { TaskBoard } from "@/components/tasks/TaskBoard";
import { MembersPanel } from "@/components/members/MembersPanel";
import { statuses } from "@data/tasks";

export function ProjectWorkspace({ id }: { id: string }) {
  const {
    data: project,
    error,
    mutate: refresh,
  } = useSWR<ProjectDetail>(projectsApi.detail(id), api);
  const { data: user } = useSWR<User>(authApi.me, api);
  const { mutate } = useSWRConfig();
  const searchParams = useSearchParams();
  const router = useRouter();
  const selected = searchParams.get("tab");
  const tab =
    selected === "tasks" || selected === "members" ? selected : "overview";
  const [editing, setEditing] = useState(false);
  const [deleting, setDeleting] = useState(false);
  function refreshWorkspace() {
    void mutate(
      (key) =>
        typeof key === "string" &&
        (key.startsWith("/api/projects") || key === tasksApi.mine),
    );
  }
  if (error)
    return (
      <>
        <Link className="btn btn-secondary mb-5" href="/projects">
          <ArrowLeft size={16} />
          Back to projects
        </Link>
        <LoadError error={error} retry={() => void refresh()} />
      </>
    );
  if (!project || !user) return <Loading />;
  const isOwner = project.ownerId === user.id;
  const done = project.tasks.filter((task) => task.status === "DONE").length;
  return (
    <>
      <Link
        href="/projects"
        className="mb-6 inline-flex min-h-11 items-center gap-2 text-xs text-muted"
      >
        <ArrowLeft size={15} />
        All projects
      </Link>
      <div className="page-heading">
        <div className="min-w-0">
          <p className="eyebrow !mt-0 !mb-3">Project workspace</p>
          <h1 className="break-words">{project.name}</h1>
          <p className="flex items-center gap-2 !text-xs">
            <Users size={14} />
            {project.members.length} members<span className="px-1">·</span>
            <CheckCheck size={14} />
            {done}/{project.tasks.length} tasks complete
          </p>
        </div>
        {isOwner && (
          <div className="flex shrink-0 gap-2">
            <button
              className="btn btn-secondary"
              onClick={() => setEditing(true)}
            >
              <Pencil size={15} />
              Edit project
            </button>
            <button
              className="icon-button text-muted"
              aria-label="Delete project"
              onClick={() => setDeleting(true)}
            >
              <Trash2 size={17} />
            </button>
          </div>
        )}
      </div>
      <nav
        aria-label="Project sections"
        className="mb-7 flex gap-7 border-b border-line"
      >
        {["overview", "tasks", "members"].map((name) => (
          <Link
            key={name}
            href={`/projects/${id}?tab=${name}`}
            className={`tab capitalize ${tab === name ? "active" : ""}`}
            aria-current={tab === name ? "page" : undefined}
          >
            {name[0].toUpperCase() + name.slice(1)}
            {name === "tasks" && (
              <span className="ml-2 text-xs text-muted">
                {project.tasks.length}
              </span>
            )}
          </Link>
        ))}
      </nav>
      {tab === "overview" && (
        <div className="grid items-start gap-6 xl:grid-cols-[1.6fr_1fr]">
          <div className="space-y-6">
            <section className="card p-6">
              <p className="eyebrow mb-5">The plan</p>
              <h2 className="mb-3 text-lg">About this project</h2>
              <p className="whitespace-pre-wrap text-sm leading-7 break-words text-muted">
                {project.description ||
                  "Add a description to give your team a shared direction."}
              </p>
              <div className="mt-8 flex items-center gap-3 border-t border-line pt-5">
                <Avatar name={project.owner.name} />
                <div>
                  <p className="text-xs font-semibold">{project.owner.name}</p>
                  <p className="mt-1 text-[11px] text-muted">Project owner</p>
                </div>
              </div>
            </section>
            <section className="card p-6">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-lg">Work in focus</h2>
                <Link
                  href={`/projects/${id}?tab=tasks`}
                  className="flex min-h-11 items-center gap-2 text-xs text-accent"
                >
                  Open board
                  <ArrowRight size={15} />
                </Link>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {statuses.map((status) => (
                  <div key={status.value} className="rounded-lg bg-canvas p-4">
                    <p className="text-xs text-muted">{status.label}</p>
                    <p className="mt-3 text-2xl font-semibold">
                      {
                        project.tasks.filter(
                          (task) => task.status === status.value,
                        ).length
                      }
                    </p>
                  </div>
                ))}
              </div>
            </section>
          </div>
          <section className="card p-6">
            <p className="eyebrow mb-6">Every step counts</p>
            <div className="mb-5 flex items-end justify-between">
              <h2 className="text-lg">Project progress</h2>
              <span className="text-3xl font-semibold tracking-tight text-accent">
                {project.progress}%
              </span>
            </div>
            <div
              className="progress-track !h-2"
              role="progressbar"
              aria-label="Project completion"
              aria-valuenow={project.progress}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              <div
                className="progress-fill"
                style={{ width: `${project.progress}%` }}
              />
            </div>
            <p className="mt-4 text-xs leading-relaxed text-muted">
              {project.tasks.length
                ? `${done} of ${project.tasks.length} tasks complete. Progress updates as your team finishes work.`
                : "No tasks yet. Add your first task to start tracking progress."}
            </p>
            <div className="mt-8 border-t border-line pt-5">
              <p className="mb-3 text-xs font-semibold">Project team</p>
              <div className="flex flex-wrap gap-2">
                {project.members.slice(0, 8).map((member) => (
                  <span key={member.user.id} title={member.user.name}>
                    <Avatar name={member.user.name} />
                  </span>
                ))}
              </div>
              <Link
                href={`/projects/${id}?tab=members`}
                className="mt-4 inline-flex min-h-11 items-center gap-2 text-xs text-accent"
              >
                View all members
                <ArrowRight size={14} />
              </Link>
            </div>
          </section>
        </div>
      )}
      {tab === "tasks" && (
        <TaskBoard
          projectId={id}
          tasks={project.tasks}
          members={project.members}
          onUpdated={refreshWorkspace}
          selectedTaskId={searchParams.get("task")}
        />
      )}
      {tab === "members" && (
        <MembersPanel
          projectId={id}
          ownerId={project.ownerId}
          members={project.members}
          isOwner={isOwner}
          onUpdated={refreshWorkspace}
        />
      )}
      {editing && (
        <ProjectForm
          project={project}
          onClose={() => setEditing(false)}
          onSaved={refreshWorkspace}
        />
      )}
      {deleting && (
        <ConfirmDialog
          title="Delete this project?"
          description={`“${project.name}” and all its tasks and memberships will be permanently deleted.`}
          onClose={() => setDeleting(false)}
          action={async () => {
            await projectsApi.remove(id);
            await mutate(projectsApi.detail(id), undefined, {
              revalidate: false,
            });
            void mutate(projectsApi.list);
            void mutate(tasksApi.mine);
            router.replace("/projects");
          }}
        />
      )}
    </>
  );
}
```

---

### `src/components/tasks/TaskBoard.tsx`

```typescript
"use client";
import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import { statuses } from "@data/tasks";
import type { Task, Member, TaskStatus } from "@/types/domain";
import { tasksApi } from "@/services/api/tasks";
import { Avatar } from "@/components/shared/Avatar";
import { ConfirmDialog } from "@/components/shared/Dialog";
import { ErrorMessage } from "@/components/shared/Feedback";
import { TaskForm } from "./TaskForm";

export function TaskBoard({
  projectId,
  tasks,
  members,
  onUpdated,
  selectedTaskId,
}: {
  projectId: string;
  tasks: Task[];
  members: Member[];
  onUpdated: () => void;
  selectedTaskId: string | null;
}) {
  const [creating, setCreating] = useState<TaskStatus | null>(null);
  const [editingId, setEditingId] = useState<string | null>(selectedTaskId);
  const [deleting, setDeleting] = useState<Task | null>(null);
  const [search, setSearch] = useState("");
  const [mobileStatus, setMobileStatus] = useState<TaskStatus>("TODO");
  const [pending, setPending] = useState<string[]>([]);
  const [error, setError] = useState<unknown>();
  const reduced = useReducedMotion();
  const editing = tasks.find((task) => task.id === editingId);
  const visible = tasks.filter((task) =>
    task.title.toLowerCase().includes(search.toLowerCase()),
  );
  return (
    <>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <label className="relative w-full sm:w-64">
          <span className="sr-only">Search project tasks</span>
          <Search size={16} className="absolute top-3.5 left-3 text-muted" />
          <input
            className="input !pl-10"
            type="search"
            placeholder="Search tasks…"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </label>
        <button className="btn btn-primary" onClick={() => setCreating("TODO")}>
          <Plus size={16} />
          New task
        </button>
      </div>
      <ErrorMessage error={error} />
      <div
        className="mb-5 flex gap-2 lg:hidden"
        role="group"
        aria-label="Show task status"
      >
        {statuses.map((status) => (
          <button
            key={status.value}
            className={`btn flex-1 !px-2 ${mobileStatus === status.value ? "btn-primary" : "btn-secondary"}`}
            onClick={() => setMobileStatus(status.value)}
            aria-pressed={mobileStatus === status.value}
          >
            {status.label}
          </button>
        ))}
      </div>
      <div className="grid gap-5 lg:grid-cols-3">
        {statuses.map((status) => {
          const column = visible.filter((task) => task.status === status.value);
          return (
            <section
              key={status.value}
              aria-label={status.label}
              className={`min-w-0 rounded-xl border border-line bg-[#f0efeb] p-3 ${mobileStatus === status.value ? "" : "hidden lg:block"}`}
            >
              <div className="mb-4 flex items-center justify-between pl-1">
                <h2 className="flex items-center gap-2 text-xs">
                  <span className={`badge badge-${status.value}`}>
                    {status.label}
                  </span>
                  <span className="text-muted">{column.length}</span>
                </h2>
                <button
                  className="icon-button !h-9 !w-9 !border-transparent !bg-transparent"
                  aria-label={`Add ${status.label} task`}
                  onClick={() => setCreating(status.value)}
                >
                  <Plus size={16} />
                </button>
              </div>
              <div className="space-y-3">
                {column.map((task) => (
                  <motion.article
                    key={task.id}
                    layout={!reduced}
                    initial={reduced ? false : { opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.16 }}
                    className="task-card"
                  >
                    <div className="mb-3 flex items-start justify-between gap-2">
                      <button
                        className="min-h-11 min-w-0 text-left text-sm leading-relaxed font-semibold break-words hover:text-accent"
                        onClick={() => setEditingId(task.id)}
                      >
                        {task.title}
                      </button>
                      <div className="flex shrink-0">
                        <button
                          className="icon-button !h-11 !w-9 !border-0"
                          aria-label={`Edit ${task.title}`}
                          onClick={() => setEditingId(task.id)}
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          className="icon-button !h-11 !w-9 !border-0 text-muted"
                          aria-label={`Delete ${task.title}`}
                          onClick={() => setDeleting(task)}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                    {task.description && (
                      <p className="mb-5 line-clamp-3 text-xs leading-relaxed break-words text-muted">
                        {task.description}
                      </p>
                    )}
                    <div className="flex min-w-0 items-center gap-2 border-t border-line pt-3">
                      {task.assignee ? (
                        <>
                          <Avatar name={task.assignee.name} />
                          <span className="truncate text-[11px] text-muted">
                            {task.assignee.name}
                          </span>
                        </>
                      ) : (
                        <span className="py-2 text-[11px] text-muted">
                          Unassigned
                        </span>
                      )}
                    </div>
                    <label className="mt-3 block">
                      <span className="sr-only">Status for {task.title}</span>
                      <select
                        className="input !min-h-11 !text-xs"
                        value={task.status}
                        disabled={pending.includes(task.id)}
                        onChange={async (event) => {
                          const next = event.target.value as TaskStatus;
                          setPending((ids) => [...ids, task.id]);
                          setError(undefined);
                          try {
                            await tasksApi.update(task.id, { status: next });
                            onUpdated();
                          } catch (failure) {
                            setError(failure);
                          } finally {
                            setPending((ids) =>
                              ids.filter((id) => id !== task.id),
                            );
                          }
                        }}
                      >
                        {statuses.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </label>
                  </motion.article>
                ))}
                {!column.length && (
                  <p className="rounded-lg border border-dashed border-[#d8d5cf] px-3 py-10 text-center text-xs text-muted">
                    {search
                      ? "No matching tasks."
                      : "A little room for the next step."}
                  </p>
                )}
              </div>
            </section>
          );
        })}
      </div>
      {creating && (
        <TaskForm
          projectId={projectId}
          members={members}
          initialStatus={creating}
          onClose={() => setCreating(null)}
          onSaved={onUpdated}
        />
      )}
      {editing && (
        <TaskForm
          projectId={projectId}
          members={members}
          task={editing}
          onClose={() => setEditingId(null)}
          onSaved={onUpdated}
        />
      )}
      {deleting && (
        <ConfirmDialog
          title="Delete task?"
          description={`“${deleting.title}” will be permanently removed from this project.`}
          onClose={() => setDeleting(null)}
          action={async () => {
            await tasksApi.remove(deleting.id);
            onUpdated();
          }}
        />
      )}
    </>
  );
}
```

---

### `src/components/tasks/TaskForm.tsx`

```typescript
"use client";
import { useState, type FormEvent } from "react";
import { Dialog } from "@/components/shared/Dialog";
import { ErrorMessage } from "@/components/shared/Feedback";
import { tasksApi } from "@/services/api/tasks";
import { statuses } from "@data/tasks";
import type { Member, Task, TaskStatus } from "@/types/domain";

export function TaskForm({
  projectId,
  members,
  task,
  initialStatus = "TODO",
  onClose,
  onSaved,
}: {
  projectId: string;
  members: Member[];
  task?: Task;
  initialStatus?: TaskStatus;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<unknown>();
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const input = {
      title: String(form.get("title")).trim(),
      description: String(form.get("description")).trim(),
      status: String(form.get("status")) as TaskStatus,
      assigneeId: String(form.get("assigneeId")) || null,
    };
    setBusy(true);
    setError(undefined);
    try {
      if (task) await tasksApi.update(task.id, input);
      else await tasksApi.create(projectId, input);
      onSaved();
      onClose();
    } catch (failure) {
      setError(failure);
      setBusy(false);
    }
  }
  return (
    <Dialog
      title={task ? "Edit task" : "Create a task"}
      onClose={onClose}
      busy={busy}
    >
      <form onSubmit={submit} className="space-y-5">
        <ErrorMessage error={error} />
        <fieldset disabled={busy} className="space-y-5">
          <label className="field">
            Task title
            <input
              className="input"
              name="title"
              required
              maxLength={160}
              defaultValue={task?.title}
              placeholder="What needs to happen?"
              autoFocus
            />
          </label>
          <label className="field">
            Description
            <textarea
              className="input"
              name="description"
              maxLength={4000}
              defaultValue={task?.description}
              placeholder="Add the details your team needs…"
            />
          </label>
          <div className="grid gap-5 sm:grid-cols-2">
            <label className="field">
              Status
              <select
                className="input"
                name="status"
                defaultValue={task?.status || initialStatus}
              >
                {statuses.map((status) => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="field">
              Assignee
              <select
                className="input"
                name="assigneeId"
                defaultValue={task?.assigneeId || ""}
              >
                <option value="">Unassigned</option>
                {members.map((member) => (
                  <option key={member.user.id} value={member.user.id}>
                    {member.user.name}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div className="flex justify-end gap-3 pt-3">
            <button
              className="btn btn-secondary"
              type="button"
              onClick={onClose}
            >
              Cancel
            </button>
            <button className="btn btn-primary" type="submit">
              {busy ? "Saving…" : task ? "Save changes" : "Create task"}
            </button>
          </div>
        </fieldset>
      </form>
    </Dialog>
  );
}
```

---

### `src/components/tasks/TaskList.tsx`

```typescript
"use client";
import Link from "next/link";
import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { statuses } from "@data/tasks";
import type { MyTask, TaskStatus } from "@/types/domain";
import { tasksApi } from "@/services/api/tasks";
import { ErrorMessage } from "@/components/shared/Feedback";
export function TaskList({
  tasks,
  onUpdated,
}: {
  tasks: MyTask[];
  onUpdated: () => void;
}) {
  const [pending, setPending] = useState<string[]>([]);
  const [error, setError] = useState<unknown>();
  return (
    <div className="space-y-3">
      <ErrorMessage error={error} />
      <div className="card divide-y divide-line overflow-hidden">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="flex flex-col justify-between gap-4 p-5 sm:flex-row sm:items-center"
          >
            <Link
              href={`/projects/${task.projectId}?tab=tasks&task=${task.id}`}
              className="group min-w-0"
            >
              <h3 className="flex items-start gap-2 text-sm">
                <span className="break-words">{task.title}</span>
                <ArrowUpRight
                  size={14}
                  className="shrink-0 text-muted group-hover:text-accent"
                />
              </h3>
              <p className="mt-1.5 text-xs text-muted">{task.project.name}</p>
            </Link>
            <label>
              <span className="sr-only">Status for {task.title}</span>
              <select
                className={`input !min-h-11 !w-auto !min-w-36 !text-xs badge-${task.status}`}
                value={task.status}
                disabled={pending.includes(task.id)}
                onChange={async (event) => {
                  const status = event.target.value as TaskStatus;
                  setPending((ids) => [...ids, task.id]);
                  setError(undefined);
                  try {
                    await tasksApi.update(task.id, { status });
                    onUpdated();
                  } catch (failure) {
                    setError(failure);
                  } finally {
                    setPending((ids) => ids.filter((id) => id !== task.id));
                  }
                }}
              >
                {statuses.map((status) => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}
```

---

### `src/components/members/MembersPanel.tsx`

```typescript
"use client";
import { useState, type FormEvent } from "react";
import { UserPlus, Trash2, Crown } from "lucide-react";
import { Avatar } from "@/components/shared/Avatar";
import { Dialog, ConfirmDialog } from "@/components/shared/Dialog";
import { ErrorMessage } from "@/components/shared/Feedback";
import { projectsApi } from "@/services/api/projects";
import type { Member } from "@/types/domain";

export function MembersPanel({
  projectId,
  ownerId,
  members,
  isOwner,
  onUpdated,
}: {
  projectId: string;
  ownerId: string;
  members: Member[];
  isOwner: boolean;
  onUpdated: () => void;
}) {
  const [adding, setAdding] = useState(false);
  const [removing, setRemoving] = useState<Member | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<unknown>();
  async function add(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError(undefined);
    const form = new FormData(event.currentTarget);
    try {
      await projectsApi.addMember(projectId, String(form.get("email")));
      onUpdated();
      setAdding(false);
    } catch (failure) {
      setError(failure);
    } finally {
      setBusy(false);
    }
  }
  return (
    <>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg">The people behind the project</h2>
          <p className="mt-2 text-xs text-muted">
            {members.length} {members.length === 1 ? "member" : "members"} ·
            Everyone can create and update tasks.
          </p>
        </div>
        {isOwner && (
          <button
            className="btn btn-primary"
            onClick={() => {
              setError(undefined);
              setAdding(true);
            }}
          >
            <UserPlus size={16} />
            Add member
          </button>
        )}
      </div>
      <div className="card divide-y divide-line">
        {members.map((member) => (
          <div
            key={member.user.id}
            className="flex min-w-0 items-center justify-between gap-3 p-5"
          >
            <div className="flex min-w-0 items-center gap-3">
              <Avatar name={member.user.name} />
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">
                  {member.user.name}
                </p>
                <p className="mt-1 truncate text-xs text-muted">
                  {member.user.email}
                </p>
              </div>
            </div>
            {member.user.id === ownerId ? (
              <span className="badge bg-canvas text-muted">
                <Crown size={13} />
                Owner
              </span>
            ) : isOwner ? (
              <button
                className="icon-button text-muted"
                aria-label={`Remove ${member.user.name}`}
                onClick={() => setRemoving(member)}
              >
                <Trash2 size={16} />
              </button>
            ) : (
              <span className="badge bg-canvas text-muted">Member</span>
            )}
          </div>
        ))}
      </div>
      {adding && (
        <Dialog
          title="Add a project member"
          onClose={() => setAdding(false)}
          busy={busy}
        >
          <p className="mb-5 text-sm leading-relaxed text-muted">
            Add someone who already has a Taskora account. They’ll be able to
            view this project and work on its tasks.
          </p>
          <form onSubmit={add} className="space-y-5">
            <ErrorMessage error={error} />
            <label className="field">
              Email
              <input
                className="input"
                name="email"
                type="email"
                required
                maxLength={254}
                placeholder="teammate@company.com"
                disabled={busy}
                autoFocus
              />
            </label>
            <div className="flex justify-end gap-3">
              <button
                className="btn btn-secondary"
                type="button"
                onClick={() => setAdding(false)}
                disabled={busy}
              >
                Cancel
              </button>
              <button className="btn btn-primary" type="submit" disabled={busy}>
                {busy ? "Adding…" : "Add member"}
              </button>
            </div>
          </form>
        </Dialog>
      )}
      {removing && (
        <ConfirmDialog
          title="Remove member?"
          description={`${removing.user.name} will lose access to this project. Their tasks will become unassigned.`}
          label="Remove member"
          onClose={() => setRemoving(null)}
          action={async () => {
            await projectsApi.removeMember(projectId, removing.user.id);
            onUpdated();
          }}
        />
      )}
    </>
  );
}
```

---

### `src/app/layout.tsx`

```typescript
import type { Metadata } from "next";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: {
    default: "Taskora — Plan. Assign. Deliver.",
    template: "%s · Taskora",
  },
  description:
    "A focused workspace to plan projects, assign work, and track your team's progress.",
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
```

---

### `src/app/page.tsx`

```typescript
import Link from "next/link";
import {
  ArrowUpRight,
  ArrowRight,
  Check,
  Circle,
  Layers2,
  Users,
  LayoutGrid,
} from "lucide-react";
import { Brand } from "@/components/shared/Brand";
import { brand } from "@data/brand";
import { values, previewColumns } from "@data/marketing";

export default function Landing() {
  return (
    <>
      <header className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-6 md:px-10">
        <Brand />
        <nav className="flex items-center gap-3 sm:gap-6" aria-label="Main">
          <Link href="/login" className="text-sm font-medium">
            Sign In
          </Link>
          <Link href="/register" className="btn btn-primary">
            Get Started
            <ArrowUpRight size={16} />
          </Link>
        </nav>
      </header>
      <main id="main">
        <section className="mx-auto grid max-w-7xl items-center gap-12 px-5 pt-14 pb-20 md:px-10 lg:grid-cols-[1.05fr_1fr] lg:gap-16 lg:pt-24 lg:pb-28">
          <div>
            <div className="eyebrow mb-7 flex items-center gap-3">
              <span className="h-px w-8 bg-accent" />
              Less noise. More momentum.
            </div>
            <h1 className="hero-title">
              Keep every
              <br />
              project <span className="text-accent italic">moving.</span>
            </h1>
            <p className="mt-7 max-w-md text-lg leading-relaxed text-muted">
              {brand.description} A little more clarity. A lot more forward.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-6">
              <Link href="/register" className="btn btn-primary">
                Create your workspace
                <ArrowRight size={17} />
              </Link>
              <a
                href="#how-it-works"
                className="inline-flex min-h-11 items-center gap-2 text-sm font-medium"
              >
                Take a closer look
                <ArrowUpRight size={16} />
              </a>
            </div>
            <p className="mt-7 flex items-center gap-2 text-xs text-muted">
              <Check size={14} className="text-accent" />A focused space for you
              and your team.
            </p>
          </div>
          <div className="relative rounded-2xl border border-line bg-[#ebe8e2] p-4 sm:p-7">
            <div className="card overflow-hidden shadow-xl shadow-black/5">
              <div className="flex items-center justify-between border-b border-line px-5 py-4">
                <span className="flex items-center gap-2 text-xs font-semibold">
                  <Layers2 size={16} className="text-accent" />
                  Taskora workspace
                </span>
                <span className="text-[10px] text-muted">Product preview</span>
              </div>
              <div className="p-5 sm:p-6">
                <div className="eyebrow mb-3">A shared plan</div>
                <h2 className="text-xl tracking-tight">Website launch</h2>
                <p className="mt-2 text-xs text-muted">
                  Good work starts with a clear direction.
                </p>
                <div className="mt-5 mb-6 flex items-center justify-between border-b border-line pb-4">
                  <span className="flex items-center gap-2 text-xs text-muted">
                    <Users size={14} />
                    Your project team
                  </span>
                  <span className="badge badge-IN_PROGRESS">In progress</span>
                </div>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  {previewColumns.map((column, index) => (
                    <div
                      key={column.label}
                      className="rounded-lg bg-canvas p-2.5"
                    >
                      <div className="mb-3 flex items-center gap-1.5 text-[10px] font-semibold">
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${index === 2 ? "bg-[#47725a]" : index === 1 ? "bg-[#b98a3e]" : "bg-[#98958f]"}`}
                        />
                        {column.label}
                        <span className="ml-auto text-muted">
                          {column.tasks.length}
                        </span>
                      </div>
                      {column.tasks.map((task) => (
                        <div
                          key={task}
                          className="mb-2 rounded-md border border-line bg-white px-3 py-4 text-[11px] leading-relaxed"
                        >
                          <span className="mb-3 block h-1 w-7 rounded bg-[#dfc1c9]" />
                          {task}
                          <div className="mt-4 flex items-center justify-between">
                            <Circle size={10} className="text-muted" />
                            <span className="h-4 w-4 rounded-full bg-[#e8e5df]" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <p className="mt-5 text-center text-[11px] tracking-wide text-muted">
              ONE PROJECT. ONE TEAM. A CLEAR WAY FORWARD.
            </p>
          </div>
        </section>
        <section id="how-it-works" className="border-y border-line bg-white">
          <div className="mx-auto max-w-7xl px-5 py-16 md:px-10 md:py-20">
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
              <div>
                <p className="eyebrow mb-4">Built around the work</p>
                <h2 className="text-3xl tracking-tight md:text-4xl">
                  Everything you need.
                  <br />
                  Room to focus.
                </h2>
              </div>
              <p className="max-w-sm leading-relaxed text-muted">
                From the first idea to the last task, keep your team aligned
                without adding more to their plate.
              </p>
            </div>
            <div className="mt-12 grid gap-8 md:grid-cols-3">
              {values.map((value) => (
                <article
                  key={value.number}
                  className="border-t border-line pt-6"
                >
                  <span className="text-xs text-accent">/ {value.number}</span>
                  <h3 className="mt-5 mb-3 text-lg">{value.title}</h3>
                  <p className="max-w-sm leading-relaxed text-muted">
                    {value.description}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>
        <section className="mx-auto max-w-7xl px-5 py-16 md:px-10">
          <div className="flex flex-col items-start justify-between gap-8 rounded-2xl bg-[#2b2928] px-8 py-12 text-white md:flex-row md:items-center md:px-12">
            <div>
              <LayoutGrid size={24} className="mb-5 text-[#d3a7b3]" />
              <h2 className="text-3xl tracking-tight">
                Make space for your next project.
              </h2>
              <p className="mt-3 text-[#bbb6b2]">
                Bring the plan, the people, and the progress together.
              </p>
            </div>
            <Link href="/register" className="btn bg-white text-ink">
              Get Started
              <ArrowUpRight size={17} />
            </Link>
          </div>
        </section>
      </main>
      <footer className="mx-auto flex max-w-7xl flex-col justify-between gap-4 border-t border-line px-5 py-7 sm:flex-row md:px-10">
        <Brand />
        <p className="self-start text-xs text-muted sm:self-center">
          {brand.tagline}
        </p>
      </footer>
    </>
  );
}
```

---

### `src/app/error.tsx`

```typescript
"use client";
import { useEffect } from "react";
export default function ErrorPage({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);
  return (
    <main id="main" className="mx-auto max-w-lg space-y-5 p-8">
      <h1 className="text-2xl">Something interrupted your workspace.</h1>
      <p className="text-muted">Please try loading this page again.</p>
      <button className="btn btn-primary" onClick={reset}>
        Try again
      </button>
    </main>
  );
}
```

---

### `src/app/not-found.tsx`

```typescript
import Link from "next/link";
export default function NotFound() {
  return (
    <main
      id="main"
      className="mx-auto flex min-h-dvh max-w-lg flex-col items-center justify-center gap-5 px-6 text-center"
    >
      <p className="eyebrow">404 · A wrong turn</p>
      <h1 className="text-3xl">This page isn’t here.</h1>
      <p className="text-muted">Let’s get you back to your workspace.</p>
      <Link href="/dashboard" className="btn btn-primary">
        Go to dashboard
      </Link>
    </main>
  );
}
```

---

### `src/app/(auth)/layout.tsx`

```typescript
import { Brand } from "@/components/shared/Brand";
import { Check } from "lucide-react";
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid min-h-dvh lg:grid-cols-2">
      <aside className="hidden flex-col justify-between bg-[#eeeae3] p-12 lg:flex">
        <Brand />
        <div className="max-w-lg">
          <p className="eyebrow mb-7">Plan. Assign. Deliver.</p>
          <h2 className="font-serif text-6xl leading-[1.06] tracking-tight">
            Good work starts
            <br />
            with a <span className="text-accent italic">clear plan.</span>
          </h2>
          <p className="mt-6 max-w-sm text-base leading-relaxed text-muted">
            A shared space for the projects that matter and the people who make
            them happen.
          </p>
          <div className="mt-10 space-y-4 text-sm">
            <p className="flex items-center gap-3">
              <Check size={17} className="text-accent" />
              Bring every project into focus
            </p>
            <p className="flex items-center gap-3">
              <Check size={17} className="text-accent" />
              Give every task a clear owner
            </p>
            <p className="flex items-center gap-3">
              <Check size={17} className="text-accent" />
              See progress as it happens
            </p>
          </div>
        </div>
        <p className="text-xs text-muted">
          A little more clarity. A lot more forward.
        </p>
      </aside>
      <div className="flex min-h-dvh flex-col bg-white">
        <div className="px-6 pt-7 lg:hidden">
          <Brand />
        </div>
        <main
          id="main"
          className="flex flex-1 items-center justify-center px-6 py-12"
        >
          {children}
        </main>
      </div>
    </div>
  );
}
```

---

### `src/app/(auth)/login/page.tsx`

```typescript
import { AuthForm } from "@/components/auth/AuthForm";
export const metadata = { title: "Sign In" };
export default function LoginPage() {
  return <AuthForm />;
}
```

---

### `src/app/(auth)/register/page.tsx`

```typescript
import { AuthForm } from "@/components/auth/AuthForm";
export const metadata = { title: "Create account" };
export default function RegisterPage() {
  return <AuthForm register />;
}
```

---

### `src/app/(workspace)/layout.tsx`

```typescript
import { AppShell } from "@/components/shell/AppShell";
export default function WorkspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppShell>{children}</AppShell>;
}
```

---

### `src/app/(workspace)/dashboard/page.tsx`

```typescript
"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import {
  FolderKanban,
  CircleDot,
  CheckCheck,
  Users,
  Plus,
  ArrowRight,
} from "lucide-react";
import { api } from "@/services/api/client";
import { authApi } from "@/services/api/auth";
import { projectsApi } from "@/services/api/projects";
import { tasksApi } from "@/services/api/tasks";
import type { User, ProjectSummary, MyTask } from "@/types/domain";
import { Loading, LoadError, EmptyState } from "@/components/shared/Feedback";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { ProjectForm } from "@/components/projects/ProjectForm";
import { TaskList } from "@/components/tasks/TaskList";

export default function DashboardPage() {
  const { data: user } = useSWR<User>(authApi.me, api);
  const {
    data: projects,
    error: projectError,
    mutate: refreshProjects,
  } = useSWR<ProjectSummary[]>(projectsApi.list, api);
  const {
    data: tasks,
    error: taskError,
    mutate: refreshTasks,
  } = useSWR<MyTask[]>(tasksApi.mine, api);
  const [creating, setCreating] = useState(false);
  const router = useRouter();
  if (projectError || taskError)
    return (
      <LoadError
        error={projectError || taskError}
        retry={() => {
          void refreshProjects();
          void refreshTasks();
        }}
      />
    );
  if (!projects || !tasks || !user) return <Loading />;
  const completed = projects.reduce(
    (sum, project) => sum + project.completedTaskCount,
    0,
  );
  const total = projects.reduce((sum, project) => sum + project.taskCount, 0);
  const team = new Set(projects.flatMap((project) => project.memberIds));
  const active = projects.filter(
    (project) => project.taskCount === 0 || project.progress < 100,
  ).length;
  const stats = [
    {
      label: "Active Projects",
      value: active,
      icon: FolderKanban,
      detail: "Plans in motion",
    },
    {
      label: "Open Tasks",
      value: total - completed,
      icon: CircleDot,
      detail: "Across your projects",
    },
    {
      label: "Completed Tasks",
      value: completed,
      icon: CheckCheck,
      detail: "Progress made together",
    },
    {
      label: "Team Members",
      value: team.size,
      icon: Users,
      detail: "People in your projects",
    },
  ];
  const assigned = tasks.filter((task) => task.status !== "DONE").slice(0, 5);
  return (
    <>
      <div className="page-heading">
        <div>
          <p className="eyebrow !mt-0 !mb-3">Your workspace, at a glance</p>
          <h1>Welcome back, {user.name.split(" ")[0]}.</h1>
          <p>Here’s where things stand. Let’s keep them moving.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setCreating(true)}>
          <Plus size={17} />
          New project
        </button>
      </div>
      <div className="mb-10 grid grid-cols-2 gap-3 xl:grid-cols-4 xl:gap-5">
        {stats.map((stat) => (
          <div key={stat.label} className="card p-4 sm:p-5">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs text-muted">{stat.label}</span>
              <stat.icon size={17} strokeWidth={1.6} className="text-accent" />
            </div>
            <p className="mt-5 text-3xl font-semibold tracking-tight">
              {stat.value}
            </p>
            <p className="mt-2 text-[11px] text-muted">{stat.detail}</p>
          </div>
        ))}
      </div>
      <section>
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg tracking-tight">Recent projects</h2>
          <Link
            href="/projects"
            className="flex min-h-11 items-center gap-2 text-xs font-medium text-muted"
          >
            All projects
            <ArrowRight size={15} />
          </Link>
        </div>
        {projects.length ? (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {projects.slice(0, 3).map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="Start with a project."
            description="Your dashboard will take shape as you create projects and work with your team."
          >
            <button
              className="btn btn-primary"
              onClick={() => setCreating(true)}
            >
              Create a project
              <Plus size={16} />
            </button>
          </EmptyState>
        )}
      </section>
      <section className="mt-10">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-lg tracking-tight">Your next moves</h2>
            <p className="mt-1.5 text-xs text-muted">
              Open tasks assigned to you.
            </p>
          </div>
          <Link
            href="/my-tasks"
            className="flex min-h-11 items-center gap-2 text-xs font-medium text-muted"
          >
            My Tasks
            <ArrowRight size={15} />
          </Link>
        </div>
        {assigned.length ? (
          <TaskList
            tasks={assigned}
            onUpdated={() => {
              void refreshTasks();
              void refreshProjects();
            }}
          />
        ) : (
          <EmptyState
            title="A clear view ahead."
            description="You have no open assigned tasks. Pick up work from a project, or take a moment to enjoy the progress."
          />
        )}
      </section>
      {creating && (
        <ProjectForm
          onClose={() => setCreating(false)}
          onSaved={(id) => {
            void refreshProjects();
            router.push(`/projects/${id}`);
          }}
        />
      )}
    </>
  );
}
```

---

### `src/app/(workspace)/projects/page.tsx`

```typescript
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import { Plus, Search } from "lucide-react";
import { api } from "@/services/api/client";
import { projectsApi } from "@/services/api/projects";
import type { ProjectSummary } from "@/types/domain";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { ProjectForm } from "@/components/projects/ProjectForm";
import { Loading, LoadError, EmptyState } from "@/components/shared/Feedback";

export default function ProjectsPage() {
  const { data, error, mutate } = useSWR<ProjectSummary[]>(
    projectsApi.list,
    api,
  );
  const [creating, setCreating] = useState(false);
  const [search, setSearch] = useState("");
  const router = useRouter();
  if (error) return <LoadError error={error} retry={() => void mutate()} />;
  if (!data) return <Loading />;
  const projects = data.filter((project) =>
    project.name.toLowerCase().includes(search.toLowerCase()),
  );
  return (
    <>
      <div className="page-heading">
        <div>
          <p className="eyebrow !mt-0 !mb-3">A place for every plan</p>
          <h1>Projects</h1>
          <p>Your team’s work, all in one place.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setCreating(true)}>
          <Plus size={17} />
          New project
        </button>
      </div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <span className="text-sm font-medium">
          All projects{" "}
          <span className="ml-2 rounded-md bg-white px-2 py-1 text-xs text-muted">
            {data.length}
          </span>
        </span>
        <label className="relative w-full sm:w-64">
          <span className="sr-only">Search projects</span>
          <Search size={16} className="absolute top-3.5 left-3 text-muted" />
          <input
            className="input !pl-10"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search projects…"
            type="search"
          />
        </label>
      </div>
      {projects.length ? (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      ) : (
        <EmptyState
          title={
            search ? "No matching projects" : "Your next project starts here."
          }
          description={
            search
              ? "Try another project name."
              : "Create a project, bring in your team, and give your work a clear direction."
          }
        >
          {!search && (
            <button
              className="btn btn-primary"
              onClick={() => setCreating(true)}
            >
              <Plus size={16} />
              Create your first project
            </button>
          )}
        </EmptyState>
      )}
      {creating && (
        <ProjectForm
          onClose={() => setCreating(false)}
          onSaved={(id) => {
            void mutate();
            router.push(`/projects/${id}`);
          }}
        />
      )}
    </>
  );
}
```

---

### `src/app/(workspace)/projects/[projectId]/page.tsx`

```typescript
import { Suspense } from "react";
import { ProjectWorkspace } from "@/components/projects/ProjectWorkspace";
import { Loading } from "@/components/shared/Feedback";
export const metadata = { title: "Project workspace" };
export default async function ProjectPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  return (
    <Suspense fallback={<Loading />}>
      <ProjectWorkspace id={projectId} />
    </Suspense>
  );
}
```

---

### `src/app/(workspace)/my-tasks/page.tsx`

```typescript
"use client";
import { useState } from "react";
import useSWR, { useSWRConfig } from "swr";
import { Search } from "lucide-react";
import { api } from "@/services/api/client";
import { tasksApi } from "@/services/api/tasks";
import type { MyTask } from "@/types/domain";
import { statuses } from "@data/tasks";
import { TaskList } from "@/components/tasks/TaskList";
import { Loading, LoadError, EmptyState } from "@/components/shared/Feedback";
export default function MyTasksPage() {
  const { data, error, mutate: refresh } = useSWR<MyTask[]>(tasksApi.mine, api);
  const { mutate } = useSWRConfig();
  const [filter, setFilter] = useState("ALL");
  const [search, setSearch] = useState("");
  if (error) return <LoadError error={error} retry={() => void refresh()} />;
  if (!data) return <Loading />;
  const tasks = data.filter(
    (task) =>
      (filter === "ALL" || task.status === filter) &&
      `${task.title} ${task.project.name}`
        .toLowerCase()
        .includes(search.toLowerCase()),
  );
  return (
    <>
      <div className="page-heading">
        <div>
          <p className="eyebrow !mt-0 !mb-3">A little room to focus</p>
          <h1>My Tasks</h1>
          <p>Your assigned work, across every project.</p>
        </div>
        <span className="badge badge-IN_PROGRESS">
          {data.filter((task) => task.status !== "DONE").length} open tasks
        </span>
      </div>
      <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row">
        <div
          className="flex flex-wrap gap-2"
          role="group"
          aria-label="Filter tasks by status"
        >
          {[{ value: "ALL", label: "All tasks" }, ...statuses].map((status) => (
            <button
              key={status.value}
              className={`btn ${filter === status.value ? "btn-primary" : "btn-secondary"}`}
              aria-pressed={filter === status.value}
              onClick={() => setFilter(status.value)}
            >
              {status.label}
            </button>
          ))}
        </div>
        <label className="relative">
          <span className="sr-only">Search assigned tasks</span>
          <Search size={16} className="absolute top-3.5 left-3 text-muted" />
          <input
            type="search"
            className="input !pl-10"
            placeholder="Search tasks…"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </label>
      </div>
      {tasks.length ? (
        <TaskList
          tasks={tasks}
          onUpdated={() => {
            void mutate(
              (key) =>
                typeof key === "string" &&
                (key.startsWith("/api/projects") || key === tasksApi.mine),
            );
          }}
        />
      ) : (
        <EmptyState
          title={
            data.length ? "No tasks in this view." : "Your focus starts here."
          }
          description={
            data.length
              ? "Try a different status or search term."
              : "Tasks assigned to you will appear here. Open a project to find your next piece of work."
          }
        />
      )}
    </>
  );
}
```

---

### `data/brand/index.ts`

```typescript
export const brand = {
  name: "Taskora",
  tagline: "Plan. Assign. Deliver.",
  description: "Plan projects, assign work, and track progress in one place.",
};
```

---

### `data/navigation/index.ts`

```typescript
export const navigation = [
  { href: "/dashboard", label: "Dashboard", icon: "dashboard" },
  { href: "/projects", label: "Projects", icon: "projects" },
  { href: "/my-tasks", label: "My Tasks", icon: "tasks" },
] as const;
```

---

### `data/marketing/index.ts`

```typescript
export const values = [
  {
    number: "01",
    title: "A clear place to start.",
    description:
      "Give every project a home. Keep the purpose, people, and work together.",
  },
  {
    number: "02",
    title: "Everyone knows their next move.",
    description:
      "Assign work to your team and turn a shared plan into individual focus.",
  },
  {
    number: "03",
    title: "Progress you can see.",
    description:
      "Move tasks from to do to done. See your project progress as the work happens.",
  },
];
export const previewColumns = [
  {
    label: "To Do",
    tasks: ["Gather launch feedback", "Prepare release notes"],
  },
  { label: "In Progress", tasks: ["Build the project workspace"] },
  {
    label: "Done",
    tasks: ["Define the visual direction", "Map the user journey"],
  },
];
```

---

### `data/tasks.ts`

```typescript
export const statuses = [
  { value: "TODO", label: "To Do" },
  { value: "IN_PROGRESS", label: "In Progress" },
  { value: "DONE", label: "Done" },
] as const;
```

---

### `src/styles/tokens.css`

```css
:root {
  --canvas: #f7f6f3;
  --surface: #fff;
  --ink: #252525;
  --muted: #73716f;
  --line: #e7e5e1;
  --accent: #7b283e;
  --accent-hover: #632034;
  --accent-soft: #f4e9ed;
  --success: #306b53;
  --success-soft: #e9f2ec;
  --amber: #8a601e;
  --amber-soft: #f7f0df;
}
```

---

### `src/styles/animations.css`

```css
@keyframes shimmer {
  to {
    background-position: -200% 0;
  }
}
.skeleton {
  background: linear-gradient(90deg, #eee 25%, #f8f8f8 50%, #eee 75%);
  background-size: 200% 100%;
  animation: shimmer 1.8s infinite;
  border-radius: 12px;
}
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

---

### `src/styles/globals.css`

```css
@import "tailwindcss";
@import "./tokens.css";
@import "./animations.css";
@theme inline {
  --color-accent: var(--accent);
  --color-ink: var(--ink);
  --color-muted: var(--muted);
  --color-line: var(--line);
  --color-canvas: var(--canvas);
}
* {
  box-sizing: border-box;
}
body {
  margin: 0;
  color: var(--ink);
  background: var(--canvas);
  font-family: Arial, Helvetica, sans-serif;
  font-size: 14px;
  -webkit-font-smoothing: antialiased;
}
button,
input,
textarea,
select {
  font: inherit;
}
button,
a {
  touch-action: manipulation;
}
button:not(:disabled),
select {
  cursor: pointer;
}
button:disabled {
  opacity: 0.6;
  cursor: wait;
}
a {
  text-decoration: none;
}
:focus-visible {
  outline: 3px solid #b1647a;
  outline-offset: 3px;
}
button,
a,
input,
select,
textarea {
  transition:
    background-color 0.16s,
    border-color 0.16s,
    box-shadow 0.16s;
}
h1,
h2,
h3,
p {
  margin: 0;
}
h1,
h2,
h3 {
  font-weight: 600;
}
h1 {
  letter-spacing: -0.035em;
}
::selection {
  background: #ead1d9;
}
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 44px;
  padding: 10px 17px;
  border: 1px solid transparent;
  border-radius: 8px;
  font-weight: 600;
  font-size: 13px;
  white-space: nowrap;
}
.btn-primary {
  background: var(--accent);
  color: white;
}
.btn-primary:hover {
  background: var(--accent-hover);
}
.btn-secondary {
  border-color: var(--line);
  background: white;
  color: var(--ink);
}
.btn-secondary:hover,
.icon-button:hover {
  background: #f1f0ed;
}
.btn-danger {
  color: #a32e35;
  border-color: #ecd5d6;
  background: #fff7f7;
}
.btn-danger:hover {
  background: #fbe6e7;
}
.icon-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border: 1px solid var(--line);
  border-radius: 8px;
  background: white;
  flex-shrink: 0;
}
.card {
  background: white;
  border: 1px solid var(--line);
  border-radius: 12px;
}
.eyebrow {
  color: var(--muted);
  font-size: 11px;
  letter-spacing: 0.13em;
  text-transform: uppercase;
  font-weight: 600;
}
.field {
  display: grid;
  gap: 7px;
  font-size: 13px;
  font-weight: 600;
}
.input {
  width: 100%;
  min-height: 46px;
  padding: 11px 13px;
  background: white;
  border: 1px solid #dcdad5;
  border-radius: 8px;
  color: var(--ink);
  font-weight: 400;
}
.input:focus {
  outline: 2px solid #dac0c9;
  outline-offset: 1px;
  border-color: var(--accent);
}
.input::placeholder {
  color: #92908b;
}
textarea.input {
  resize: vertical;
  min-height: 108px;
}
.error-message {
  padding: 12px 14px;
  border: 1px solid #eccbcf;
  border-radius: 8px;
  background: #fff2f3;
  color: #9a2f3d;
  font-size: 13px;
  line-height: 1.6;
}
.badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 9px;
  border-radius: 5px;
  font-size: 11px;
  font-weight: 600;
  white-space: nowrap;
}
.badge-TODO {
  color: #686967;
  background: #efefec;
}
.badge-IN_PROGRESS {
  color: var(--amber);
  background: var(--amber-soft);
}
.badge-DONE {
  color: var(--success);
  background: var(--success-soft);
}
.avatar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: var(--accent-soft);
  color: var(--accent);
  width: 34px;
  height: 34px;
  flex-shrink: 0;
  font-size: 11px;
  font-weight: 700;
}
.progress-track {
  height: 5px;
  background: #eeede9;
  border-radius: 8px;
  overflow: hidden;
}
.progress-fill {
  height: 100%;
  background: var(--accent);
  border-radius: inherit;
  transition: width 0.25s;
}
.nav-link {
  display: flex;
  align-items: center;
  gap: 11px;
  min-height: 46px;
  padding: 11px 14px;
  color: #73716f;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
}
.nav-link:hover {
  background: #f5f4f1;
}
.nav-link.active {
  background: var(--accent-soft);
  color: var(--accent);
  font-weight: 600;
}
.page-heading {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  margin-bottom: 30px;
}
.page-heading h1 {
  font-size: 30px;
  line-height: 1.2;
}
.page-heading p {
  margin-top: 8px;
  color: var(--muted);
  line-height: 1.6;
}
.dialog {
  padding: 0;
  border: 1px solid var(--line);
  border-radius: 14px;
  width: min(520px, calc(100% - 32px));
  max-height: calc(100dvh - 40px);
  color: var(--ink);
  box-shadow: 0 30px 90px #15111133;
  margin: auto;
}
.dialog::backdrop {
  background: #24202177;
  backdrop-filter: blur(3px);
}
.tab {
  padding: 16px 3px;
  border-bottom: 2px solid transparent;
  color: var(--muted);
  font-weight: 500;
  white-space: nowrap;
}
.tab.active {
  color: var(--accent);
  border-bottom-color: var(--accent);
}
.task-card {
  background: white;
  border: 1px solid var(--line);
  border-radius: 9px;
  padding: 17px;
}
.task-card:hover {
  border-color: #cbbdc0;
}
.project-card {
  transition:
    border-color 0.18s,
    box-shadow 0.18s;
}
.project-card:hover {
  border-color: #cbbdc0;
  box-shadow: 0 5px 18px #33202806;
}
.hero-title {
  font-family: Georgia, "Times New Roman", serif;
  font-size: clamp(48px, 6.5vw, 88px);
  font-weight: 400;
  line-height: 1.03;
  letter-spacing: -0.055em;
}
.skip-link {
  position: fixed;
  left: 12px;
  top: -70px;
  z-index: 100;
  background: white;
  padding: 12px;
  border-radius: 8px;
}
.skip-link:focus {
  top: 12px;
}
@media (max-width: 639px) {
  .page-heading {
    align-items: flex-start;
    flex-direction: column;
    gap: 16px;
    margin-bottom: 24px;
  }
  .page-heading h1 {
    font-size: 26px;
  }
  .page-heading > .btn {
    width: 100%;
  }
}
```

---

### `package.json`

```json
{
  "name": "taskora",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "concurrently -k -n web,api \"next dev\" \"tsx watch server/src/server.ts\"",
    "build": "prisma generate && next build && tsc -p server/tsconfig.json",
    "start": "concurrently -k -n web,api \"next start\" \"node dist/server/server.js\"",
    "typecheck": "tsc --noEmit && tsc -p server/tsconfig.json --noEmit",
    "db:generate": "prisma generate",
    "db:migrate": "prisma migrate deploy",
    "db:local": "node scripts/local-db.mjs",
    "test": "tsx --test server/tests/api.test.ts",
    "postinstall": "prisma generate",
    "setup": "node scripts/setup-env.mjs",
    "test:e2e": "playwright test"
  },
  "dependencies": {
    "@prisma/client": "6.19.3",
    "bcrypt": "^6.0.0",
    "cookie-parser": "^1.4.7",
    "cors": "^2.8.5",
    "dotenv": "^17.2.3",
    "express": "^5.1.0",
    "express-rate-limit": "^8.2.1",
    "framer-motion": "^12.23.24",
    "helmet": "^8.1.0",
    "jsonwebtoken": "^9.0.2",
    "lucide-react": "^0.577.0",
    "next": "16.3.4",
    "react": "^19.2.0",
    "react-dom": "^19.2.0",
    "swr": "^2.5.1",
    "zod": "^4.1.12"
  },
  "devDependencies": {
    "@playwright/test": "^1.63.0",
    "@tailwindcss/postcss": "^4.1.17",
    "@types/bcrypt": "^6.0.0",
    "@types/cookie-parser": "^1.4.10",
    "@types/cors": "^2.8.19",
    "@types/express": "^5.0.5",
    "@types/jsonwebtoken": "^9.0.10",
    "@types/node": "^24.10.0",
    "@types/react": "^19.2.2",
    "@types/react-dom": "^19.2.2",
    "concurrently": "^9.2.1",
    "embedded-postgres": "18.4.0-beta.17",
    "prisma": "6.19.3",
    "tailwindcss": "^4.1.17",
    "tsx": "^4.20.6",
    "typescript": "^5.9.3"
  },
  "overrides": {
    "deepmerge-ts": "^8.0.0"
  }
}
```

---

### `tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": false,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "react-jsx",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./src/*"], "@data/*": ["./data/*"] }
  },
  "include": [
    "next-env.d.ts",
    "src/**/*.ts",
    "src/**/*.tsx",
    "data/**/*.ts",
    ".next/types/**/*.ts",
    ".next/dev/types/**/*.ts"
  ],
  "exclude": ["node_modules", "server", "dist"]
}
```

---

### `next.config.ts`

```typescript
import type { NextConfig } from "next";

const config: NextConfig = {
  poweredByHeader: false,
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${process.env.API_INTERNAL_URL || "http://127.0.0.1:4000"}/api/:path*`,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
    ];
  },
};

export default config;
```

---

### `Dockerfile`

```text
FROM node:24-bookworm-slim AS build
WORKDIR /app
RUN apt-get update && apt-get install -y --no-install-recommends openssl ca-certificates && rm -rf /var/lib/apt/lists/*
COPY package*.json ./
COPY prisma ./prisma
RUN npm ci
COPY . .
ARG API_INTERNAL_URL=http://api:4000
ENV API_INTERNAL_URL=${API_INTERNAL_URL}
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

FROM build AS web
ENV NODE_ENV=production
USER node
EXPOSE 3000
CMD ["node", "node_modules/next/dist/bin/next", "start"]

FROM build AS api
ENV NODE_ENV=production
USER node
EXPOSE 4000
CMD ["node", "dist/server/server.js"]
```

---

### `compose.yaml`

```yaml
services:
  db:
    image: postgres:17-alpine
    environment:
      POSTGRES_DB: taskora
      POSTGRES_USER: taskora
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD:?Set POSTGRES_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U taskora -d taskora"]
      interval: 5s
      timeout: 5s
      retries: 10
    restart: unless-stopped
  migrate:
    build:
      context: .
      target: api
    command: ["node", "node_modules/prisma/build/index.js", "migrate", "deploy"]
    environment:
      DATABASE_URL: postgresql://taskora:${POSTGRES_PASSWORD}@db:5432/taskora
    depends_on:
      db:
        condition: service_healthy
  api:
    build:
      context: .
      target: api
    environment:
      DATABASE_URL: postgresql://taskora:${POSTGRES_PASSWORD}@db:5432/taskora
      JWT_SECRET: ${JWT_SECRET:?Set JWT_SECRET}
      CLIENT_ORIGIN: ${CLIENT_ORIGIN:?Set the public HTTPS origin}
      NODE_ENV: production
      PORT: 4000
    depends_on:
      migrate:
        condition: service_completed_successfully
    restart: unless-stopped
  web:
    build:
      context: .
      target: web
      args:
        API_INTERNAL_URL: http://api:4000
    ports:
      - "127.0.0.1:3000:3000"
    depends_on:
      api:
        condition: service_started
    restart: unless-stopped
volumes:
  postgres_data:
```

---

### `scripts/setup-env.mjs`

```javascript
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
```

---

### `scripts/local-db.mjs`

```javascript
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
```

---

### `playwright.config.ts`

```typescript
import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: false,
  workers: 1,
  timeout: 90000, expect: { timeout: 15000 },
  use: {
    baseURL: "http://localhost:3000",
    browserName: "chromium",
    channel: process.platform === "win32" ? "msedge" : undefined,
    headless: true, actionTimeout: 15000,
    viewport: { width: 1440, height: 1000 },
    trace: "retain-on-failure"
  }
});
```

---

### `e2e/workspace.spec.ts`

```typescript
import "dotenv/config";
import { test, expect } from "@playwright/test";
import { randomUUID } from "node:crypto";
import { PrismaClient } from "@prisma/client";

test("register, collaborate, deliver and navigate responsively", async ({ page, request }) => {
  test.skip(process.env.NODE_ENV === "production", "Use a development database.");
  const prisma = new PrismaClient();
  const suffix = randomUUID();
  const email = `browser.${suffix}@example.test`;
  const teammateEmail = `teammate.${suffix}@example.test`;
  const password = `Taskora-${randomUUID()}`;
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  try {
    await page.goto("/");
    await expect(page.getByRole("heading", { name: "Keep every project moving." })).toBeVisible();
    await page.getByRole("link", { name: "Get Started" }).first().click();
    await page.getByLabel("Full Name", { exact: true }).fill("Browser Owner");
    await page.getByLabel("Email", { exact: true }).fill(email);
    await page.getByLabel("Password", { exact: true }).fill(password);
    await page.getByLabel("Confirm Password", { exact: true }).fill(password);
    await page.getByRole("button", { name: "Create account", exact: true }).click();
    await expect(page).toHaveURL(/\/dashboard$/);
    await page.reload();
    await expect(page.getByRole("heading", { name: "Welcome back, Browser." })).toBeVisible();
    await page.getByRole("button", { name: "New project", exact: true }).click();
    await page.getByLabel("Project name", { exact: true }).fill("Release workspace");
    await page.getByLabel("Description", { exact: false }).fill("A shared plan for a considered product launch.");
    await page.getByRole("button", { name: "Create project", exact: true }).click();
    await expect(page).toHaveURL(/\/projects\/[a-f0-9-]+$/);
    await expect(page.getByRole("heading", { name: "Release workspace", exact: true })).toBeVisible();
    const projectUrl = page.url().split("?")[0];
    await page.getByRole("button", { name: "Edit project", exact: true }).click();
    await page.getByLabel("Project name", { exact: true }).fill("Product launch");
    await page.getByRole("button", { name: "Save changes", exact: true }).click();
    await expect(page.getByRole("heading", { name: "Product launch", exact: true })).toBeVisible();
    const teammate = await request.post("/api/auth/register", { headers: { Origin: "http://localhost:3000" }, data: { name: "Browser Teammate", email: teammateEmail, password } });
    expect(teammate.status()).toBe(201);
    await page.getByRole("link", { name: "Members", exact: true }).click();
    await page.getByRole("button", { name: "Add member", exact: true }).click();
    await page.getByLabel("Email", { exact: true }).fill(teammateEmail);
    await page.getByRole("dialog").getByRole("button", { name: "Add member", exact: true }).click();
    await expect(page.getByText("Browser Teammate", { exact: true })).toBeVisible();
    await page.getByRole("link", { name: /^Tasks/ }).click();
    await page.getByRole("button", { name: "New task", exact: true }).click();
    await page.getByLabel("Task title", { exact: true }).fill("Ship the workspace");
    await page.getByLabel("Description", { exact: true }).fill("Connect the final pieces and prepare the release.");
    await page.getByLabel("Assignee", { exact: true }).selectOption({ label: "Browser Owner" });
    await page.getByRole("button", { name: "Create task", exact: true }).click();
    await expect(page.getByRole("button", { name: "Ship the workspace", exact: true })).toBeVisible();
    await page.screenshot({ path: "test-results/taskora-desktop.png", fullPage: true });
    await page.setViewportSize({ width: 820, height: 1180 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    await page.screenshot({ path: "test-results/taskora-tablet.png", fullPage: true });
    await page.setViewportSize({ width: 390, height: 844 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    await page.screenshot({ path: "test-results/taskora-mobile.png", fullPage: true });
    await page.getByRole("button", { name: "Open navigation" }).click();
    await page.getByRole("dialog").getByRole("link", { name: "My Tasks", exact: true }).click();
    await expect(page).toHaveURL(/\/my-tasks$/);
    await page.getByLabel("Status for Ship the workspace").selectOption("DONE");
    await expect(page.getByLabel("Status for Ship the workspace")).toHaveValue("DONE");
    await page.reload();
    await expect(page.getByLabel("Status for Ship the workspace")).toHaveValue("DONE");
    await page.getByRole("link", { name: /Ship the workspace/ }).click();
    await expect(page.getByRole("dialog", { name: "Edit task" })).toBeVisible();
    await page.getByLabel("Task title", { exact: true }).fill("Release the workspace");
    await page.getByLabel("Assignee", { exact: true }).selectOption({ label: "Browser Teammate" });
    await page.getByRole("button", { name: "Save changes", exact: true }).click();
    await page.getByRole("link", { name: "Overview", exact: true }).click();
    await expect(page.getByRole("progressbar", { name: "Project completion" })).toHaveAttribute("aria-valuenow", "100");
    await page.getByRole("link", { name: "Members", exact: true }).click();
    await page.getByRole("button", { name: "Remove Browser Teammate" }).click();
    await page.getByRole("button", { name: "Remove member", exact: true }).click();
    await expect(page.getByText("Browser Teammate", { exact: true })).toHaveCount(0);
    await page.getByRole("link", { name: /^Tasks/ }).click();
    await page.getByRole("button", { name: "Done", exact: true }).click();
    await expect(page.getByText("Unassigned", { exact: true })).toBeVisible();
    await page.getByRole("button", { name: "Delete Release the workspace", exact: true }).click();
    await page.getByRole("button", { name: "Delete", exact: true }).click();
    await expect(page.getByRole("button", { name: "Release the workspace", exact: true })).toHaveCount(0);
    await page.goto(projectUrl);
    await expect(page.getByRole("progressbar", { name: "Project completion" })).toHaveAttribute("aria-valuenow", "0");
    await page.getByRole("button", { name: "Delete project", exact: true }).click();
    await page.getByRole("button", { name: "Delete", exact: true }).click();
    await expect(page).toHaveURL(/\/projects$/);
    await page.getByRole("button", { name: "Open navigation" }).click();
    await page.getByRole("dialog").getByRole("button", { name: "Sign out", exact: true }).click();
    await expect(page).toHaveURL(/\/login$/);
    await page.getByLabel("Email", { exact: true }).fill(email);
    await page.getByLabel("Password", { exact: true }).fill(password);
    await page.getByRole("button", { name: "Sign In", exact: true }).click();
    await expect(page).toHaveURL(/\/dashboard$/);
    expect(errors).toEqual([]);
  } finally {
    const users = await prisma.user.findMany({ where: { email: { in: [email, teammateEmail] } }, select: { id: true } });
    await prisma.project.deleteMany({ where: { ownerId: { in: users.map(user => user.id) } } });
    await prisma.user.deleteMany({ where: { id: { in: users.map(user => user.id) } } });
    await prisma.$disconnect();
  }
});
```

---

### `.env.example`

```text
DATABASE_URL=postgresql://taskora:replace-with-local-password@127.0.0.1:5433/taskora
JWT_SECRET=replace-with-at-least-32-random-characters
CLIENT_ORIGIN=http://localhost:3000
API_INTERNAL_URL=http://127.0.0.1:4000
PORT=4000
NODE_ENV=development
```

---

### `README.md`

```markdown
# Taskora

Plan. Assign. Deliver.

A complete project workspace built with Next.js, React, TypeScript, Express, Prisma, and PostgreSQL.

## Run locally

Requires Node.js 24 and npm. The optional local database command runs real PostgreSQL and stores its files in the ignored `.local/postgres` directory.

```sh
npm install
npm run setup
npm run db:local
```

Keep that database process running. In a second terminal:

```sh
npm run db:migrate
npm run dev
```

Open [Taskora](http://localhost:3000). Register your own account. To collaborate, register another account in a separate browser session and add its email from the project's Members section.

For an existing PostgreSQL instance, set `DATABASE_URL` in `.env` and skip `db:local`. The setup script creates random local credentials only when `.env` does not exist. It never overwrites existing configuration.

## Application

- Landing, registration, login, persistent session, and logout.
- Dashboard with real project, task, member, and progress data.
- Project creation, editing, deletion, and search.
- Project overview, task board, and member management.
- Task creation, editing, assignment, status changes, and deletion.
- My Tasks scoped by the authenticated user, with status filters and project links.
- Responsive sidebar, mobile navigation, keyboard-accessible dialogs, and reduced motion.

Owners are also project members. Only owners can edit or delete a project or change its membership. All project members can create, update, and delete tasks. Tasks can be assigned only to project members. Removing a member unassigns their tasks atomically. Progress is derived from completed tasks; an empty project is 0%.

## Architecture

`src/app` owns pages; `src/components` owns meaningful UI boundaries. `src/services/api` owns HTTP communication. SWR caches server records and revalidates them after mutations and on focus. Forms and view preferences use local React state.

`server/src/app.ts` configures Express. Domain routers call Prisma directly. All protected queries scope records to the authenticated user's membership. Project write locks serialize membership and task changes to preserve assignment integrity.

`data/` holds brand, navigation, status labels, and explicitly illustrative landing content. `src/styles/` holds Tailwind, reusable styles, tokens, and reduced-motion rules. Runtime records exist only in PostgreSQL.

JWTs expire after seven days and are delivered in HttpOnly, SameSite=Lax cookies; production cookies also require Secure. Passwords use bcrypt with cost 12. The API validates input and origin, limits authentication attempts, restricts CORS, and returns consistent safe errors. Password hashes never leave the backend.

The browser uses same-origin `/api` URLs. Next.js forwards those requests to Express using `API_INTERNAL_URL`; it owns no business API implementation. Write requests must carry the configured `Origin`, including when using an API client.

## Verification

```sh
npm run typecheck
npm test
npm run build
```

The integration test uses real PostgreSQL, creates uniquely named accounts, checks the full lifecycle and authorization boundaries, and removes only its own records. Run it against a development database, never production.

With the local application running, `npm run test:e2e` checks the connected UI lifecycle and desktop, tablet, and mobile layouts. It uses Microsoft Edge on Windows. On Linux or macOS, first run `npx playwright install chromium`.

## Production

Set `NODE_ENV=production`, a PostgreSQL `DATABASE_URL`, a cryptographically random `JWT_SECRET` of at least 32 characters, and an exact HTTPS `CLIENT_ORIGIN` without a trailing slash. Set `API_INTERNAL_URL` before building to the Express service's internal origin. Next rewrites are resolved during the build.

```sh
npm ci
npm run db:migrate
npm run build
npm start
```

Use a process supervisor and terminate HTTPS at a reverse proxy in front of port 3000. Keep the Express port private. Forward the original Origin header. The browser-facing application and API share one origin, so secure cookies do not depend on third-party cookie support.

The included Docker Compose configuration builds web and API services, runs migrations before startup, and persists PostgreSQL in a named volume. Set `POSTGRES_PASSWORD` to a random URL-safe value, `JWT_SECRET`, and the public HTTPS `CLIENT_ORIGIN` in the deployment environment, then run:

```sh
docker compose up --build -d
```

Compose binds the web service to loopback port 3000 for your HTTPS reverse proxy. Configure database backups at the infrastructure layer. The local embedded PostgreSQL helper is development tooling only.

Framer Motion is used for dialogs and task transitions. GSAP is omitted because this focused interface does not need coordinated marketing animation.
```

---

