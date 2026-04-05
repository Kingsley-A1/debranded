/**
 * DEBRANDED — Icon & Asset Generator
 * Run: node scripts/generate-icons.mjs
 *
 * Sources (in public/):
 *   debranded-icon.png  — D-mark icon (used for PWA icons + header)
 *   debranded.png       — Full wordmark (used for OG image)
 *
 * Outputs (all in public/):
 *   icon-512.png   — PWA app icon (512×512)
 *   icon-192.png   — PWA app icon (192×192)
 *   og-image.jpg   — Open Graph   (1200×630, logo centred on brand bg)
 */

import sharp from "sharp";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC = path.resolve(__dirname, "../public"); // debranded/public/
const ICON_SRC = path.join(PUBLIC, "debranded-icon.png");
const LOGO_SRC = path.join(PUBLIC, "debranded.png");

async function main() {
  const iconMeta = await sharp(ICON_SRC).metadata();
  console.log(`\nIcon source: ${iconMeta.width}×${iconMeta.height}px`);
  const logoMeta = await sharp(LOGO_SRC).metadata();
  console.log(`Logo source: ${logoMeta.width}×${logoMeta.height}px\n`);

  // ── icon-512.png ────────────────────────────────────────────────────────
  await sharp(ICON_SRC)
    .resize(512, 512, { fit: "contain", background: { r: 255, g: 255, b: 255, alpha: 1 } })
    .png()
    .toFile(path.join(PUBLIC, "icon-512.png"));
  console.log("✓  icon-512.png");

  // ── icon-192.png ────────────────────────────────────────────────────────
  await sharp(ICON_SRC)
    .resize(192, 192, { fit: "contain", background: { r: 255, g: 255, b: 255, alpha: 1 } })
    .png()
    .toFile(path.join(PUBLIC, "icon-192.png"));
  console.log("✓  icon-192.png");

  // ── og-image.jpg (1200×630) ─────────────────────────────────────────────
  // Full wordmark centred on brand dark background
  await sharp(LOGO_SRC)
    .resize(900, 472, { fit: "contain", background: { r: 255, g: 255, b: 255, alpha: 1 } })
    .extend({ top: 79, bottom: 79, left: 150, right: 150, background: { r: 6, g: 6, b: 14, alpha: 1 } })
    .jpeg({ quality: 92, mozjpeg: true })
    .toFile(path.join(PUBLIC, "og-image.jpg"));
  console.log("✓  og-image.jpg");

  console.log("\nAll assets generated successfully!\n");
}

main().catch((err) => {
  console.error("Generation failed:", err);
  process.exit(1);
});
