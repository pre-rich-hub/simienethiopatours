"use client";

import { useEffect } from "react";
import { useLocale, useTranslations } from "next-intl";
import { ErrorFallback } from "@/components/ErrorFallback";
import { reportClientError } from "@/lib/report-client-error";

export default function LocaleError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const locale = useLocale();
  const t = useTranslations("errors");
  const tCommon = useTranslations("common");
  const tCta = useTranslations("cta");

  useEffect(() => {
    reportClientError("locale-error", error);
  }, [error]);

  return (
    <ErrorFallback
      eyebrow={t("eyebrow")}
      title={t("title")}
      lead={t("lead")}
      retryLabel={t("retry")}
      onRetry={reset}
      homeHref={`/${locale}`}
      homeLabel={tCommon("home")}
      secondaryHref={`/${locale}/plan`}
      secondaryLabel={tCta("planWithTevan")}
    />
  );
}
