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
