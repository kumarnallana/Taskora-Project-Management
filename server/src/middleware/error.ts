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
