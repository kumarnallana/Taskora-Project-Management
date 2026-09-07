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
