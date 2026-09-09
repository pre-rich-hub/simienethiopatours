import type { Response } from "express";

export type ApiErrorDetail = {
  path: string;
  message: string;
};

export function ok(res: Response, data: unknown, message = "Success") {
  return res.json({ status: "ok", message, data });
}

export function fail(
  res: Response,
  message: string,
  errors: ApiErrorDetail[] = [],
  status = 400,
) {
  return res.status(status).json({ status: "error", message, errors });
}
