#!/usr/bin/env node
/**
 * Fail if NEXT_PUBLIC_* env usage looks like a secret (keys, tokens, passwords).
 * Public origins (SITE_URL / API_URL) are allowed.
 * Scans process.env references and .env* assignments — not prose/docs warnings.
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative, resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");

const ALLOWED_NEXT_PUBLIC = new Set([
  "NEXT_PUBLIC_SITE_URL",
  "NEXT_PUBLIC_API_URL",
]);

const SECRETISH_NAME =
  /NEXT_PUBLIC_(?:.*(?:SECRET|TOKEN|PASSWORD|PASS|KEY|PRIVATE|CREDENTIAL|AUTH|JWT|SMTP|WEBHOOK|API_KEY|ACCESS).*)/i;

const SECRETISH_VALUE =
  /(?:sk-|pk_live_|pk_test_|ghp_|gho_|xox[baprs]-|AIza|Bearer\s+[A-Za-z0-9._-]{20,}|-----BEGIN)/i;

const CODE_EXT = new Set([".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs"]);

const SKIP_DIRS = new Set([
  "node_modules",
  ".next",
  "docs",
  ".git",
  "coverage",
  "p4-screenshots",
]);

/** @type {string[]} */
const failures = [];
/** @type {number} */
let filesScanned = 0;

function shouldSkip(rel) {
  const parts = rel.split(/[/\\]/);
  return parts.some((p) => SKIP_DIRS.has(p));
}

function walk(dir) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    const rel = relative(root, full);
    if (shouldSkip(rel)) continue;
    const st = statSync(full);
    if (st.isDirectory()) {
      walk(full);
      continue;
    }
    const lower = name.toLowerCase();
    const ext = lower.includes(".") ? `.${lower.split(".").pop()}` : "";
    const isEnv = lower === ".env" || lower.startsWith(".env");
    if (!isEnv && !CODE_EXT.has(ext)) continue;
    scanFile(full, rel, isEnv);
  }
}

function scanFile(full, rel, isEnv) {
  let text;
  try {
    text = readFileSync(full, "utf8");
  } catch {
    return;
  }
  filesScanned += 1;

  if (isEnv) {
    for (const line of text.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const m = trimmed.match(/^(NEXT_PUBLIC_[A-Z0-9_]+)\s*=\s*(.*)$/);
      if (!m) continue;
      const [, name, value] = m;
      if (ALLOWED_NEXT_PUBLIC.has(name)) {
        if (SECRETISH_VALUE.test(value)) {
          failures.push(`${rel}: secret-like value for allowed ${name}`);
        }
        continue;
      }
      if (SECRETISH_NAME.test(name)) {
        failures.push(`${rel}: forbidden NEXT_PUBLIC assignment ${name}`);
      } else {
        failures.push(`${rel}: unexpected NEXT_PUBLIC_* ${name} (only SITE_URL and API_URL are allowed)`);
      }
    }
    return;
  }

  // process.env.NEXT_PUBLIC_* or process.env["NEXT_PUBLIC_*"]
  const envRef =
    /process\.env(?:\.|\[(?:'|"))(NEXT_PUBLIC_[A-Z0-9_]+)(?:'|")?\]?/g;
  let match;
  while ((match = envRef.exec(text))) {
    const name = match[1];
    if (ALLOWED_NEXT_PUBLIC.has(name)) continue;
    if (SECRETISH_NAME.test(name)) {
      failures.push(`${rel}: forbidden process.env.${name}`);
    } else {
      failures.push(`${rel}: unexpected process.env.${name} (only SITE_URL and API_URL are allowed)`);
    }
  }
}

walk(root);

const unique = [...new Set(failures)];
console.log(`Secret scan: ${filesScanned} files. Allowed NEXT_PUBLIC_*: ${[...ALLOWED_NEXT_PUBLIC].join(", ")}`);
if (unique.length) {
  for (const f of unique) console.error(`FAIL ${f}`);
  process.exitCode = 1;
} else {
  console.log("Secret scan passed.");
}
