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
    description: z.string().trim().max(4000).optional(),
    status: z.enum(["TODO", "IN_PROGRESS", "DONE"]).optional(),
    assigneeId: routeId.nullable().optional(),
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
