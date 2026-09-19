import { mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const source = path.join(root, "media-masters", "recognition");
const output = path.join(root, "src", "assets", "recognition");

const items = [
  { source: "certificate-page-01.png", target: "coop-bank-merit-2020.webp", rotate: 270 },
  { source: "certificate-page-02.png", target: "hijra-bank-silver-recognition-2026.webp", rotate: 270 },
  {
    source: "certificate-page-04.png",
    target: "coop-bank-appreciation.webp",
    crop: { left: 300, top: 245, width: 1940, height: 1320 },
  },
  {
    source: "certificate-page-05.png",
    target: "ecocert-eu-organic-2021-2023.webp",
    redactions: [{ left: 1035, top: 15, width: 450, height: 92 }],
  },
  { source: "certificate-page-06.png", target: "oromia-tax-recognition-2011.webp", rotate: 270 },
  { source: "certificate-page-07.png", target: "oromia-investment-performance-2014.webp", rotate: 270 },
  { source: "certificate-page-08.png", target: "oromia-government-recognition-2009.webp", rotate: 270 },
  { source: "certificate-page-09.png", target: "gelan-investment-recognition-2014.webp", rotate: 270 },
  { source: "certificate-page-11.png", target: "cup-of-excellence-ethiopia-2020.webp", rotate: 270 },
  { source: "certificate-page-12.png", target: "oromia-tax-recognition-2013.webp" },
  {
    source: "certificate-page-13.png",
    target: "ecocert-nop-organic-2021.webp",
    redactions: [{ left: 970, top: 18, width: 525, height: 105 }],
  },
  { source: "certificate-page-14.png", target: "cafeshow-green-booth-2019.webp" },
  {
    source: "certificate-page-15.png",
    target: "rainforest-alliance-certificate-2021-2024.webp",
    redactions: [{ left: 600, top: 525, width: 700, height: 140 }],
  },
  { source: "certificate-page-16.png", target: "oromia-award-trophy-2011.webp", photo: true },
  { source: "certificate-page-17.png", target: "oromia-tax-award-trophy-2017.webp", photo: true },
  { source: "certificate-page-18.png", target: "hijra-bank-silver-award-2026.webp", photo: true },
  { source: "certificate-page-20.png", target: "ministry-revenue-recognition-2025.webp", rotate: 270 },
  { source: "certificate-page-21.png", target: "gfoundation-appreciation-2025.webp", rotate: 270 },
  { source: "certificate-page-22.png", target: "sibu-recognition-display.webp", photo: true, maxSize: 2000 },
  {
    source: "oromia-trade-industry-plaque-2014.png",
    target: "oromia-trade-industry-plaque-2014.webp",
    photo: true,
    maxSize: 1600,
  },
];

function redactionOverlay({ left, top, width, height }) {
  const fontSize = Math.max(18, Math.round(height * 0.22));
  const input = Buffer.from(`
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect x="1" y="1" width="${width - 2}" height="${height - 2}" rx="4"
        fill="#f6f3eb" stroke="#d9d2c3" stroke-width="2" />
      <text x="${width / 2}" y="${height / 2}" text-anchor="middle"
        dominant-baseline="middle" fill="#625e55" font-family="Arial, sans-serif"
        font-size="${fontSize}" letter-spacing="1">
        IDENTIFIER WITHHELD
      </text>
    </svg>`);

  return { input, left, top };
}

await mkdir(output, { recursive: true });

for (const item of items) {
  const input = path.join(source, item.source);
  let image = sharp(input, { limitInputPixels: false }).flatten({ background: "#ffffff" });

  if (item.rotate) image = image.rotate(item.rotate, { background: "#ffffff" });
  if (item.crop) image = image.extract(item.crop);

  if (item.redactions?.length) {
    const prepared = await image.toBuffer({ resolveWithObject: true });
    image = sharp(prepared.data).composite(item.redactions.map(redactionOverlay));
  }

  const maxSize = item.maxSize ?? (item.photo ? 2000 : 2200);
  await image
    .resize({ width: maxSize, height: maxSize, fit: "inside", withoutEnlargement: true })
    .sharpen({ sigma: item.photo ? 0.45 : 0.7 })
    .webp({ quality: item.photo ? 80 : 84, effort: 6, smartSubsample: true })
    .toFile(path.join(output, item.target));

  console.log(`${item.source} -> ${item.target}`);
}
