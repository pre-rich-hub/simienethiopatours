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
  STORAGE_DRIVER: z.enum(["local", "database", "cloudinary"]).default("local"),

  // AI assistant
  ASSISTANT_ENABLED: z.preprocess(envBoolean, z.boolean()).default(false),
  ASSISTANT_PROVIDER: z.enum(["openai", "gemini", "groq"]).default("gemini"),
  OPENAI_API_KEY: z.string().optional().default(""),
  OPENAI_BASE_URL: z.string().optional().default(""),
  GEMINI_API_KEY: z.string().optional().default(""),
  GROQ_API_KEY: z.string().optional().default(""),
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

// On Vercel the serverless disk is ephemeral: files written to the local
// filesystem vanish between requests and are invisible across instances.
// Fall back to database storage (Postgres BYTEA) unless a driver was
// explicitly chosen, so uploads work without extra configuration.
const isOnVercel = Boolean(process.env.VERCEL);
const storageDriver =
  isOnVercel && (!rawEnv.STORAGE_DRIVER || rawEnv.STORAGE_DRIVER === "local")
    ? "database"
    : rawEnv.STORAGE_DRIVER;

const parsed = {
  ...rawEnv,
  STORAGE_DRIVER: storageDriver,
  ASSISTANT_IP_HASH_SALT: rawEnv.ASSISTANT_IP_HASH_SALT || rawEnv.JWT_SECRET,
};

// Boot gates (not fatal): half-configured optional features must not take
// down the whole API. If a feature flag is on but its secrets are missing,
// warn loudly and disable the feature; the rest of the API keeps serving.
if (parsed.EMAIL_ENABLED && (!parsed.SMTP_FROM || !parsed.ADMIN_EMAIL)) {
  console.warn(
    "[env] EMAIL_ENABLED is true but SMTP_FROM or ADMIN_EMAIL is not configured. Email dispatch is disabled until they are set.",
  );
  parsed.EMAIL_ENABLED = false;
}

if (parsed.ASSISTANT_ENABLED) {
  if (parsed.ASSISTANT_PROVIDER === "openai" && !parsed.OPENAI_API_KEY) {
    console.warn("[env] ASSISTANT_ENABLED is true but OPENAI_API_KEY is not configured. The assistant is disabled until a key is set.");
    parsed.ASSISTANT_ENABLED = false;
  }
  if (parsed.ASSISTANT_PROVIDER === "gemini" && !parsed.GEMINI_API_KEY) {
    console.warn("[env] ASSISTANT_ENABLED is true but GEMINI_API_KEY is not configured. The assistant is disabled until a key is set.");
    parsed.ASSISTANT_ENABLED = false;
  }
  if (parsed.ASSISTANT_PROVIDER === "groq" && !parsed.GROQ_API_KEY) {
    console.warn("[env] ASSISTANT_ENABLED is true but GROQ_API_KEY is not configured. The assistant is disabled until a key is set.");
    parsed.ASSISTANT_ENABLED = false;
  }
}

// Boot warning (not fatal): production local uploads need a public base URL.
// Keep the API alive so health, auth, catalogue and assistant work even when
// media storage is misconfigured; upload attempts then fail with a clear error.
if (parsed.NODE_ENV === "production" && parsed.STORAGE_DRIVER === "local" && !parsed.PUBLIC_FILE_BASE_URL) {
  console.warn(
    "[env] Production uploads use the local driver but PUBLIC_FILE_BASE_URL is not set. Uploaded files will not be served publicly; configure PUBLIC_FILE_BASE_URL or use STORAGE_DRIVER=database (automatic on Vercel).",
  );
}

export const env = parsed;
export const isProduction = parsed.NODE_ENV === "production";
