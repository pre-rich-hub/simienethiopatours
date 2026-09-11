"use client";

import { useState, type FormEvent } from "react";
import { adminMutate } from "@/lib/admin/client";
import { useAdminList } from "@/lib/admin/useAdminList";
import { adminToast } from "@/lib/admin/toast";
import {
  AdminButton, AdminCard, AdminField, AdminInput, AdminTextarea, AdminBadge,
  AdminPageHeader, AdminLoading, AdminEmpty, AdminError, AdminListTable, AdminTableRow, AdminTd,
  AdminSearch, AdminNotice, adminFormSection, adminFormGrid, adminFormActions, adminTableActions,
} from "@/components/admin/ui";

type Testimonial = {
  id: number;
  message: string;
  reviewerName: string;
  profession: string | null;
  source: string | null;
  title: string | null;
  date: string | null;
  avatarTone: string | null;
  translatedFrom: string | null;
};

export default function AdminTestimonialsPage() {
  const { items, setItems, loading, error, reload } = useAdminList<Testimonial>("/api/v1/admin/testimonials");
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<Testimonial | null>(null);
  const [showForm, setShowForm] = useState(false);

  const [message, setMessage] = useState("");
  const [reviewerName, setReviewerName] = useState("");
  const [profession, setProfession] = useState("");
  const [source, setSource] = useState("");
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [avatarTone, setAvatarTone] = useState("");
  const [translatedFrom, setTranslatedFrom] = useState("");
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const filtered = items.filter((t) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return [t.reviewerName, t.title, t.message, t.source].some((v) => (v || "").toLowerCase().includes(q));
  });

  function openNew() {
    setEditing(null);
    setMessage(""); setReviewerName(""); setProfession(""); setSource("");
    setTitle(""); setDate(""); setAvatarTone(""); setTranslatedFrom("");
    setFormError(null);
    setShowForm(true);
  }

  function openEdit(t: Testimonial) {
    setEditing(t);
    setMessage(t.message); setReviewerName(t.reviewerName);
    setProfession(t.profession || ""); setSource(t.source || "");
    setTitle(t.title || ""); setDate(t.date || "");
    setAvatarTone(t.avatarTone || ""); setTranslatedFrom(t.translatedFrom || "");
    setFormError(null);
    setShowForm(true);
  }

  function cancel() { setShowForm(false); setEditing(null); setFormError(null); }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setFormError(null);
    try {
      const payload = {
        message, reviewerName,
        profession: profession || undefined,
        source: source || undefined,
        title: title || undefined,
        date: date || undefined,
        avatarTone: avatarTone || undefined,
        translatedFrom: translatedFrom || undefined,
      };
      const path = editing
        ? `/api/v1/admin/testimonials/${editing.id}`
        : `/api/v1/admin/testimonials`;
      const result = await adminMutate(path, {
        method: editing ? "PUT" : "POST",
        json: payload,
      });
      if (result === null) return;
      adminToast("success", editing ? "Testimonial updated." : "Testimonial created.");
      setShowForm(false);
      setEditing(null);
      await reload();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Save failed");
    }
    setSaving(false);
  }

  async function handleDelete(id: number, name: string) {
    if (!window.confirm(`Delete testimonial by "${name}"?`)) return;
    try {
      const result = await adminMutate(`/api/v1/admin/testimonials/${id}`, { method: "DELETE" });
      if (result === null) return;
      setItems((prev) => prev.filter((t) => t.id !== id));
      adminToast("success", "Testimonial deleted.");
    } catch (err) {
      adminToast("error", err instanceof Error ? err.message : "Delete failed");
    }
  }

  if (loading) return <AdminLoading />;

  return (
    <>
      <AdminPageHeader
        title="Testimonials"
        actions={<AdminButton variant="primary" onClick={openNew}>New testimonial</AdminButton>}
      />

      <AdminSearch value={search} onChange={setSearch} placeholder="Search reviewer, title, or message..." />

      {showForm && (
        <div className="mb-6">
          <AdminCard title={editing ? "Edit testimonial" : "New testimonial"}>
            {formError && <AdminNotice variant="error" className="mb-4">{formError}</AdminNotice>}
            <form onSubmit={handleSubmit}>
              <AdminField label="Message" className={adminFormSection}>
                <AdminTextarea required value={message} onChange={(e) => setMessage(e.target.value)} />
              </AdminField>
              <div className={adminFormGrid}>
                <AdminField label="Reviewer name">
                  <AdminInput required value={reviewerName} onChange={(e) => setReviewerName(e.target.value)} />
                </AdminField>
                <AdminField label="Title">
                  <AdminInput value={title} onChange={(e) => setTitle(e.target.value)} />
                </AdminField>
                <AdminField label="Profession">
                  <AdminInput value={profession} onChange={(e) => setProfession(e.target.value)} />
                </AdminField>
                <AdminField label="Source">
                  <AdminInput value={source} onChange={(e) => setSource(e.target.value)} />
                </AdminField>
                <AdminField label="Date">
                  <AdminInput value={date} onChange={(e) => setDate(e.target.value)} placeholder="e.g. January 2026" />
                </AdminField>
                <AdminField label="Avatar tone">
                  <AdminInput value={avatarTone} onChange={(e) => setAvatarTone(e.target.value)} placeholder="e.g. clay, sky, forest" />
                </AdminField>
                <AdminField label="Translated from">
                  <AdminInput value={translatedFrom} onChange={(e) => setTranslatedFrom(e.target.value)} placeholder="e.g. Amharic, N/A" />
                </AdminField>
              </div>
              <div className={`${adminFormActions} mt-4`}>
                <AdminButton type="submit" disabled={saving}>{saving ? "Saving..." : editing ? "Update" : "Create"}</AdminButton>
                <AdminButton variant="secondary" onClick={cancel}>Cancel</AdminButton>
              </div>
            </form>
          </AdminCard>
        </div>
      )}

      <AdminCard flush>
        {error ? (
          <AdminError onRetry={() => void reload()}>{error}</AdminError>
        ) : filtered.length === 0 ? (
          <AdminEmpty>{items.length === 0 ? "No testimonials yet." : "No testimonials match your search."}</AdminEmpty>
        ) : (
          <AdminListTable headers={["Name", "Message", "Title", "Source", "Date", "Translated", ""]}>
            {filtered.map((t) => (
              <AdminTableRow key={t.id} className="hover:bg-copper/3">
                <AdminTd className="font-semibold">{t.reviewerName}</AdminTd>
                <AdminTd truncate>{t.message}</AdminTd>
                <AdminTd>{t.title || "—"}</AdminTd>
                <AdminTd>{t.source || "—"}</AdminTd>
                <AdminTd>{t.date || "—"}</AdminTd>
                <AdminTd>
                  {t.translatedFrom && <AdminBadge variant="amber">{t.translatedFrom}</AdminBadge>}
                </AdminTd>
                <AdminTd>
                  <div className={adminTableActions}>
                    <AdminButton variant="secondary" size="small" onClick={() => openEdit(t)}>Edit</AdminButton>
                    <AdminButton variant="danger" size="small" onClick={() => handleDelete(t.id, t.reviewerName)}>Delete</AdminButton>
                  </div>
                </AdminTd>
              </AdminTableRow>
            ))}
          </AdminListTable>
        )}
      </AdminCard>
    </>
  );
}
