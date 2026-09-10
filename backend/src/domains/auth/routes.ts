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
    .json({ ...user, token });
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
    .json({ id: user.id, name: user.name, email: user.email, token });
});

authRouter.post("/logout", (_req, res) => {
  res.clearCookie(cookieName, cookieOptions).status(204).end();
});
authRouter.get("/me", authenticate, (_req, res) => {
  res.json(res.locals.user);
});

const profileUpdateSchema = z
  .object({
    name: z.string().trim().min(2).max(80).optional(),
    email: emailSchema.optional(),
    password: passwordSchema.optional(),
    avatarUrl: z.string().trim().max(2000).optional().nullable(),
  })
  .strict()
  .refine(
    (data) => Object.keys(data).length > 0,
    "Provide at least one field to update.",
  );

authRouter.patch("/profile", authenticate, async (req, res) => {
  const currentUserId = res.locals.user.id;
  const input = profileUpdateSchema.parse(req.body);

  if (input.email) {
    const existing = await prisma.user.findFirst({
      where: { email: input.email, NOT: { id: currentUserId } },
      select: { id: true },
    });
    if (existing) {
      throw new AppError(
        409,
        "EMAIL_EXISTS",
        "An account with this email already exists.",
      );
    }
  }

  const updateData: {
    name?: string;
    email?: string;
    avatarUrl?: string | null;
    passwordHash?: string;
  } = {};

  if (input.name) updateData.name = input.name;
  if (input.email) updateData.email = input.email;
  if (input.avatarUrl !== undefined) updateData.avatarUrl = input.avatarUrl || "";
  if (input.password) {
    updateData.passwordHash = await bcrypt.hash(input.password, 12);
  }

  const updatedUser = await prisma.user.update({
    where: { id: currentUserId },
    data: updateData,
    select: safeUser,
  });

  res.json(updatedUser);
});
