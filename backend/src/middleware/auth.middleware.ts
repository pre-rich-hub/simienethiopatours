import type { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import type { SignOptions } from "jsonwebtoken";
import { env, isProduction } from "../config/env.js";
import { prisma } from "../config/database.js";
import { HttpError } from "./error.middleware.js";

type AuthPayload = {
  sub: string;
  version: number;
};

declare global {
  namespace Express {
    interface Request {
      admin?: {
        id: number;
        email: string | null;
        name: string | null;
      };
    }
  }
}

export function signAdminToken(adminId: number, tokenVersion = 0) {
  const options: SignOptions = {
    expiresIn: env.JWT_EXPIRES_IN as SignOptions["expiresIn"],
  };
  return jwt.sign(
    { sub: String(adminId), version: tokenVersion },
    env.JWT_SECRET,
    options,
  );
}

export const authCookieOptions = {
  httpOnly: true,
  secure: env.COOKIE_SECURE || isProduction,
  sameSite: "lax" as const,
  path: "/",
};

export const requireAdminAuth: RequestHandler = async (req, _res, next) => {
  try {
    const token = req.cookies?.[env.AUTH_COOKIE_NAME];
    if (!token) throw new HttpError(401, "Authentication required");

    const payload = jwt.verify(token, env.JWT_SECRET) as AuthPayload;
    const adminId = Number(payload.sub);
    if (!Number.isInteger(adminId)) throw new HttpError(401, "Invalid session");

    const admin = await prisma.admin.findUnique({
      where: { id: adminId },
      select: { id: true, email: true, name: true, tokenVersion: true },
    });

    if (!admin) throw new HttpError(401, "Invalid session");
    if (payload.version !== admin.tokenVersion) {
      throw new HttpError(401, "Invalid session");
    }

    req.admin = { id: admin.id, email: admin.email, name: admin.name };
    next();
  } catch (err) {
    next(err instanceof HttpError ? err : new HttpError(401, "Invalid session"));
  }
};