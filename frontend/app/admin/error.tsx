"use client";

import { useEffect } from "react";
import { ErrorFallback } from "@/components/ErrorFallback";
import { reportClientError } from "@/lib/report-client-error";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    reportClientError("admin-error", error);
  }, [error]);

  return (
    <ErrorFallback
      eyebrow="Admin"
      title="This page could not load."
      lead="Try again, or return to the dashboard. Admin stays in English."
      retryLabel="Try again"
      onRetry={reset}
      homeHref="/admin"
      homeLabel="Dashboard"
      secondaryHref="/admin/login"
      secondaryLabel="Sign in"
    />
  );
}
