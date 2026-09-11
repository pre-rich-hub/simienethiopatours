"use client";

import { useEffect, useState, type FormEvent } from "react";
import { adminMutate, adminRequestClient } from "@/lib/admin/client";
import {
  AdminButton, AdminCard, AdminField, AdminInput, AdminTextarea, AdminNotice,
  AdminPageHeader, AdminLoading, AdminEmpty, AdminListTable, AdminTableRow, AdminTd,
  adminFormSection, adminFormActions, adminTableActions,
} from "@/components/admin/ui";

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

  if (loading) return <AdminLoading />;

  return (
    <>
      <AdminPageHeader title="Contacts" />

      {notice && <AdminNotice variant={notice.type} className="mb-5">{notice.msg}</AdminNotice>}

      {replyingTo && (
        <div className="mb-6">
          <AdminCard title={`Reply to ${replyingTo.name}`}>
            <div className="mb-3 text-[13px] text-stone">
              Sending to: <strong>{replyingTo.email}</strong>
            </div>
            <form onSubmit={handleReply}>
              <AdminField label="Subject" className={adminFormSection}>
                <AdminInput required value={subject} onChange={(e) => setSubject(e.target.value)} />
              </AdminField>
              <AdminField label="Message" className={adminFormSection}>
                <AdminTextarea required className="min-h-[150px]" value={replyMsg} onChange={(e) => setReplyMsg(e.target.value)} />
              </AdminField>
              <div className={adminFormActions}>
                <AdminButton type="submit" disabled={sending}>{sending ? "Sending..." : "Send reply"}</AdminButton>
                <AdminButton variant="secondary" onClick={cancelReply}>Cancel</AdminButton>
              </div>
            </form>
          </AdminCard>
        </div>
      )}

      <AdminCard flush>
        {items.length === 0 ? (
          <AdminEmpty>
            <p className="mb-2">No contacts yet.</p>
            <p className="m-0 text-[13px]">Messages will appear here when customers use the contact form on your site.</p>
          </AdminEmpty>
        ) : (
          <AdminListTable headers={["Name", "Email", "Message", "Date", ""]}>
            {items.map((c) => (
              <AdminTableRow key={c.id} className="hover:bg-copper/3">
                <AdminTd className="font-semibold">{c.name}</AdminTd>
                <AdminTd>{c.email}</AdminTd>
                <AdminTd truncate>{c.message.slice(0, 120)}{c.message.length > 120 ? "..." : ""}</AdminTd>
                <AdminTd>{new Date(c.createdAt).toLocaleDateString()}</AdminTd>
                <AdminTd>
                  <div className={adminTableActions}>
                    <AdminButton variant="secondary" size="small" onClick={() => openReply(c)}>Reply</AdminButton>
                    <AdminButton variant="danger" size="small" onClick={() => handleDelete(c.id, c.name)}>Delete</AdminButton>
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
