import type { TourDay } from "@/lib/tour-content";

export type TourDayForm = {
  title: string; subtitle: string; dayLabel: string; paragraphs: string;
  overnight: string; notes: string; stages: { label: string; body: string }[];
};
export function dayToForm(raw: Record<string, unknown>): TourDayForm {
  return {
    title: String(raw.title ?? ""), subtitle: String(raw.subtitle ?? ""),
    dayLabel: String(raw.dayLabel ?? ""),
    paragraphs: Array.isArray(raw.paragraphs) ? raw.paragraphs.join("\n\n") : String(raw.paragraphs ?? ""),
    overnight: String(raw.overnight ?? ""),
    notes: Array.isArray(raw.notes) ? raw.notes.join("\n") : String(raw.notes ?? ""),
    stages: Array.isArray(raw.stages)
      ? raw.stages.map((s) => ({ label: String(s.label ?? ""), body: String(s.body ?? "") }))
      : [],
  };
}
export function dayToDb(day: TourDayForm): TourDay {
  return {
    title: day.title, subtitle: day.subtitle,
    dayLabel: day.dayLabel || undefined,
    paragraphs: day.paragraphs.split(/\n\n+/).map((s) => s.trim()).filter(Boolean),
    overnight: day.overnight || undefined,
    notes: day.notes.trim() ? day.notes.split(/\n+/).map((s) => s.trim()).filter(Boolean) : undefined,
    stages: day.stages.length ? day.stages : undefined,
  };
}
