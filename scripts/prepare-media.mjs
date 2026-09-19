import { mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const source = path.join(root, "image and video");
const output = path.join(root, "src", "assets", "media");

const selections = {
  "hero-aerial.webp": "sibu_drone_photos-2.jpg",
  "aerial-drying.webp": "sibu_drone_photos-10.jpg",
  "aerial-station.webp": "sibu_drone_photos-12.jpg",
  "aerial-scale.webp": "sibu_drone_photos-14.jpg",
  "coffee-host.webp": "sibu_export-17.jpg",
  "sorting-duo.webp": "sibu_export-42.jpg",
  "sorting-line.webp": "sibu_export-48.jpg",
  "washing-team.webp": "sibu_export-56.jpg",
  "wet-processing.webp": "sibu_export-61.jpg",
  "bean-inspection.webp": "sibu_export-68.jpg",
  "drying-worker.webp": "sibu_export-75.jpg",
  "cherry-sorting.webp": "sibu_export-83.jpg",
  "community-team.webp": "sibu_export-90.jpg",
  "community-portrait.webp": "sibu_export-101.jpg",
  "drying-portrait.webp": "sibu_export-114.jpg",
  "green-coffee.webp": "sibu_export-142.jpg",
  "drying-landscape.webp": "sibu_export-147.jpg",
  "coffee-in-hands.webp": "sibu_export-153.jpg",
  "quality-review.webp": "sibu_export-155.jpg",
  "warehouse-coffee.webp": "sibu_export-159.jpg",
  "bagging-team.webp": "sibu_export-163.jpg",
  "coffee-picker.webp": "sibu_export-167.jpg",
  "nav-coffee-cherries.webp": "sibu_export-34.jpg",
  "footer-coffee-beans.webp": "sibu_export-143.jpg",
  "footer-origin-drying.webp": "sibu_export-148.jpg",
};

await mkdir(output, { recursive: true });

for (const [target, original] of Object.entries(selections)) {
  await sharp(path.join(source, original))
    .rotate()
    .resize({ width: 2200, height: 1467, fit: "inside", withoutEnlargement: true })
    .webp({ quality: 80, effort: 5, smartSubsample: true })
    .toFile(path.join(output, target));
  console.log(`${original} -> ${target}`);
}
