"use client";

import { type FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import "../admin.css";

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
    <div className="admin-login">
      <form className="admin-login__card" onSubmit={handleSubmit}>
        <span className="admin-login__wordmark">Simien Ethio Tours</span>
        {error && <div className="admin-login__error">{error}</div>}
        <div className="admin-field" style={{ marginBottom: 16 }}>
          <label className="admin-label">Email</label>
          <input
            className="admin-input"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoFocus
          />
        </div>
        <div className="admin-field" style={{ marginBottom: 28 }}>
          <label className="admin-label">Password</label>
          <input
            className="admin-input"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button
          type="submit"
          className="admin-button admin-button--primary"
          disabled={busy}
          style={{ width: "100%" }}
        >
          {busy ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </div>
  );
}
