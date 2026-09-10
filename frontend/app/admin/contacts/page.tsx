"use client";

import { useEffect, useState, type FormEvent } from "react";
import { adminMutate, adminRequestClient } from "@/lib/admin/client";
import { AdminButton, AdminCard, AdminField, AdminInput, AdminTextarea, AdminNotice } from "@/components/admin/ui";

type Contact = {
  id: number;
  name: string;
  email: string;
  message: string;
  createdAt: string;
};

export default function AdminContactsPage() {
  const [items, setItems] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [replyingTo, setReplyingTo] = useState<Contact | null>(null);
  const [subject, setSubject] = useState("");
  const [replyMsg, setReplyMsg] = useState("");
  const [sending, setSending] = useState(false);
  const [notice, setNotice] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  function load() {
    adminRequestClient<Contact[]>("/api/v1/admin/contacts")
      .then((d) => { if (d) setItems(d); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }

  useEffect(() => { load(); }, []);

  function openReply(c: Contact) {
    setReplyingTo(c);
    setSubject(`Re: Your inquiry to Simien Ethiopia Tours`);
    setReplyMsg("");
    setNotice(null);
  }

  function cancelReply() { setReplyingTo(null); setNotice(null); }

  async function handleReply(e: FormEvent) {
    e.preventDefault();
    if (!replyingTo) return;
    setSending(true);
    setNotice(null);
    try {
      const result = await adminMutate(`/api/v1/admin/contacts/${replyingTo.id}/reply`, {
        method: "POST",
        json: { subject, message: replyMsg },
      });
      if (result === null) return;
      setNotice({ type: "success", msg: `Reply sent to ${replyingTo.email}.` });
      setReplyingTo(null);
    } catch (err) {
      setNotice({ type: "error", msg: err instanceof Error ? err.message : "Reply failed" });
    }
    setSending(false);
  }

  async function handleDelete(id: number, name: string) {
    if (!window.confirm(`Delete contact from "${name}"?`)) return;
    try {
      const result = await adminMutate(`/api/v1/admin/contacts/${id}`, { method: "DELETE" });
      if (result === null) return;
      setItems((prev) => prev.filter((c) => c.id !== id));
      setNotice({ type: "success", msg: "Contact deleted." });
    } catch (err) {
      setNotice({ type: "error", msg: err instanceof Error ? err.message : "Delete failed" });
    }
  }

  if (loading) return <div className="admin-loading">Loading...</div>;

  return (
    <>
      <div className="admin-page-header">
        <h1>Contacts</h1>
      </div>

      {notice && <AdminNotice variant={notice.type} style={{ marginBottom: 20 }}>{notice.msg}</AdminNotice>}

      {replyingTo && (
        <div className="admin-inline-form">
          <AdminCard title={`Reply to ${replyingTo.name}`}>
            <div style={{ marginBottom: 12, fontSize: 13, color: "var(--stone)" }}>
              Sending to: <strong>{replyingTo.email}</strong>
            </div>
            <form onSubmit={handleReply}>
              <AdminField label="Subject" className="admin-form-section">
                <AdminInput required value={subject} onChange={(e) => setSubject(e.target.value)} />
              </AdminField>
              <AdminField label="Message" className="admin-form-section">
                <AdminTextarea required style={{ minHeight: 150 }} value={replyMsg} onChange={(e) => setReplyMsg(e.target.value)} />
              </AdminField>
              <div className="admin-form-actions">
                <AdminButton type="submit" disabled={sending}>{sending ? "Sending..." : "Send reply"}</AdminButton>
                <AdminButton variant="secondary" onClick={cancelReply}>Cancel</AdminButton>
              </div>
            </form>
          </AdminCard>
        </div>
      )}

      <div className="admin-card admin-card--flush">
        {items.length === 0 ? (
          <div className="admin-empty">
            <p style={{ margin: "0 0 8px" }}>No contacts yet.</p>
            <p style={{ margin: 0, fontSize: 13 }}>Messages will appear here when customers use the contact form on your site.</p>
          </div>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Message</th>
                  <th>Date</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {items.map((c) => (
                  <tr key={c.id}>
                    <td style={{ fontWeight: 600 }}>{c.name}</td>
                    <td>{c.email}</td>
                    <td className="admin-table__truncate">{c.message.slice(0, 120)}{c.message.length > 120 ? "..." : ""}</td>
                    <td>{new Date(c.createdAt).toLocaleDateString()}</td>
                    <td>
                      <div className="admin-table__actions">
                        <AdminButton variant="secondary" size="small" onClick={() => openReply(c)}>Reply</AdminButton>
                        <AdminButton variant="danger" size="small" onClick={() => handleDelete(c.id, c.name)}>Delete</AdminButton>
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
