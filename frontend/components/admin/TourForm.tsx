"use client";

import { type FormEvent, type ReactNode, useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { adminMutate, adminRequestClient } from "@/lib/admin/client";
import {
  AdminButton, AdminField, AdminInput, AdminTextarea, AdminSelect,
  AdminToggle, AdminNotice, AdminAddRow, AdminRepeaterItem, Plus, Trash2,
  ChevronUp, ChevronDown,
} from "@/components/admin/ui";
import { useFilePreview } from "@/components/admin/useFilePreview";

/* ── Types ────────────────────────────────────────────────────────── */

type ItineraryDay = {
  title: string;
  subtitle: string;
  paragraphs: string;
  overnight: string;
  notes: string;
  stages: { label: string; body: string }[];
};

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
  fit: string;
  tourOverview: string;
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
  title: "", subtitle: "", paragraphs: "", overnight: "", notes: "", stages: [],
};

const BLANK: Form = {
  tourTitle: "", tourDestination: "", tourDestinations: [], tourCategories: [],
  adultPrice: "", childPrice: "", tourDiscount: "", tourRating: "", tourReviews: "",
  duration: "", style: "", difficulty: "", fit: "", tourOverview: "", inquiry: "", notice: "",
  heroTitle: "", heroAccent: "", imageAlt: "", isFeatured: false, isPublished: false,
  sortOrder: "0", tourImageFile: null, image: "", route: [], facts: [], introduction: [],
  highlights: [], preparation: [], related: [], tourIncluded: [], tourExcluded: [],
  itinerary: [], tourMap: "",
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

function dayToForm(raw: Record<string, unknown>): ItineraryDay {
  return {
    title: String(raw.title ?? ""),
    subtitle: String(raw.subtitle ?? ""),
    paragraphs: Array.isArray(raw.paragraphs) ? raw.paragraphs.join("\n\n") : String(raw.paragraphs ?? ""),
    overnight: String(raw.overnight ?? ""),
    notes: Array.isArray(raw.notes) ? raw.notes.join("\n") : String(raw.notes ?? ""),
    stages: Array.isArray(raw.stages)
      ? raw.stages.map((s: Record<string, unknown>) => ({ label: String(s.label ?? ""), body: String(s.body ?? "") }))
      : [],
  };
}

function dayToDb(d: ItineraryDay): Record<string, unknown> {
  return {
    title: d.title,
    subtitle: d.subtitle,
    paragraphs: d.paragraphs.split(/\n\n+/).map((s) => s.trim()).filter(Boolean),
    overnight: d.overnight || undefined,
    notes: d.notes.trim() ? d.notes.split(/\n+/).map((s) => s.trim()).filter(Boolean) : undefined,
    stages: d.stages.length ? d.stages.filter((s) => s.label.trim()) : undefined,
  };
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
    <div className="admin-repeater">
      {value.map((item, i) => (
        <div key={i} className="admin-repeater__item">
          <AdminInput
            value={item}
            placeholder={placeholder}
            onChange={(e) => { const next = [...value]; next[i] = e.target.value; onChange(next); }}
          />
          <div className="admin-repeater__reorder">
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
    <div className="admin-repeater">
      {value.map((f, i) => (
        <div key={i} className="admin-repeater__item admin-repeater__item--pair">
          <AdminInput value={f.label} placeholder="Label" onChange={(e) => update(i, "label", e.target.value)} />
          <AdminInput value={f.value} placeholder="Value" onChange={(e) => update(i, "value", e.target.value)} />
          <div className="admin-repeater__reorder">
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
    <div className="admin-repeater">
      {value.map((item, i) => (
        <div key={i} className="admin-repeater__item--day">
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
    <div className="admin-repeater">
      {value.map((day, i) => (
        <div key={i} className="admin-repeater__item--day">
          <div className="admin-repeater__day-header">
            <span className="admin-repeater__day-number">Day {i + 1}</span>
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
          <div className="admin-form-grid">
            <AdminField label="Title">
              <AdminInput value={day.title} onChange={(e) => updateDay(i, { title: e.target.value })} />
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
              <span className="admin-label">Stages</span>
              <AdminButton variant="secondary" size="small" onClick={() => addStage(i)}>
                <Plus size={14} /> Add stage
              </AdminButton>
            </div>
            {day.stages.map((stage, si) => (
              <div key={si} className="admin-repeater__item" style={{ marginBottom: 8 }}>
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
      fit: String(initialData.fit ?? ""),
      tourOverview: String(initialData.overview ?? ""),
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

  const imagePreview = useFilePreview(form.tourImageFile, form.image);

  function set<K extends keyof Form>(key: K, val: Form[K]) {
    setForm((prev) => ({ ...prev, [key]: val }));
  }

  const handleSave = useCallback(async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setNotice(null);

    try {
      const fd = new FormData();
      fd.append("tourTitle", form.tourTitle);
      if (form.tourDestination) fd.append("tourDestination", form.tourDestination);
      if (form.tourDestinations.length) fd.append("tourDestinations", JSON.stringify(form.tourDestinations));
      if (form.tourCategories.length) fd.append("tourCategories", JSON.stringify(form.tourCategories));
      if (form.adultPrice) fd.append("adultPrice", form.adultPrice);
      if (form.childPrice) fd.append("childPrice", form.childPrice);
      if (form.tourDiscount) fd.append("tourDiscount", form.tourDiscount);
      if (form.tourRating) fd.append("tourRating", form.tourRating);
      if (form.tourReviews) fd.append("tourReviews", form.tourReviews);
      fd.append("isFeatured", String(form.isFeatured));
      fd.append("isPublished", String(form.isPublished));
      fd.append("sortOrder", form.sortOrder);
      fd.append("tourOverview", form.tourOverview);
      if (form.inquiry) fd.append("inquiry", form.inquiry);
      if (form.notice) fd.append("notice", form.notice);
      if (form.heroTitle) fd.append("heroTitle", form.heroTitle);
      if (form.heroAccent) fd.append("heroAccent", form.heroAccent);
      if (form.imageAlt) fd.append("imageAlt", form.imageAlt);
      if (form.duration) fd.append("duration", form.duration);
      if (form.style) fd.append("style", form.style);
      if (form.difficulty) fd.append("difficulty", form.difficulty);
      if (form.fit) fd.append("fit", form.fit);
      if (form.tourImageFile) fd.append("tourImage", form.tourImageFile);
      if (!form.tourImageFile && form.image) fd.append("image", form.image);
      if (form.route.length) fd.append("route", JSON.stringify(form.route));
      if (form.facts.length) fd.append("facts", JSON.stringify(form.facts));
      if (form.introduction.length) fd.append("introduction", JSON.stringify(form.introduction));
      if (form.highlights.length) fd.append("highlights", JSON.stringify(form.highlights));
      if (form.preparation.length) fd.append("preparation", JSON.stringify(form.preparation));
      if (form.related.length) fd.append("related", JSON.stringify(form.related));
      if (form.tourIncluded.length) fd.append("tourIncluded", JSON.stringify(form.tourIncluded));
      if (form.tourExcluded.length) fd.append("tourExcluded", JSON.stringify(form.tourExcluded));
      if (form.itinerary.length) fd.append("tourItinerary", JSON.stringify(form.itinerary.map(dayToDb)));
      if (form.tourMap) fd.append("tourMap", form.tourMap);

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
    }
    setSaving(false);
  }, [form, isNew, tourId, router]);

  return (
    <form onSubmit={handleSave}>
      {notice && <AdminNotice variant={notice.type} style={{ marginBottom: 20 }}>{notice.msg}</AdminNotice>}

      {/* Basics */}
      <div className="admin-form-section">
        <h3 className="admin-form-section__title">Basics</h3>
        <div className="admin-form-grid" style={{ marginBottom: 20 }}>
          <AdminField label="Tour name">
            <AdminInput required value={form.tourTitle} onChange={(e) => set("tourTitle", e.target.value)} />
          </AdminField>
          {!isNew && typeof initialData?.slug === "string" && (
            <AdminField label="Slug (auto-generated)">
              <AdminInput readOnly value={initialData.slug} />
            </AdminField>
          )}
        </div>
        <div className="admin-form-grid" style={{ marginBottom: 20 }}>
          <AdminField label="Destination">
            <AdminSelect value={form.tourDestination} onChange={(e) => set("tourDestination", e.target.value)} placeholder="Select destination">
              {destinations.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
            </AdminSelect>
          </AdminField>
          <AdminField label="Categories">
            <div className="admin-check-grid">
              {categories.map((c) => {
                const checked = form.tourCategories.includes(c.id);
                return (
                  <label key={c.id} className={`admin-checkbox ${checked ? "admin-checkbox--checked" : ""}`}>
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
        <div className="admin-form-grid" style={{ marginBottom: 20 }}>
          <AdminField label="Additional destinations">
            <div className="admin-check-grid">
              {destinations.map((d) => {
                const checked = form.tourDestinations.includes(d.id);
                return (
                  <label key={d.id} className={`admin-checkbox ${checked ? "admin-checkbox--checked" : ""}`}>
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
        <div className="admin-form-grid" style={{ marginBottom: 20 }}>
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
        <div className="admin-form-grid" style={{ marginBottom: 20 }}>
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
        <AdminField label="Overview">
          <AdminTextarea value={form.tourOverview} rows={4} onChange={(e) => set("tourOverview", e.target.value)} />
        </AdminField>
        <div className="admin-form-grid" style={{ marginTop: 20 }}>
          <AdminToggle checked={form.isFeatured} onChange={(v) => set("isFeatured", v)} label="Featured" />
          <AdminToggle checked={form.isPublished} onChange={(v) => set("isPublished", v)} label="Published" />
        </div>
      </div>

      <hr className="admin-form-divider" />

      {/* Image */}
      <div className="admin-form-section">
        <h3 className="admin-form-section__title">Image</h3>
        <div className="admin-image-row">
          {(form.tourImageFile || form.image) && (
            <img
              className="admin-image-preview"
              src={imagePreview}
              alt="Preview"
            />
          )}
          <div style={{ display: "flex", flexDirection: "column", gap: 12, flex: 1 }}>
            <AdminField label="Upload file">
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/avif"
                onChange={(e) => set("tourImageFile", e.target.files?.[0] ?? null)}
              />
            </AdminField>
            <AdminField label="Or paste image URL">
              <AdminInput value={form.image} placeholder="https://..." onChange={(e) => set("image", e.target.value)} />
            </AdminField>
          </div>
        </div>
        <div className="admin-form-grid" style={{ marginTop: 20 }}>
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

      <hr className="admin-form-divider" />

      {/* Editorial: Inquiry & Notice */}
      <div className="admin-form-section">
        <h3 className="admin-form-section__title">Inquiry & Notice</h3>
        <AdminField label="Inquiry slug (links to plan page)">
          <AdminInput value={form.inquiry} placeholder="e.g. simien-day" onChange={(e) => set("inquiry", e.target.value)} />
        </AdminField>
        <div style={{ marginTop: 16 }}>
          <AdminField label="Notice text (shown above itinerary)">
            <AdminTextarea value={form.notice} rows={3} onChange={(e) => set("notice", e.target.value)} />
          </AdminField>
        </div>
      </div>

      <hr className="admin-form-divider" />

      {/* Route */}
      <div className="admin-form-section">
        <h3 className="admin-form-section__title">Route</h3>
        <p className="admin-form-section__desc">List of stops shown on the tour page (e.g. Gondar, Debark, Sankaber).</p>
        <ListRepeater value={form.route} onChange={(v) => set("route", v)} placeholder="Stop name" />
      </div>

      <hr className="admin-form-divider" />

      {/* Facts */}
      <div className="admin-form-section">
        <h3 className="admin-form-section__title">Facts</h3>
        <p className="admin-form-section__desc">Key facts displayed in the &ldquo;At a glance&rdquo; grid.</p>
        <FactRepeater value={form.facts} onChange={(v) => set("facts", v)} />
      </div>

      <hr className="admin-form-divider" />

      {/* Introduction */}
      <div className="admin-form-section">
        <h3 className="admin-form-section__title">Introduction</h3>
        <p className="admin-form-section__desc">Opening paragraphs for &ldquo;The journey&rdquo; section.</p>
        <ListRepeater value={form.introduction} onChange={(v) => set("introduction", v)} placeholder="Paragraph" />
      </div>

      <hr className="admin-form-divider" />

      {/* Itinerary */}
      <div className="admin-form-section">
        <h3 className="admin-form-section__title">Itinerary</h3>
        <p className="admin-form-section__desc">Day-by-day breakdown. Paragraphs split on blank lines. Stages are optional sub-stops within a day.</p>
        <ItineraryEditor value={form.itinerary} onChange={(v) => set("itinerary", v)} />
      </div>

      <hr className="admin-form-divider" />

      {/* Highlights */}
      <div className="admin-form-section">
        <h3 className="admin-form-section__title">Highlights</h3>
        <TitleBodyRepeater value={form.highlights} onChange={(v) => set("highlights", v as TitleBody[])} />
      </div>

      <hr className="admin-form-divider" />

      {/* Preparation */}
      <div className="admin-form-section">
        <h3 className="admin-form-section__title">Preparation</h3>
        <p className="admin-form-section__desc">Advice and expectations shown in &ldquo;Before you choose&rdquo;.</p>
        <ListRepeater value={form.preparation} onChange={(v) => set("preparation", v)} placeholder="Preparation note" />
      </div>

      <hr className="admin-form-divider" />

      {/* Included / Excluded */}
      <div className="admin-form-section">
        <h3 className="admin-form-section__title">Included & Excluded</h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
          <div>
            <span className="admin-label" style={{ display: "block", marginBottom: 8 }}>Included</span>
            <ListRepeater value={form.tourIncluded} onChange={(v) => set("tourIncluded", v)} placeholder="Included item" />
          </div>
          <div>
            <span className="admin-label" style={{ display: "block", marginBottom: 8 }}>Excluded</span>
            <ListRepeater value={form.tourExcluded} onChange={(v) => set("tourExcluded", v)} placeholder="Excluded item" />
          </div>
        </div>
      </div>

      <hr className="admin-form-divider" />

      {/* Related */}
      <div className="admin-form-section">
        <h3 className="admin-form-section__title">Related tours</h3>
        <TitleBodyRepeater value={form.related} onChange={(v) => set("related", v as RelatedItem[])} showHref />
      </div>

      <hr className="admin-form-divider" />

      {/* Journey map */}
      <div className="admin-form-section">
        <h3 className="admin-form-section__title">Journey map</h3>
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
