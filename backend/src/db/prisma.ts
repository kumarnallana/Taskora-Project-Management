import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();
export const safeUser = { id: true, name: true, email: true, avatarUrl: true } as const;
