import type { Request, Response, NextFunction } from "express";
import { randomUUID } from "node:crypto";
import { logger } from "../config/pino.js";

declare global {
  namespace Express {
    interface Request {
      requestId: string;
    }
  }
}

export function requestId(req: Request, _res: Response, next: NextFunction) {
  req.requestId = randomUUID();
  next();
}

export const logRequest = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - start;
    logger.info(
      {
        requestId: req.requestId,
        method: req.method,
        route: req.originalUrl,
        status: res.statusCode,
        duration,
        ip: req.ip,
      },
      "request completed",
    );
  });

  next();
};
