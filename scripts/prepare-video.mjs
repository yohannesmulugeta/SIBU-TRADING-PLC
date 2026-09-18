import { mkdir } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ffmpeg = process.env.FFMPEG_PATH;
if (!ffmpeg) {
  throw new Error("Set FFMPEG_PATH to a local ffmpeg executable before running this script.");
}

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const source = path.join(root, "image and video");
const output = path.join(root, "public", "video");
await mkdir(output, { recursive: true });

const clips = [
  { source: "process.mp4", target: "hero-guji.mp4", start: "0", duration: "10" },
  { source: "process.mp4", target: "harvest.mp4", start: "38", duration: "9" },
  { source: "process.mp4", target: "processing.mp4", start: "65", duration: "11" },
  { source: "process.mp4", target: "warehouse.mp4", start: "96", duration: "10" }
];

for (const clip of clips) {
  const result = spawnSync(
    ffmpeg,
    [
      "-hide_banner",
      "-loglevel", "error",
      "-ss", clip.start,
      "-i", path.join(source, clip.source),
      "-t", clip.duration,
      "-vf", "scale=1280:-2:flags=lanczos",
      "-an",
      "-c:v", "libx264",
      "-preset", "slow",
      "-crf", "27",
      "-pix_fmt", "yuv420p",
      "-movflags", "+faststart",
      "-y",
      path.join(output, clip.target)
    ],
    { stdio: "inherit" }
  );

  if (result.status !== 0) {
    throw new Error(`Could not create ${clip.target}`);
  }
}
