"use client";

import { useEffect, useState, type FormEvent } from "react";
import { adminMutate, adminRequestClient } from "@/lib/admin/client";
import {
  AdminButton, AdminCard, AdminField, AdminInput, AdminTextarea, AdminBadge, AdminNotice,
  AdminPageHeader, AdminLoading, AdminEmpty, AdminListTable, AdminTableRow, AdminTd,
  adminFormSection, adminFormGrid, adminFormActions, adminTableActions,
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
  const [items, setItems] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
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
  const [notice, setNotice] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  function load() {
    adminRequestClient<Testimonial[]>("/api/v1/admin/testimonials")
      .then((d) => { if (d) setItems(d); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }

  useEffect(() => { load(); }, []);

  function openNew() {
    setEditing(null);
    setMessage(""); setReviewerName(""); setProfession(""); setSource("");
    setTitle(""); setDate(""); setAvatarTone(""); setTranslatedFrom("");
    setNotice(null);
    setShowForm(true);
  }

  function openEdit(t: Testimonial) {
    setEditing(t);
    setMessage(t.message); setReviewerName(t.reviewerName);
    setProfession(t.profession || ""); setSource(t.source || "");
    setTitle(t.title || ""); setDate(t.date || "");
    setAvatarTone(t.avatarTone || ""); setTranslatedFrom(t.translatedFrom || "");
    setNotice(null);
    setShowForm(true);
  }

  function cancel() { setShowForm(false); setEditing(null); setNotice(null); }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setNotice(null);
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
      setNotice({ type: "success", msg: editing ? "Testimonial updated." : "Testimonial created." });
      setShowForm(false);
      setEditing(null);
      load();
    } catch (err) {
      setNotice({ type: "error", msg: err instanceof Error ? err.message : "Save failed" });
    }
    setSaving(false);
  }

  async function handleDelete(id: number, name: string) {
    if (!window.confirm(`Delete testimonial by "${name}"?`)) return;
    try {
      const result = await adminMutate(`/api/v1/admin/testimonials/${id}`, { method: "DELETE" });
      if (result === null) return;
      setItems((prev) => prev.filter((t) => t.id !== id));
      setNotice({ type: "success", msg: "Testimonial deleted." });
    } catch (err) {
      setNotice({ type: "error", msg: err instanceof Error ? err.message : "Delete failed" });
    }
  }

  if (loading) return <AdminLoading />;

  return (
    <>
      <AdminPageHeader
        title="Testimonials"
        actions={<AdminButton variant="primary" onClick={openNew}>New testimonial</AdminButton>}
      />

      {notice && <AdminNotice variant={notice.type} className="mb-5">{notice.msg}</AdminNotice>}

      {showForm && (
        <div className="mb-6">
          <AdminCard title={editing ? "Edit testimonial" : "New testimonial"}>
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
                  <AdminInput value={avatarTone} onChange={(e) => setAvatarTone(e.target.value)} placeholder="e.g. warm, professional" />
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
        {items.length === 0 ? (
          <AdminEmpty>No testimonials yet.</AdminEmpty>
        ) : (
          <AdminListTable headers={["Name", "Title", "Profession", "Source", "Date", "Translated", ""]}>
            {items.map((t) => (
              <AdminTableRow key={t.id} className="hover:bg-copper/3">
                <AdminTd className="font-semibold">{t.reviewerName}</AdminTd>
                <AdminTd>{t.title || "—"}</AdminTd>
                <AdminTd>{t.profession || "—"}</AdminTd>
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
