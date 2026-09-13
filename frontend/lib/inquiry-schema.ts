import { z } from "zod";
import { planningOptions } from "@/lib/experiences";

export const GROUP_IDS = ["solo", "two", "three-four", "five-ten", "more"] as const;
export const DURATION_IDS = ["1", "2", "3", "4", "5", "6", "10", "unsure"] as const;
export const INTEREST_IDS = [
  "scenery",
  "wildlife",
  "photography",
  "ras-dashen",
  "heritage",
  "food",
  "festivals",
  "running",
  "stay",
  "everything",
] as const;
export const ACCOMMODATION_IDS = ["high", "mid", "budget", "camping", "mix"] as const;

const EXPERIENCE_IDS = planningOptions.map((option) => option.id) as [
  (typeof planningOptions)[number]["id"],
  ...(typeof planningOptions)[number]["id"][],
];

const emptyOr = <T extends readonly [string, ...string[]]>(ids: T) =>
  z.enum(["", ...ids] as unknown as [string, ...string[]]);

function optionalText(max: number) {
  return z.preprocess((value) => {
    if (value == null) return "";
    return String(value).slice(0, max);
  }, z.string().max(max));
}

/** Shared client/server schema for planner inquiry payloads (stable option IDs). */
export const inquirySchema = z.object({
  name: z.preprocess(
    (value) => (value == null ? "" : String(value).trim().slice(0, 120)),
    z.string().min(1, "Please include a valid name and email.").max(120),
  ),
  email: z.preprocess(
    (value) => (value == null ? "" : String(value).trim().slice(0, 200)),
    z.string().email("Please include a valid name and email.").max(200),
  ),
  dates: optionalText(200),
  group: z.preprocess(
    (value) => (value == null ? "" : String(value)),
    emptyOr(GROUP_IDS),
  ),
  duration: z.preprocess(
    (value) => (value == null ? "" : String(value)),
    emptyOr(DURATION_IDS),
  ),
  interests: z.preprocess(
    (value) => (value == null ? "" : String(value)),
    emptyOr(INTEREST_IDS),
  ),
  experience: z.preprocess(
    (value) => (value == null ? "" : String(value)),
    emptyOr(EXPERIENCE_IDS),
  ),
  accommodation: z.preprocess(
    (value) => (value == null ? "" : String(value)),
    emptyOr(ACCOMMODATION_IDS),
  ),
  gondarNights: optionalText(8),
  simienNights: optionalText(8),
  budget: optionalText(200),
  message: optionalText(3000),
  /** Honeypot — must stay empty. Bots that fill it are dropped silently. */
  company: optionalText(200),
});

export type InquiryInput = z.infer<typeof inquirySchema>;

export function parseInquiry(data: unknown) {
  return inquirySchema.safeParse(data);
}

export function isHoneypotFilled(payload: Pick<InquiryInput, "company">) {
  return Boolean(payload.company.trim());
}
