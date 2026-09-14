"use client";

import { type FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AdminButton, AdminField, AdminInput, AdminNotice } from "@/components/admin/ui";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [expired, setExpired] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setExpired(params.get("expired") === "1");
  }, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      // Same-origin: next.config.ts rewrites /api/:path* to the backend so the
      // admin_session cookie lands on this origin.
      const res = await fetch("/api/v1/auth/login", {
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
      <form method="post" className="w-full max-w-[420px] border border-line bg-ivory px-10 py-[52px]" onSubmit={handleSubmit}>
        <h1 className="mt-0 mb-9 text-center font-serif text-[32px] font-medium leading-[1.1] tracking-[-0.03em] text-highland">Simien Ethio Tours</h1>
        {expired && !error && (
          <AdminNotice variant="error" className="mb-5">Your session expired. Sign in again to continue.</AdminNotice>
        )}
        {error && <AdminNotice variant="error" className="mb-5">{error}</AdminNotice>}
        <AdminField label="Email" className="mb-4">
          <AdminInput
            type="email"
            name="email"
            autoComplete="username"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoFocus
          />
        </AdminField>
        <AdminField label="Password" className="mb-7">
          <AdminInput
            type="password"
            name="password"
            autoComplete="current-password"
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