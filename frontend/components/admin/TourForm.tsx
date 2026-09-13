"use client";

import { type FormEvent, type ReactNode, useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { adminMutate, adminRequestClient } from "@/lib/admin/client";
import { cn } from "@/lib/utils";
import {
  AdminButton, AdminField, AdminInput, AdminTextarea, AdminSelect,
  AdminToggle, AdminNotice, AdminAddRow, AdminRepeaterItem, Plus, Trash2,
  ChevronUp, ChevronDown,
  adminFormSection, adminFormGrid, adminFormTitle, adminFormDesc, adminDivider,
  adminCheckGrid, adminCheckbox, adminCheckboxChecked, adminRepeater,
  adminImagePreview,
} from "@/components/admin/ui";
import { dayToForm, dayToDb, type TourDayForm } from "@/lib/admin/tour-day-form";
import { useFilePreview } from "@/components/admin/useFilePreview";

/* ── Types ────────────────────────────────────────────────────────── */

type ItineraryDay = TourDayForm;

type Fact = { label: string; value: string };
type TitleBody = { title: string; body: string };
type RelatedItem = { title: string; body: string; href: string };

type Form = {
  tourTitle: string;
  tourDestination: string;
  tourDestinations: number[];
  tourCategories: number[];
  adultPrice: string;
  childPrice: string;
  tourDiscount: string;
  tourRating: string;
  tourReviews: string;
  duration: string;
  style: string;
  difficulty: string;
  journeyType: string;
  editorialStatus: string;
  editorialSourceNotes: string;
  fit: string;
  tourOverview: string;
  summary: string;
  itineraryIntro: string;
  itineraryNotes: string[];
  inquiry: string;
  notice: string;
  heroTitle: string;
  heroAccent: string;
  imageAlt: string;
  isFeatured: boolean;
  isPublished: boolean;
  sortOrder: string;
  tourImageFile: File | null;
  image: string;
  route: string[];
  facts: Fact[];
  introduction: string[];
  highlights: TitleBody[];
  preparation: string[];
  related: RelatedItem[];
  tourIncluded: string[];
  tourExcluded: string[];
  itinerary: ItineraryDay[];
  tourMap: string;
};

const EMPTY_DAY: ItineraryDay = {
  title: "", subtitle: "", dayLabel: "", paragraphs: "", overnight: "", notes: "", stages: [],
};

const BLANK: Form = {
  tourTitle: "", tourDestination: "", tourDestinations: [], tourCategories: [],
  adultPrice: "", childPrice: "", tourDiscount: "", tourRating: "", tourReviews: "",
  duration: "", style: "", difficulty: "", journeyType: "core-trek", editorialStatus: "draft", editorialSourceNotes: "", fit: "", tourOverview: "", inquiry: "", notice: "",
  heroTitle: "", heroAccent: "", imageAlt: "", isFeatured: false, isPublished: false,
  sortOrder: "0", tourImageFile: null, image: "", route: [], facts: [], introduction: [],
  highlights: [], preparation: [], related: [], tourIncluded: [], tourExcluded: [],
  itinerary: [], tourMap: "", summary: "", itineraryIntro: "", itineraryNotes: [],
};

/* ── Helpers ──────────────────────────────────────────────────────── */

function parseJson<T>(raw: string | null | undefined, fallback: T): T {
  if (!raw) return fallback;
  try {
    const v = JSON.parse(raw);
    return Array.isArray(v) || (typeof v === "object" && v !== null) ? v : fallback;
  } catch {
    return fallback;
  }
}

function strToList(raw: string | null | undefined): string[] {
  if (!raw) return [];
  try {
    const v = JSON.parse(raw);
    return Array.isArray(v) ? v : [];
  } catch {
    return [];
  }
}

/* ── List Repeater ────────────────────────────────────────────────── */

function ListRepeater({
  value, onChange, placeholder,
}: {
  value: string[];
  onChange: (v: string[]) => void;
  placeholder?: string;
}) {
  return (
    <div className={adminRepeater}>
      {value.map((item, i) => (
        <div key={i} className="grid grid-cols-[1fr_auto] items-start gap-2">
          <AdminInput
            value={item}
            placeholder={placeholder}
            onChange={(e) => { const next = [...value]; next[i] = e.target.value; onChange(next); }}
          />
          <div className="flex gap-1">
            {i > 0 && (
              <AdminButton variant="secondary" size="small" onClick={() => { const next = [...value]; [next[i - 1], next[i]] = [next[i], next[i - 1]]; onChange(next); }}>
                <ChevronUp size={14} />
              </AdminButton>
            )}
            {i < value.length - 1 && (
              <AdminButton variant="secondary" size="small" onClick={() => { const next = [...value]; [next[i], next[i + 1]] = [next[i + 1], next[i]]; onChange(next); }}>
                <ChevronDown size={14} />
              </AdminButton>
            )}
            <AdminButton variant="danger" size="small" onClick={() => onChange(value.filter((_, j) => j !== i))}>
              <Trash2 size={14} />
            </AdminButton>
          </div>
        </div>
      ))}
      <AdminAddRow onAdd={() => onChange([...value, ""])} />
    </div>
  );
}

/* ── Fact Repeater ────────────────────────────────────────────────── */

function FactRepeater({
  value, onChange,
}: {
  value: Fact[];
  onChange: (v: Fact[]) => void;
}) {
  function update(i: number, key: keyof Fact, val: string) {
    const next = [...value];
    next[i] = { ...next[i], [key]: val };
    onChange(next);
  }
  return (
    <div className={adminRepeater}>
      {value.map((f, i) => (
        <div key={i} className="grid grid-cols-[1fr_1fr_auto] items-start gap-2">
          <AdminInput value={f.label} placeholder="Label" onChange={(e) => update(i, "label", e.target.value)} />
          <AdminInput value={f.value} placeholder="Value" onChange={(e) => update(i, "value", e.target.value)} />
          <div className="flex gap-1">
            <AdminButton variant="danger" size="small" onClick={() => onChange(value.filter((_, j) => j !== i))}>
              <Trash2 size={14} />
            </AdminButton>
          </div>
        </div>
      ))}
      <AdminAddRow onAdd={() => onChange([...value, { label: "", value: "" }])} />
    </div>
  );
}

/* ── Title/Body Repeater ──────────────────────────────────────────── */

function TitleBodyRepeater({
  value, onChange, showHref,
}: {
  value: TitleBody[] | RelatedItem[];
  onChange: (v: TitleBody[] | RelatedItem[]) => void;
  showHref?: boolean;
}) {
  function update(i: number, key: string, val: string) {
    const next = [...value] as Array<Record<string, string>>;
    next[i] = { ...next[i], [key]: val };
    onChange(next as TitleBody[] | RelatedItem[]);
  }
  return (
    <div className={adminRepeater}>
      {value.map((item, i) => (
        <div key={i} className="flex flex-col gap-3 border border-line bg-white p-5">
          <AdminField label="Title">
            <AdminInput value={item.title} onChange={(e) => update(i, "title", e.target.value)} />
          </AdminField>
          <AdminField label="Body">
            <AdminTextarea value={item.body} rows={3} onChange={(e) => update(i, "body", e.target.value)} />
          </AdminField>
          {showHref && (
            <AdminField label="Link (optional)">
              <AdminInput value={(item as RelatedItem).href || ""} placeholder="/treks/some-slug" onChange={(e) => update(i, "href", e.target.value)} />
            </AdminField>
          )}
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <AdminButton variant="danger" size="small" onClick={() => onChange(value.filter((_, j) => j !== i))}>
              <Trash2 size={14} /> Remove
            </AdminButton>
          </div>
        </div>
      ))}
      <AdminAddRow
        onAdd={() => {
          const item = showHref ? { title: "", body: "", href: "" } : { title: "", body: "" };
          onChange([...value, item as TitleBody & RelatedItem]);
        }}
      />
    </div>
  );
}

/* ── Itinerary Day Editor ─────────────────────────────────────────── */

function ItineraryEditor({
  value, onChange,
}: {
  value: ItineraryDay[];
  onChange: (v: ItineraryDay[]) => void;
}) {
  function updateDay(i: number, patch: Partial<ItineraryDay>) {
    const next = [...value];
    next[i] = { ...next[i], ...patch };
    onChange(next);
  }
  function addStage(i: number) {
    const next = [...value];
    next[i] = { ...next[i], stages: [...next[i].stages, { label: "", body: "" }] };
    onChange(next);
  }
  function updateStage(dayI: number, stageI: number, key: "label" | "body", val: string) {
    const next = [...value];
    const stages = [...next[dayI].stages];
    stages[stageI] = { ...stages[stageI], [key]: val };
    next[dayI] = { ...next[dayI], stages };
    onChange(next);
  }
  function removeStage(dayI: number, stageI: number) {
    const next = [...value];
    next[dayI] = { ...next[dayI], stages: next[dayI].stages.filter((_, j) => j !== stageI) };
    onChange(next);
  }
  function moveDay(i: number, dir: -1 | 1) {
    const next = [...value];
    const j = i + dir;
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  }

  return (
    <div className={adminRepeater}>
      {value.map((day, i) => (
        <div key={i} className="flex flex-col gap-3 border border-line bg-white p-5">
          <div className="flex items-center justify-between gap-3">
            <span className="font-serif text-sm font-medium text-copper">Day {i + 1}</span>
            <div style={{ display: "flex", gap: 4 }}>
              {i > 0 && (
                <AdminButton variant="secondary" size="small" onClick={() => moveDay(i, -1)}>
                  <ChevronUp size={14} />
                </AdminButton>
              )}
              {i < value.length - 1 && (
                <AdminButton variant="secondary" size="small" onClick={() => moveDay(i, 1)}>
                  <ChevronDown size={14} />
                </AdminButton>
              )}
              <AdminButton variant="danger" size="small" onClick={() => onChange(value.filter((_, j) => j !== i))}>
                <Trash2 size={14} /> Remove day
              </AdminButton>
            </div>
          </div>
          <div className={adminFormGrid}>
            <AdminField label="Title">
              <AdminInput value={day.title} onChange={(e) => updateDay(i, { title: e.target.value })} />
            </AdminField>
            <AdminField label="Day label (optional)" hint="For grouped days, e.g. 1–3 or 9–10. Leave empty for automatic numbering.">
              <AdminInput value={day.dayLabel} onChange={(e) => updateDay(i, { dayLabel: e.target.value })} />
            </AdminField>
            <AdminField label="Subtitle">
              <AdminInput value={day.subtitle} onChange={(e) => updateDay(i, { subtitle: e.target.value })} />
            </AdminField>
          </div>
          <AdminField label="Paragraphs (separate with blank lines)">
            <AdminTextarea
              value={day.paragraphs}
              rows={4}
              onChange={(e) => updateDay(i, { paragraphs: e.target.value })}
            />
          </AdminField>
          <AdminField label="Overnight">
            <AdminInput value={day.overnight} placeholder="e.g. Sankaber camp" onChange={(e) => updateDay(i, { overnight: e.target.value })} />
          </AdminField>
          <AdminField label="Notes (one per line, optional)">
            <AdminTextarea
              value={day.notes}
              rows={2}
              onChange={(e) => updateDay(i, { notes: e.target.value })}
            />
          </AdminField>

          {/* Stages */}
          <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
              <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-stone">Stages</span>
              <AdminButton variant="secondary" size="small" onClick={() => addStage(i)}>
                <Plus size={14} /> Add stage
              </AdminButton>
            </div>
            {day.stages.map((stage, si) => (
              <div key={si} className="grid grid-cols-[1fr_auto] items-start gap-2" style={{ marginBottom: 8 }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 8, width: "100%" }}>
                  <AdminInput value={stage.label} placeholder="Stage label" onChange={(e) => updateStage(i, si, "label", e.target.value)} />
                  <AdminInput value={stage.body} placeholder="Stage body" onChange={(e) => updateStage(i, si, "body", e.target.value)} />
                </div>
                <AdminButton variant="danger" size="small" onClick={() => removeStage(i, si)}>
                  <Trash2 size={14} />
                </AdminButton>
              </div>
            ))}
          </div>
        </div>
      ))}
      <AdminAddRow onAdd={() => onChange([...value, { ...EMPTY_DAY }])} label="Add day" />
    </div>
  );
}

