export function mergeMessages<T extends Record<string, unknown>>(
  base: T,
  overlay: Record<string, unknown>,
): T {
  const result: Record<string, unknown> = { ...base };
  for (const [key, value] of Object.entries(overlay)) {
    const current = result[key];
    if (
      value &&
      typeof value === "object" &&
      !Array.isArray(value) &&
      current &&
      typeof current === "object" &&
      !Array.isArray(current)
    ) {
      result[key] = mergeMessages(
        current as Record<string, unknown>,
        value as Record<string, unknown>,
      );
    } else if (value !== undefined) {
      result[key] = value;
    }
  }
  return result as T;
}
