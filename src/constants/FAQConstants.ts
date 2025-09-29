export const SAFETEXT = (value: unknown, fallback = ""): string =>
  typeof value === "string" ? value : fallback;