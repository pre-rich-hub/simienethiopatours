import pino from "pino";
import { env, isProduction } from "./env.js";

export const logger = pino({
  level: isProduction ? "info" : "debug",
  transport: isProduction
    ? undefined
    : {
        target: "pino-pretty",
        options: { colorize: true, translateTime: "HH:MM:ss.l" },
      },
  redact: {
    paths: [
      "req.headers.authorization",
      "req.headers.cookie",
      "body.password",
      "body.message",
      "body.content",
      "messages[*].content",
    ],
    censor: "[REDACTED]",
  },
});
