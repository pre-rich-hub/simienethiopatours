"use client";

import { useState, type FormEvent } from "react";
import { adminMutate, adminRequestClient } from "@/lib/admin/client";
import { useAdminList } from "@/lib/admin/useAdminList";
import { adminToast } from "@/lib/admin/toast";
import {
  AdminButton, AdminCard, AdminField, AdminInput, AdminTextarea,
  AdminPageHeader, AdminLoading, AdminEmpty, AdminError, AdminListTable, AdminTableRow, AdminTd,
  AdminNotice, adminFormSection, adminFormActions, adminTableActions,
} from "@/components/admin/ui";

type Contact = {
  id: number;
  name: string;
  email: string;
  message: string;
  createdAt: string;
};

export default function AdminContactsPage() {
  const { items, setItems, loading, error, reload } = useAdminList<Contact>("/api/v1/admin/contacts");
  const [selected, setSelected] = useState<Contact | null>(null);
  const [replying, setReplying] = useState(false);
  const [subject, setSubject] = useState("");
  const [replyMsg, setReplyMsg] = useState("");
  const [sending, setSending] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  async function openContact(c: Contact) {
    setFormError(null);
    setReplying(false);
    try {
      const full = await adminRequestClient<Contact>(`/api/v1/admin/contacts/${c.id}`);
      setSelected(full ?? c);
    } catch {
      setSelected(c);
    }
  }

  function startReply(c: Contact) {
    setSelected(c);
    setReplying(true);
    setSubject(`Re: Your inquiry to Simien Ethiopia Tours`);
    setReplyMsg("");
    setFormError(null);
  }

  function cancelReply() {
    setReplying(false);
    setFormError(null);
  }

  async function handleReply(e: FormEvent) {
    e.preventDefault();
    if (!selected) return;
    setSending(true);
    setFormError(null);
    try {
      const result = await adminMutate(`/api/v1/admin/contacts/${selected.id}/reply`, {
        method: "POST",
        json: { subject, message: replyMsg },
      });
      if (result === null) return;
      adminToast("success", `Reply sent to ${selected.email}.`);
      setReplying(false);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Reply failed");
    }
    setSending(false);
  }

  async function handleDelete(id: number, name: string) {
    if (!window.confirm(`Delete contact from "${name}"?`)) return;
    try {
      const result = await adminMutate(`/api/v1/admin/contacts/${id}`, { method: "DELETE" });
      if (result === null) return;
      setItems((prev) => prev.filter((c) => c.id !== id));
      if (selected?.id === id) setSelected(null);
      adminToast("success", "Contact deleted.");
    } catch (err) {
      adminToast("error", err instanceof Error ? err.message : "Delete failed");
    }
  }

  if (loading) return <AdminLoading />;

  return (
    <>
      <AdminPageHeader title="Contacts" />

      {selected && (
        <div className="mb-6">
          <AdminCard
            title={selected.name}
            actions={<AdminButton variant="secondary" size="small" onClick={() => { setSelected(null); setReplying(false); }}>Close</AdminButton>}
          >
            <p className="mt-0 mb-2 text-sm text-stone">{selected.email} · {new Date(selected.createdAt).toLocaleString()}</p>
            <pre className="mb-4 max-h-[360px] overflow-auto whitespace-pre-wrap rounded-sm border border-line bg-paper p-4 font-sans text-sm leading-relaxed text-ink">{selected.message}</pre>
            {!replying && (
              <div className={adminTableActions}>
                <AdminButton variant="secondary" size="small" onClick={() => startReply(selected)}>Reply</AdminButton>
                <AdminButton variant="danger" size="small" onClick={() => handleDelete(selected.id, selected.name)}>Delete</AdminButton>
              </div>
            )}
            {replying && (
              <form onSubmit={handleReply} className="mt-4">
                {formError && <AdminNotice variant="error" className="mb-4">{formError}</AdminNotice>}
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
            )}
          </AdminCard>
        </div>
      )}

      <AdminCard flush>
        {error ? (
          <AdminError onRetry={() => void reload()}>{error}</AdminError>
        ) : items.length === 0 ? (
          <AdminEmpty>
            <p className="mb-2">No contacts yet.</p>
            <p className="m-0 text-[13px]">Messages will appear here when travelers send an inquiry.</p>
          </AdminEmpty>
        ) : (
          <AdminListTable headers={["Name", "Email", "Message", "Date", ""]}>
            {items.map((c) => (
              <AdminTableRow key={c.id} className="hover:bg-copper/3">
                <AdminTd className="font-semibold">{c.name}</AdminTd>
                <AdminTd>{c.email}</AdminTd>
                <AdminTd truncate>{c.message}</AdminTd>
                <AdminTd>{new Date(c.createdAt).toLocaleDateString()}</AdminTd>
                <AdminTd>
                  <div className={adminTableActions}>
                    <AdminButton variant="secondary" size="small" onClick={() => void openContact(c)}>View</AdminButton>
                    <AdminButton variant="secondary" size="small" onClick={() => startReply(c)}>Reply</AdminButton>
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
