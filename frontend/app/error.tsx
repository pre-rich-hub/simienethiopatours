"use client";

import { useEffect } from "react";
import { ErrorFallback } from "@/components/ErrorFallback";
import { reportClientError } from "@/lib/report-client-error";

export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    reportClientError("app-error", error);
  }, [error]);

  return (
    <ErrorFallback
      eyebrow="Something went wrong"
      title="This page could not load."
      lead="Try again, or go home. The planner still reaches the local team."
      retryLabel="Try again"
      onRetry={reset}
      homeHref="/en"
      homeLabel="Home"
      secondaryHref="/en/plan"
      secondaryLabel="Plan with Tevan"
    />
  );
}
