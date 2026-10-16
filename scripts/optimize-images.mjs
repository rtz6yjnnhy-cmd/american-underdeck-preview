// Pre-renders every image under public/images into WebP variants at each
// configured width: public/_img/<path-without-ext>-<width>.webp
// Skips files that are already up to date, so repeated runs are fast.
import { mkdir, readdir, stat } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { ALL_WIDTHS, OUTPUT_DIR, QUALITY, SOURCE_DIR } from "./image-config.mjs";

const exts = new Set([".jpg", ".jpeg", ".png", ".webp"]);

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(full);
    else if (exts.has(path.extname(entry.name).toLowerCase())) yield full;
  }
}

async function isFresh(out, srcMtime) {
  try {
    return (await stat(out)).mtimeMs >= srcMtime;
  } catch {
    return false;
  }
}

let made = 0;
let skipped = 0;
for await (const file of walk(SOURCE_DIR)) {
  const rel = path.relative(SOURCE_DIR, file);
  const base = rel.slice(0, -path.extname(rel).length);
  const srcMtime = (await stat(file)).mtimeMs;
  const outDir = path.join(OUTPUT_DIR, "images", path.dirname(rel));
  await mkdir(outDir, { recursive: true });
  for (const w of ALL_WIDTHS) {
    const out = path.join(OUTPUT_DIR, "images", `${base}-${w}.webp`);
    if (await isFresh(out, srcMtime)) {
      skipped++;
      continue;
    }
    await sharp(file)
      .resize({ width: w, withoutEnlargement: true })
      .webp({ quality: QUALITY, effort: 5 })
      .toFile(out);
    made++;
  }
}
console.log(`optimize-images: ${made} written, ${skipped} up to date → ${OUTPUT_DIR}`);
