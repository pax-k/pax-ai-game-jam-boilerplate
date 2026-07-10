import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import { dirname } from "node:path";

export type AtlasFrame = { path: string; column: number; row: number };

export async function buildAtlas(
  frames: readonly AtlasFrame[],
  columns: number,
  rows: number,
  outputPath: string
) {
  if (frames.length === 0) {
    throw new Error("An atlas needs at least one frame.");
  }
  const inspected = await Promise.all(frames.map(async (frame) => ({ frame, metadata: await sharp(frame.path).metadata() })));
  const width = Math.max(...inspected.map(({ metadata }) => metadata.width ?? 0));
  const height = Math.max(...inspected.map(({ metadata }) => metadata.height ?? 0));
  if (!width || !height) {
    throw new Error("Unable to read atlas frame dimensions.");
  }
  await mkdir(dirname(outputPath), { recursive: true });
  await sharp({ create: { width: width * columns, height: height * rows, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } })
    .composite(await Promise.all(inspected.map(async ({ frame, metadata }) => ({
      input: await sharp(frame.path).ensureAlpha().png().toBuffer(),
      left: frame.column * width + Math.floor((width - (metadata.width ?? width)) / 2),
      top: frame.row * height + Math.floor((height - (metadata.height ?? height)) / 2)
    }))))
    .png()
    .toFile(outputPath);
  return { width: width * columns, height: height * rows, frameWidth: width, frameHeight: height };
}
