"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { AdminSidebar, AdminTopbar, AdminLoading } from "@/components/admin/ui";
import { adminRequestClient } from "@/lib/admin/client";

type Admin = { id: number; email: string; name: string | null };

const LOGIN_PATH = "/admin/login";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isLogin = pathname === LOGIN_PATH;
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [loading, setLoading] = useState(!isLogin);

  useEffect(() => {
    if (isLogin) return;
    let cancelled = false;
    adminRequestClient<Admin>("/api/v1/auth/me")
      .then((data) => {
        if (cancelled) return;
        if (!data) {
          window.location.href = "/admin/login";
          return;
        }
        setAdmin(data);
        setLoading(false);
      })
      .catch(() => {
        if (!cancelled) window.location.href = "/admin/login";
      });
    return () => { cancelled = true; };
  }, [isLogin, pathname]);

  if (isLogin) {
    return <>{children}</>;
  }

  if (loading) {
    return <AdminLoading>Loading...</AdminLoading>;
  }

  return (
    <div className="grid min-h-dvh md:grid-cols-[256px_1fr]">
      <AdminSidebar currentPath={pathname} />
      <div className="min-h-dvh bg-paper md:col-start-2">
        <AdminTopbar userName={admin?.name || admin?.email} />
        <div className="p-5 md:p-8">{children}</div>
      </div>
    </div>
  );
}
