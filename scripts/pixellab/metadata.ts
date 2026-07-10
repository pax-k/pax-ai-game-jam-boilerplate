const SENSITIVE_KEY = /(authorization|bearer|token|secret|api[-_]?key)/i;

export function sanitizePixelLabMetadata(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(sanitizePixelLabMetadata);
  }
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).flatMap(([key, entry]) =>
        SENSITIVE_KEY.test(key) || key.toLowerCase().includes("base64")
          ? []
          : [[key, sanitizePixelLabMetadata(entry)]]
      )
    );
  }
  return typeof value === "string" && value.startsWith("data:image/")
    ? "[omitted-image-data]"
    : value;
}
