export const REQUIRED_PIXELLAB_PATHS = [
  "/balance",
  "/background-jobs/{job_id}"
] as const;

export function missingRequiredPixelLabPaths(paths: Record<string, unknown>) {
  return REQUIRED_PIXELLAB_PATHS.filter((path) => !paths[path]);
}
