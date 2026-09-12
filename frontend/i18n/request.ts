import { getRequestConfig } from "next-intl/server";
import { hasLocale } from "next-intl";
import { routing, type AppLocale } from "./routing";
import { mergeMessages } from "./merge-messages";
import en from "../messages/en.json";

async function loadMessages(locale: AppLocale) {
  if (locale === "en") return en;
  try {
    const overlay = (await import(`../messages/${locale}.json`)).default;
    return mergeMessages(en, overlay);
  } catch {
    return en;
  }
}

export default getRequestConfig(async ({ locale, requestLocale }) => {
  const requested = locale ?? (await requestLocale);
  const resolved = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  return {
    locale: resolved,
    messages: await loadMessages(resolved),
  };
});
