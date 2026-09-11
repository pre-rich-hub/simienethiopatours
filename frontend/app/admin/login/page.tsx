"use client";

import { type FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { AdminButton, AdminField, AdminInput, AdminNotice } from "@/components/admin/ui";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const res = await fetch(`${API_BASE}/api/v1/auth/login`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const body = await res.json();
      if (!res.ok) {
        setError(body?.message || "Invalid email or password");
        setBusy(false);
        return;
      }
      router.push("/admin");
    } catch {
      setError("Could not connect to the server");
      setBusy(false);
    }
  }

  return (
    <div className="grid min-h-dvh place-items-center bg-paper p-6">
      <form className="w-full max-w-[420px] border border-line bg-ivory px-10 py-[52px]" onSubmit={handleSubmit}>
        <span className="mb-9 block text-center font-serif text-[32px] font-medium leading-[1.1] tracking-[-0.03em] text-highland">Simien Ethio Tours</span>
        {error && <AdminNotice variant="error" className="mb-5">{error}</AdminNotice>}
        <AdminField label="Email" className="mb-4">
          <AdminInput
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoFocus
          />
        </AdminField>
        <AdminField label="Password" className="mb-7">
          <AdminInput
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </AdminField>
        <AdminButton type="submit" disabled={busy} className="w-full">
          {busy ? "Signing in..." : "Sign in"}
        </AdminButton>
      </form>
    </div>
  );
}