/* ── Main Tour Form ───────────────────────────────────────────────── */

export default function TourForm({
  tourId,
  initialData,
  destinations,
  categories,
}: {
  tourId?: number;
  initialData?: Record<string, unknown>;
  destinations: { id: number; name: string }[];
  categories: { id: number; name: string }[];
}) {
  const router = useRouter();
  const isNew = !tourId;
  const [form, setForm] = useState<Form>(() => {
    if (!initialData) return BLANK;
    return {
      tourTitle: String(initialData.tourName ?? ""),
      tourDestination: String(initialData.destinationId ?? (initialData.destination as Record<string, unknown>)?.id ?? ""),
      tourDestinations: Array.isArray(initialData.destinations)
        ? (initialData.destinations as { id: number }[]).map((d) => d.id)
        : [],
      tourCategories: Array.isArray(initialData.categories)
        ? (initialData.categories as { id: number }[]).map((c) => c.id)
        : [],
      adultPrice: String(initialData.adultPrice ?? ""),
      childPrice: String(initialData.childPrice ?? ""),
      tourDiscount: String(initialData.discount ?? ""),
      tourRating: String(initialData.rating ?? ""),
      tourReviews: String(initialData.noOfRates ?? ""),
      duration: String(initialData.duration ?? ""),
      style: String(initialData.style ?? ""),
      difficulty: String(initialData.difficulty ?? ""),
      journeyType: String(initialData.journeyType ?? "core-trek"),
      editorialStatus: String(initialData.editorialStatus ?? (initialData.isPublished ? "published" : "draft")),
      editorialSourceNotes: String(initialData.editorialSourceNotes ?? ""),
      fit: String(initialData.fit ?? ""),
      tourOverview: String(initialData.overview ?? ""),
      summary: String(initialData.summary ?? ""),
      itineraryIntro: String(initialData.itineraryIntro ?? ""),
      itineraryNotes: strToList(initialData.itineraryNotes as string | null),
      inquiry: String(initialData.inquiry ?? ""),
      notice: String(initialData.notice ?? ""),
      heroTitle: String(initialData.heroTitle ?? ""),
      heroAccent: String(initialData.heroAccent ?? ""),
      imageAlt: String(initialData.imageAlt ?? ""),
      isFeatured: Boolean(initialData.isFeatured),
      isPublished: Boolean(initialData.isPublished),
      sortOrder: String(initialData.sortOrder ?? "0"),
      tourImageFile: null,
      image: String(initialData.image ?? ""),
      route: strToList(initialData.route as string | null),
      facts: parseJson<Fact[]>(initialData.facts as string | null, []),
      introduction: strToList(initialData.introduction as string | null),
      highlights: parseJson<TitleBody[]>(initialData.highlights as string | null, []),
      preparation: strToList(initialData.preparation as string | null),
      related: parseJson<RelatedItem[]>(initialData.related as string | null, []),
      tourIncluded: strToList(initialData.included as string | null),
      tourExcluded: strToList(initialData.excluded as string | null),
      itinerary: Array.isArray(initialData.itinerary)
        ? (initialData.itinerary as Record<string, unknown>[]).map(dayToForm)
        : typeof initialData.itinerary === "string"
          ? parseJson<Record<string, unknown>[]>(initialData.itinerary as string, []).map(dayToForm)
          : [],
      tourMap: String(initialData.journeyMap ?? ""),
    };
  });

  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState<{ type: "success" | "error"; msg: string } | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{ tourTitle?: string; tourDestination?: string }>({});

  const imagePreview = useFilePreview(form.tourImageFile, form.image);

  function set<K extends keyof Form>(key: K, val: Form[K]) {
    setForm((prev) => ({ ...prev, [key]: val }));
  }

  const handleSave = useCallback(async (e: FormEvent) => {
    e.preventDefault();
    const nextErrors: { tourTitle?: string; tourDestination?: string } = {};
    if (!form.tourTitle.trim()) nextErrors.tourTitle = "Tour name is required.";
    if (!form.tourDestination) nextErrors.tourDestination = "Choose a destination.";
    setFieldErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      setNotice({ type: "error", msg: "Please fix the highlighted fields before saving." });
      return;
    }

    setSaving(true);
    setNotice(null);

    try {
      const fd = new FormData();
      fd.append("tourTitle", form.tourTitle);
      fd.append("tourDestination", form.tourDestination);
      fd.append("tourDestinations", JSON.stringify(form.tourDestinations));
      fd.append("tourCategories", JSON.stringify(form.tourCategories));
      fd.append("adultPrice", form.adultPrice);
      fd.append("childPrice", form.childPrice);
      fd.append("tourDiscount", form.tourDiscount);
      fd.append("tourRating", form.tourRating);
      fd.append("tourReviews", form.tourReviews);
      fd.append("isFeatured", String(form.isFeatured));
      fd.append("isPublished", String(form.isPublished));
      fd.append("sortOrder", form.sortOrder);
      fd.append("tourOverview", form.tourOverview);
      fd.append("summary", form.summary);
      fd.append("itineraryIntro", form.itineraryIntro);
      fd.append("itineraryNotes", JSON.stringify(form.itineraryNotes));
      fd.append("inquiry", form.inquiry);
      fd.append("notice", form.notice);
      fd.append("heroTitle", form.heroTitle);
      fd.append("heroAccent", form.heroAccent);
      fd.append("imageAlt", form.imageAlt);
      fd.append("duration", form.duration);
      fd.append("style", form.style);
      fd.append("difficulty", form.difficulty);
      fd.append("journeyType", form.journeyType);
      fd.append("editorialStatus", form.editorialStatus);
      fd.append("editorialSourceNotes", form.editorialSourceNotes);
      fd.append("fit", form.fit);
      if (form.tourImageFile) fd.append("tourImage", form.tourImageFile);
      if (!form.tourImageFile) fd.append("image", form.image);
      fd.append("route", JSON.stringify(form.route));
      fd.append("facts", JSON.stringify(form.facts));
      fd.append("introduction", JSON.stringify(form.introduction));
      fd.append("highlights", JSON.stringify(form.highlights));
      fd.append("preparation", JSON.stringify(form.preparation));
      fd.append("related", JSON.stringify(form.related));
      fd.append("tourIncluded", JSON.stringify(form.tourIncluded));
      fd.append("tourExcluded", JSON.stringify(form.tourExcluded));
      fd.append("tourItinerary", JSON.stringify(form.itinerary.map(dayToDb)));
      fd.append("tourMap", form.tourMap);

      const path = isNew
        ? `/api/v1/admin/tours`
        : `/api/v1/admin/tours/${tourId}`;
      const result = await adminMutate<{ id: number }>(path, {
        method: isNew ? "POST" : "PUT",
        formData: fd,
      });
      if (result === null) return;
      setNotice({ type: "success", msg: "Tour saved." });
      if (isNew && result?.id) {
        router.replace(`/admin/tours/${result.id}`);
      }
    } catch (err) {
      setNotice({ type: "error", msg: err instanceof Error ? err.message : "Save failed" });
    } finally {
      setSaving(false);
    }
  }, [form, isNew, tourId, router]);

  return (
    <form onSubmit={handleSave}>
      {notice && <AdminNotice variant={notice.type} className="mb-5">{notice.msg}</AdminNotice>}

      {/* Basics */}
      <div className={adminFormSection}>
        <h3 className={adminFormTitle}>Basics</h3>
        <div className={adminFormGrid} style={{ marginBottom: 20 }}>
          <AdminField label="Tour name" error={fieldErrors.tourTitle}>
            <AdminInput required value={form.tourTitle} onChange={(e) => set("tourTitle", e.target.value)} />
          </AdminField>
          {!isNew && typeof initialData?.slug === "string" && (
            <AdminField label="Stable URL slug (unchanged when renamed)">
              <AdminInput readOnly value={initialData.slug} />
            </AdminField>
          )}
        </div>
        <div className={adminFormGrid} style={{ marginBottom: 20 }}>
          <AdminField label="Journey type"><select value={form.journeyType} onChange={(e) => set("journeyType", e.target.value)}><option value="core-trek">Core trek</option><option value="summit-expedition">Summit expedition</option><option value="wildlife-journey">Wildlife journey</option><option value="photography-journey">Photography journey</option><option value="gondar-cultural">Gondar cultural experience</option><option value="seasonal-festival">Seasonal festival journey</option><option value="private-combination">Private combination journey</option></select></AdminField>
          <AdminField label="Editorial status"><select value={form.editorialStatus} onChange={(e) => set("editorialStatus", e.target.value)}><option value="draft">Draft</option><option value="reviewed">Reviewed</option><option value="published">Published</option></select></AdminField>
        </div>
        <AdminField label="Private source/review notes" hint="Never shown to travelers, search engines, or the assistant."><AdminTextarea value={form.editorialSourceNotes} rows={2} onChange={(e) => set("editorialSourceNotes", e.target.value)} /></AdminField>
        <div className={adminFormGrid} style={{ marginBottom: 20 }}>
          <AdminField label="Destination" error={fieldErrors.tourDestination}>
            <AdminSelect value={form.tourDestination} onChange={(e) => set("tourDestination", e.target.value)} placeholder="Select destination">
              {destinations.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
            </AdminSelect>
          </AdminField>
          <AdminField label="Categories">
            <div className={adminCheckGrid}>
              {categories.map((c) => {
                const checked = form.tourCategories.includes(c.id);
                return (
                  <label key={c.id} className={cn(adminCheckbox, checked && adminCheckboxChecked)}>
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => {
                        set("tourCategories", checked
                          ? form.tourCategories.filter((x) => x !== c.id)
                          : [...form.tourCategories, c.id]);
                      }}
                    />
                    {c.name}
                  </label>
                );
              })}
            </div>
          </AdminField>
        </div>
        <div className={adminFormGrid} style={{ marginBottom: 20 }}>
          <AdminField label="Additional destinations">
            <div className={adminCheckGrid}>
              {destinations.map((d) => {
                const checked = form.tourDestinations.includes(d.id);
                return (
                  <label key={d.id} className={cn(adminCheckbox, checked && adminCheckboxChecked)}>
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => {
                        set("tourDestinations", checked
                          ? form.tourDestinations.filter((x) => x !== d.id)
                          : [...form.tourDestinations, d.id]);
                      }}
                    />
                    {d.name}
                  </label>
                );
              })}
            </div>
          </AdminField>
        </div>
        <div className={adminFormGrid} style={{ marginBottom: 20 }}>
          <AdminField label="Adult price">
            <AdminInput type="number" step="0.01" value={form.adultPrice} onChange={(e) => set("adultPrice", e.target.value)} />
          </AdminField>
          <AdminField label="Child price">
            <AdminInput type="number" step="0.01" value={form.childPrice} onChange={(e) => set("childPrice", e.target.value)} />
          </AdminField>
          <AdminField label="Discount">
            <AdminInput value={form.tourDiscount} placeholder="e.g. 10%" onChange={(e) => set("tourDiscount", e.target.value)} />
          </AdminField>
          <AdminField label="Rating">
            <AdminInput type="number" step="0.1" min="0" max="5" value={form.tourRating} onChange={(e) => set("tourRating", e.target.value)} />
          </AdminField>
          <AdminField label="Number of ratings">
            <AdminInput type="number" min="0" value={form.tourReviews} onChange={(e) => set("tourReviews", e.target.value)} />
          </AdminField>
          <AdminField label="Sort order">
            <AdminInput type="number" min="0" value={form.sortOrder} onChange={(e) => set("sortOrder", e.target.value)} />
          </AdminField>
        </div>
        <div className={adminFormGrid} style={{ marginBottom: 20 }}>
          <AdminField label="Duration">
            <AdminInput value={form.duration} placeholder="e.g. 5 days · 4 nights" onChange={(e) => set("duration", e.target.value)} />
          </AdminField>
          <AdminField label="Style">
            <AdminInput value={form.style} placeholder="e.g. Signature journey" onChange={(e) => set("style", e.target.value)} />
          </AdminField>
          <AdminField label="Difficulty">
            <AdminInput value={form.difficulty} placeholder="e.g. Moderate to challenging" onChange={(e) => set("difficulty", e.target.value)} />
          </AdminField>
          <AdminField label="Fit">
            <AdminInput value={form.fit} placeholder="e.g. Active first-time trekkers" onChange={(e) => set("fit", e.target.value)} />
          </AdminField>
        </div>
        <AdminField label="Summary" hint="Short card and search description. The overview below holds the full story.">
          <AdminTextarea value={form.summary} rows={2} onChange={(e) => set("summary", e.target.value)} />
        </AdminField>
        <AdminField label="Overview">
          <AdminTextarea value={form.tourOverview} rows={4} onChange={(e) => set("tourOverview", e.target.value)} />
        </AdminField>
        <div className={adminFormGrid} style={{ marginTop: 20 }}>
          <AdminToggle checked={form.isFeatured} onChange={(v) => set("isFeatured", v)} label="Featured" />
          <AdminField
            label="Visibility"
            hint={form.isPublished
              ? "Published tours are available through the public API. Detail-page CMS cutover is a later production-plan task."
              : "Draft tours are excluded from the public API. Existing bundled detail pages remain until CMS cutover."}
          >
            <div className="flex items-center gap-3">
              <AdminToggle checked={form.isPublished} onChange={(v) => set("isPublished", v)} label="Published" />
              <span className={cn(
                "rounded-sm px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.08em]",
                form.isPublished ? "bg-teal/12 text-teal" : "bg-copper/12 text-copper",
              )}>
                {form.isPublished ? "Live" : "Draft"}
              </span>
            </div>
          </AdminField>
        </div>
      </div>

      <hr className={adminDivider} />

      {/* Image */}
      <div className={adminFormSection}>
        <h3 className={adminFormTitle}>Image</h3>
        <div className="flex items-start gap-4">
          {(form.tourImageFile || form.image) && (
            <img
              className={adminImagePreview}
              src={imagePreview}
              alt="Preview"
            />
          )}
          <div style={{ display: "flex", flexDirection: "column", gap: 12, flex: 1 }}>
            <AdminField
              label="Upload file"
              hint={form.tourImageFile
                ? `New file selected: ${form.tourImageFile.name}. Save to replace the current image.`
                : form.image
                  ? "Upload a file to replace the current image, or keep the URL below."
                  : "JPEG, PNG, WebP or AVIF."}
            >
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/avif"
                onChange={(e) => set("tourImageFile", e.target.files?.[0] ?? null)}
              />
            </AdminField>
            {form.tourImageFile && (
              <AdminButton variant="secondary" size="small" onClick={() => set("tourImageFile", null)}>
                Clear new file
              </AdminButton>
            )}
            <AdminField
              label="Or paste image URL"
              hint={form.image && !form.tourImageFile ? `Current image: ${form.image}` : undefined}
            >
              <AdminInput value={form.image} placeholder="https://..." onChange={(e) => set("image", e.target.value)} />
            </AdminField>
          </div>
        </div>
        <div className={adminFormGrid} style={{ marginTop: 20 }}>
          <AdminField label="Hero title">
            <AdminInput value={form.heroTitle} onChange={(e) => set("heroTitle", e.target.value)} />
          </AdminField>
          <AdminField label="Hero accent">
            <AdminInput value={form.heroAccent} onChange={(e) => set("heroAccent", e.target.value)} />
          </AdminField>
          <AdminField label="Image alt text">
            <AdminInput value={form.imageAlt} onChange={(e) => set("imageAlt", e.target.value)} />
          </AdminField>
        </div>
      </div>

      <hr className={adminDivider} />

      {/* Editorial: Inquiry & Notice */}
      <div className={adminFormSection}>
        <h3 className={adminFormTitle}>Inquiry & Notice</h3>
        <AdminField label="Inquiry slug (links to plan page)">
          <AdminInput value={form.inquiry} placeholder="e.g. simien-day" onChange={(e) => set("inquiry", e.target.value)} />
        </AdminField>
        <div style={{ marginTop: 16 }}>
          <AdminField label="Notice text (shown above itinerary)">
            <AdminTextarea value={form.notice} rows={3} onChange={(e) => set("notice", e.target.value)} />
          </AdminField>
        </div>
      </div>

      <hr className={adminDivider} />

      {/* Route */}
      <div className={adminFormSection}>
        <h3 className={adminFormTitle}>Route</h3>
        <p className={adminFormDesc}>List of stops shown on the tour page (e.g. Gondar, Debark, Sankaber).</p>
        <ListRepeater value={form.route} onChange={(v) => set("route", v)} placeholder="Stop name" />
      </div>

      <hr className={adminDivider} />

      {/* Facts */}
      <div className={adminFormSection}>
        <h3 className={adminFormTitle}>Facts</h3>
        <p className={adminFormDesc}>Key facts displayed in the &ldquo;At a glance&rdquo; grid.</p>
        <FactRepeater value={form.facts} onChange={(v) => set("facts", v)} />
      </div>

      <hr className={adminDivider} />

      {/* Introduction */}
      <div className={adminFormSection}>
        <h3 className={adminFormTitle}>Additional overview paragraphs</h3>
        <p className={adminFormDesc}>Continuation of the overview; do not repeat the summary or opening paragraph.</p>
        <ListRepeater value={form.introduction} onChange={(v) => set("introduction", v)} placeholder="Paragraph" />
      </div>

      <hr className={adminDivider} />

      {/* Itinerary */}
      <div className={adminFormSection}>
        <h3 className={adminFormTitle}>Itinerary</h3>
        <p className={adminFormDesc}>Use one entry per day. For a day trip or half/full-day alternatives, use one programme entry with labelled stages. Paragraphs split on blank lines.</p>
        <AdminField label="Itinerary introduction" hint="For example: Sample 3-day outline, adapted at booking.">
          <AdminTextarea value={form.itineraryIntro} rows={2} onChange={(e) => set("itineraryIntro", e.target.value)} />
        </AdminField>
        <AdminField label="Itinerary notes" hint="Return logistics, shorter variants and other schedule-specific qualifications.">
          <ListRepeater value={form.itineraryNotes} onChange={(v) => set("itineraryNotes", v)} placeholder="Itinerary note" />
        </AdminField>
        <ItineraryEditor value={form.itinerary} onChange={(v) => set("itinerary", v)} />
      </div>

      <hr className={adminDivider} />

      {/* Highlights */}
      <div className={adminFormSection}>
        <h3 className={adminFormTitle}>Highlights</h3>
        <TitleBodyRepeater value={form.highlights} onChange={(v) => set("highlights", v as TitleBody[])} />
      </div>

      <hr className={adminDivider} />

      {/* Preparation */}
      <div className={adminFormSection}>
        <h3 className={adminFormTitle}>Preparation</h3>
        <p className={adminFormDesc}>Advice and expectations shown in &ldquo;Before you choose&rdquo;.</p>
        <ListRepeater value={form.preparation} onChange={(v) => set("preparation", v)} placeholder="Preparation note" />
      </div>

      <hr className={adminDivider} />

      {/* Included / Excluded */}
      <div className={adminFormSection}>
        <h3 className={adminFormTitle}>Included & Excluded</h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
          <div>
            <span className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.08em] text-stone">Included</span>
            <ListRepeater value={form.tourIncluded} onChange={(v) => set("tourIncluded", v)} placeholder="Included item" />
          </div>
          <div>
            <span className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.08em] text-stone">Excluded</span>
            <ListRepeater value={form.tourExcluded} onChange={(v) => set("tourExcluded", v)} placeholder="Excluded item" />
          </div>
        </div>
      </div>

      <hr className={adminDivider} />

      {/* Related */}
      <div className={adminFormSection}>
        <h3 className={adminFormTitle}>Related tours</h3>
        <TitleBodyRepeater value={form.related} onChange={(v) => set("related", v as RelatedItem[])} showHref />
      </div>

      <hr className={adminDivider} />

      {/* Journey map */}
      <div className={adminFormSection}>
        <h3 className={adminFormTitle}>Journey map</h3>
        <AdminField label="Map URL or description">
          <AdminInput value={form.tourMap} onChange={(e) => set("tourMap", e.target.value)} />
        </AdminField>
      </div>

      {/* Actions */}
      <div style={{ display: "flex", gap: 12, marginTop: 32, paddingTop: 24, borderTop: "1px solid var(--line)" }}>
        <AdminButton type="submit" disabled={saving}>
          {saving ? "Saving..." : "Save tour"}
        </AdminButton>
        <AdminButton variant="secondary" onClick={() => router.push("/admin/tours")}>
          Back to list
        </AdminButton>
      </div>
    </form>
  );
}
