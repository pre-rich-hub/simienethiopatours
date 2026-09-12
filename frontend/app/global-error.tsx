"use client";

import { useEffect } from "react";
import { ErrorFallback } from "@/components/ErrorFallback";
import { reportClientError } from "@/lib/report-client-error";
import "./globals.css";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    reportClientError("global-error", error);
  }, [error]);

  return (
    <html lang="en">
      <body>
        <ErrorFallback
          eyebrow="Something went wrong"
          title="This page could not load."
          lead="Try again, or go home."
          retryLabel="Try again"
          onRetry={reset}
          homeHref="/en"
          homeLabel="Home"
        />
      </body>
    </html>
  );
}
