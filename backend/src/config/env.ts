import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

function envBoolean(value: unknown): boolean {
  if (value === true || value === 1) return true;
  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    return normalized === "1" || normalized === "true" || normalized === "on";
  }
  return Boolean(value);
}

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().positive().default(5000),
  DATABASE_URL: z.string().min(1),
  DIRECT_URL: z.string().optional().default(""),
  FRONTEND_ORIGIN: z.string().default("http://localhost:3000"),
  JWT_SECRET: z.string().min(16),
  JWT_EXPIRES_IN: z.string().default("7d"),
  AUTH_COOKIE_NAME: z.string().default("admin_session"),
  COOKIE_SECURE: z.preprocess(envBoolean, z.boolean()).default(false),

  // Email
  SMTP_HOST: z.string().optional().default(""),
  SMTP_PORT: z.coerce.number().int().positive().default(587),
  SMTP_USER: z.string().optional().default(""),
  SMTP_PASS: z.string().optional().default(""),
  SMTP_FROM: z.string().optional().default(""),
  EMAIL_PROVIDER: z.enum(["smtp", "resend"]).default("smtp"),
  RESEND_API_KEY: z.string().optional().default(""),
  ADMIN_EMAIL: z.string().optional().default(""),
  ADMIN_PASSWORD: z.string().optional().default(""),
  EMAIL_ENABLED: z.preprocess(envBoolean, z.boolean()).default(false),

  // Privacy retention
  CONTACT_RETENTION_DAYS: z.coerce.number().int().positive().default(730),
  ASSISTANT_RETENTION_DAYS: z.coerce.number().int().positive().default(30),

  // File uploads
  UPLOAD_ROOT: z.string().default("uploads"),
  PUBLIC_FILE_BASE_URL: z.string().optional().default(""),
  MAX_UPLOAD_MB: z.coerce.number().positive().default(4),
  STORAGE_DRIVER: z.enum(["local", "cloudinary"]).default("local"),

  // AI assistant
  ASSISTANT_ENABLED: z.preprocess(envBoolean, z.boolean()).default(false),
  ASSISTANT_PROVIDER: z.enum(["openai", "gemini"]).default("gemini"),
  OPENAI_API_KEY: z.string().optional().default(""),
  GEMINI_API_KEY: z.string().optional().default(""),
  ASSISTANT_MODEL: z.string().default("gemini-3.6-flash"),
  ASSISTANT_MAX_MESSAGES: z.coerce.number().int().positive().default(30),
  ASSISTANT_MAX_OUTPUT_TOKENS: z.coerce.number().int().positive().default(1000),
  ASSISTANT_MAX_HISTORY_MESSAGES: z.coerce.number().int().positive().default(10),
  ASSISTANT_MAX_CONTEXT_CHARS: z.coerce.number().int().positive().default(40000),
  ASSISTANT_MAX_DAILY_TOKENS: z.coerce.number().int().positive().default(200000),
  ASSISTANT_MAX_SESSION_TOKENS: z.coerce.number().int().positive().default(20000),
  ASSISTANT_STREAM: z.preprocess(envBoolean, z.boolean()).default(true),
  ASSISTANT_STREAM_TIMEOUT_MS: z.coerce.number().int().positive().default(45000),
  ASSISTANT_CONTEXT_TTL_MS: z.coerce.number().int().positive().default(300000),
  ASSISTANT_IP_HASH_SALT: z.string().optional().default(""),
});

const rawEnv = envSchema.parse(process.env);

const parsed = {
  ...rawEnv,
  ASSISTANT_IP_HASH_SALT: rawEnv.ASSISTANT_IP_HASH_SALT || rawEnv.JWT_SECRET,
};

// Boot check: email must be fully configured before enabled
if (parsed.EMAIL_ENABLED) {
  if (!parsed.SMTP_FROM) {
    throw new Error("EMAIL_ENABLED is true but SMTP_FROM is not configured.");
  }
  if (!parsed.ADMIN_EMAIL) {
    throw new Error("EMAIL_ENABLED is true but ADMIN_EMAIL is not configured.");
  }
}

// Boot check: assistant provider key must be set when enabled
if (parsed.ASSISTANT_ENABLED) {
  if (parsed.ASSISTANT_PROVIDER === "openai" && !parsed.OPENAI_API_KEY) {
    throw new Error("ASSISTANT_ENABLED is true but OPENAI_API_KEY is not configured.");
  }
  if (parsed.ASSISTANT_PROVIDER === "gemini" && !parsed.GEMINI_API_KEY) {
    throw new Error("ASSISTANT_ENABLED is true but GEMINI_API_KEY is not configured.");
  }
}

if (parsed.NODE_ENV === "production" && parsed.STORAGE_DRIVER === "local" && !parsed.PUBLIC_FILE_BASE_URL) {
  throw new Error("Production file uploads require a durable public storage URL; configure STORAGE_DRIVER or PUBLIC_FILE_BASE_URL.");
}

export const env = parsed;
export const isProduction = parsed.NODE_ENV === "production";
