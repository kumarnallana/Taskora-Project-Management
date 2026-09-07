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
    description: z.string().trim().max(4000).optional(),
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
      const inProgress = tasks.filter(
        (task) => task.status === "IN_PROGRESS",
      ).length;
      return {
        ...project,
        memberIds: members.map((member) => member.userId),
        memberCount: members.length,
        taskCount: tasks.length,
        completedTaskCount: completed,
        inProgressTaskCount: inProgress,
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
