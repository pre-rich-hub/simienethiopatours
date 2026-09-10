"use client";

import { useEffect, useState, type FormEvent } from "react";
import { adminMutate, adminRequestClient } from "@/lib/admin/client";
import { AdminButton, AdminCard, AdminField, AdminInput, AdminTextarea, AdminBadge, AdminNotice } from "@/components/admin/ui";

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

  // form
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

  if (loading) return <div className="admin-loading">Loading...</div>;

  return (
    <>
      <div className="admin-page-header">
        <h1>Testimonials</h1>
        <div className="admin-page-header__actions">
          <AdminButton variant="primary" onClick={openNew}>New testimonial</AdminButton>
        </div>
      </div>

      {notice && <AdminNotice variant={notice.type} style={{ marginBottom: 20 }}>{notice.msg}</AdminNotice>}

      {showForm && (
        <div className="admin-inline-form">
          <AdminCard title={editing ? "Edit testimonial" : "New testimonial"}>
            <form onSubmit={handleSubmit}>
              <AdminField label="Message" className="admin-form-section">
                <AdminTextarea required value={message} onChange={(e) => setMessage(e.target.value)} />
              </AdminField>
              <div className="admin-form-grid">
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
              <div className="admin-form-actions" style={{ marginTop: 16 }}>
                <AdminButton type="submit" disabled={saving}>{saving ? "Saving..." : editing ? "Update" : "Create"}</AdminButton>
                <AdminButton variant="secondary" onClick={cancel}>Cancel</AdminButton>
              </div>
            </form>
          </AdminCard>
        </div>
      )}

      <div className="admin-card admin-card--flush">
        {items.length === 0 ? (
          <div className="admin-empty">No testimonials yet.</div>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Title</th>
                  <th>Profession</th>
                  <th>Source</th>
                  <th>Date</th>
                  <th>Translated</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {items.map((t) => (
                  <tr key={t.id}>
                    <td style={{ fontWeight: 600 }}>{t.reviewerName}</td>
                    <td>{t.title || "—"}</td>
                    <td>{t.profession || "—"}</td>
                    <td>{t.source || "—"}</td>
                    <td>{t.date || "—"}</td>
                    <td>
                      {t.translatedFrom && <AdminBadge variant="amber">{t.translatedFrom}</AdminBadge>}
                    </td>
                    <td>
                      <div className="admin-table__actions">
                        <AdminButton variant="secondary" size="small" onClick={() => openEdit(t)}>Edit</AdminButton>
                        <AdminButton variant="danger" size="small" onClick={() => handleDelete(t.id, t.reviewerName)}>Delete</AdminButton>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
