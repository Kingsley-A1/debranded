/**
 * DEBRANDED — Icon & Asset Generator
 * Run: node scripts/generate-icons.mjs
 *
 * Outputs (all in public/):
 *   icon-512.png   — PWA app icon (512×512, D mark crop)
 *   icon-192.png   — PWA app icon (192×192, D mark crop)
 *   logo-mark.png  — Header mark  (160×160, D mark crop)
 *   og-image.jpg   — Open Graph   (1200×630, logo centred on brand bg)
 */

import sharp from "sharp";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const INPUT = path.resolve(__dirname, "../../logo.jpg"); // DEBRANDED/logo.jpg
const PUBLIC = path.resolve(__dirname, "../public"); // debranded/public/

async function main() {
  const { width, height } = await sharp(INPUT).metadata();
  console.log(`\nSource image: ${width}×${height}px\n`);

  // ── D-mark crop region ──────────────────────────────────────────────────
  // The logo.jpg has the D mark in the upper ~55% of the image,
  // centred horizontally. We extract a square from that area.
  const cropH = Math.floor(height * 0.5); // height of the mark zone (D only)
  const cropSize = Math.min(width, cropH); // square side
  const cropLeft = Math.floor((width - cropSize) / 2); // centred
  const cropTop = Math.floor(height * 0.1); // 10% from top (avoid padding)

  const markRegion = {
    left: Math.max(0, cropLeft),
    top: Math.max(0, cropTop),
    width: cropSize,
    height: Math.min(cropSize, height - cropTop),
  };

  console.log("D-mark region:", markRegion);

  // ── icon-512.png ────────────────────────────────────────────────────────
  await sharp(INPUT)
    .extract(markRegion)
    .resize(512, 512, { fit: "cover" })
    .png()
    .toFile(path.join(PUBLIC, "icon-512.png"));
  console.log("✓  icon-512.png");

  // ── icon-192.png ────────────────────────────────────────────────────────
  await sharp(INPUT)
    .extract(markRegion)
    .resize(192, 192, { fit: "cover" })
    .png()
    .toFile(path.join(PUBLIC, "icon-192.png"));
  console.log("✓  icon-192.png");

  // ── logo-mark.png (header, 160×160) ─────────────────────────────────────
  await sharp(INPUT)
    .extract(markRegion)
    .resize(160, 160, { fit: "cover" })
    .png()
    .toFile(path.join(PUBLIC, "logo-mark.png"));
  console.log("✓  logo-mark.png");

  // ── og-image.jpg (1200×630) ─────────────────────────────────────────────
  // Fit the entire logo (D mark + text) centred on brand background
  await sharp(INPUT)
    .resize(1200, 630, {
      fit: "contain",
      background: { r: 6, g: 6, b: 14, alpha: 1 }, // #06060e
    })
    .jpeg({ quality: 92, mozjpeg: true })
    .toFile(path.join(PUBLIC, "og-image.jpg"));
  console.log("✓  og-image.jpg");

  console.log("\nAll assets generated successfully!\n");
}

main().catch((err) => {
  console.error("Generation failed:", err);
  process.exit(1);
});
