"use client";

import { useEffect, useState } from "react";
import { adminMutate, adminRequestClient } from "@/lib/admin/client";
import { AdminButton, AdminCard, AdminEmpty, AdminError, AdminInput, AdminLoading, AdminNotice, AdminPageHeader, AdminSelect, AdminTextarea } from "@/components/admin/ui";

type Translation = { id: number; entityType: "tour" | "destination" | "blog"; entitySlug: string; locale: "es" | "de" | "fr"; status: "missing" | "draft" | "reviewed" | "published"; content: Record<string, unknown> };

export default function AdminTranslationsPage() {
  const [items, setItems] = useState<Translation[]>([]);
  const [selected, setSelected] = useState<Translation | null>(null);
  const [query, setQuery] = useState("");
  const [json, setJson] = useState("{}");
  const [status, setStatus] = useState<Translation["status"]>("draft");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function reload() { setError(null); try { setItems(await adminRequestClient<Translation[]>("/api/v1/admin/translations") ?? []); } catch (e) { setError(e instanceof Error ? e.message : "Failed to load translations"); } }
  useEffect(() => { void reload(); }, []);
  const filtered = items.filter(row => `${row.entityType} ${row.entitySlug} ${row.locale} ${row.status}`.toLowerCase().includes(query.toLowerCase()));
  function edit(row: Translation) { setSelected(row); setStatus(row.status); setJson(JSON.stringify(row.content, null, 2)); }
  async function save() {
    if (!selected) return;
    setSaving(true); setError(null);
    try {
      const content = JSON.parse(json) as Record<string, unknown>;
      await adminMutate(`/api/v1/admin/translations/${selected.entityType}/${selected.entitySlug}/${selected.locale}`, { method: "PUT", json: { content, status } });
      await reload(); setSelected(null);
    } catch (e) { setError(e instanceof Error ? e.message : "Failed to save translation"); }
    finally { setSaving(false); }
  }
  if (error && items.length === 0) return <AdminError onRetry={() => void reload()}>{error}</AdminError>;
  if (!items.length) return <><AdminPageHeader title="Translations" /><AdminEmpty>No translation records yet. Run the content seed to create the English source snapshots.</AdminEmpty></>;
  return <>
    <AdminPageHeader title="Translations" />
    {error && <AdminNotice variant="error">{error}</AdminNotice>}
    <AdminInput aria-label="Search translations" placeholder="Search entity, slug, locale, or status" value={query} onChange={event => setQuery(event.target.value)} />
    <AdminCard flush>
      <div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead><tr><th className="p-3">Entity</th><th>Locale</th><th>Status</th><th /></tr></thead><tbody>{filtered.map(row => <tr key={row.id} className="border-t border-ink/10"><td className="p-3">{row.entityType}/{row.entitySlug}</td><td>{row.locale.toUpperCase()}</td><td>{row.status}</td><td className="p-3 text-right"><AdminButton size="small" variant="secondary" onClick={() => edit(row)}>Edit</AdminButton></td></tr>)}</tbody></table></div>
    </AdminCard>
    {selected && <AdminCard title={`Edit ${selected.entityType}/${selected.entitySlug} · ${selected.locale.toUpperCase()}`}>
      <AdminSelect value={status} onChange={event => setStatus(event.target.value as Translation["status"])}><option value="draft">Draft</option><option value="reviewed">Reviewed</option><option value="published">Published</option><option value="missing">Missing</option></AdminSelect>
      <AdminTextarea className="mt-4 min-h-[360px] font-mono text-xs" value={json} onChange={event => setJson(event.target.value)} />
      <div className="mt-4 flex gap-3"><AdminButton disabled={saving} onClick={() => void save()}>{saving ? "Saving…" : "Save translation"}</AdminButton><AdminButton variant="secondary" onClick={() => setSelected(null)}>Cancel</AdminButton></div>
    </AdminCard>}
  </>;
}
