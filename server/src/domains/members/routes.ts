import { Router } from "express";
import { z } from "zod";
import { prisma, safeUser } from "../../db/prisma";
import { emailSchema } from "../auth/routes";
import { lockProject, requireProject, routeId } from "../projects/access";
import { AppError } from "../../middleware/error";

export const memberRouter = Router({ mergeParams: true });
memberRouter.get("/", async (req, res) => {
  const projectId = routeId.parse(req.params.projectId);
  await requireProject(prisma, projectId, res.locals.user.id);
  res.json(await prisma.projectMember.findMany({ where: { projectId, project: { OR: [{ ownerId: res.locals.user.id }, { members: { some: { userId: res.locals.user.id } } }] } }, select: { createdAt: true, user: { select: safeUser } }, orderBy: { createdAt: "asc" } }));
});

memberRouter.post("/", async (req, res) => {
  const projectId = routeId.parse(req.params.projectId);
  const { email } = z.object({ email: emailSchema }).strict().parse(req.body);
  const member = await prisma.$transaction(async db => {
    await lockProject(db, projectId);
    await requireProject(db, projectId, res.locals.user.id, true);
    const user = await db.user.findUnique({ where: { email }, select: safeUser });
    if (!user) throw new AppError(404, "USER_NOT_FOUND", "No registered account uses this email.");
    if (await db.projectMember.findUnique({ where: { projectId_userId: { projectId, userId: user.id } } })) throw new AppError(409, "ALREADY_MEMBER", "This person is already a project member.");
    return db.projectMember.create({ data: { projectId, userId: user.id }, select: { createdAt: true, user: { select: safeUser } } });
  });
  res.status(201).json(member);
});

memberRouter.delete("/:userId", async (req, res) => {
  const projectId = routeId.parse(req.params.projectId);
  const userId = routeId.parse(req.params.userId);
  await prisma.$transaction(async db => {
    await lockProject(db, projectId);
    const project = await requireProject(db, projectId, res.locals.user.id, true);
    if (project.ownerId === userId) throw new AppError(400, "OWNER_MEMBERSHIP", "The project owner cannot be removed.");
    await db.task.updateMany({ where: { projectId, assigneeId: userId }, data: { assigneeId: null } });
    await db.projectMember.delete({ where: { projectId_userId: { projectId, userId } } });
  });
  res.status(204).end();
});
