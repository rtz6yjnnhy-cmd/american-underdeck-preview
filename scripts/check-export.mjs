// Validates the static export: every local URL referenced by the HTML (src,
// href, srcset, preload) and every image path the JS can request must carry
// the basePath and exist in out/. Exits non-zero on any problem.
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { ALL_WIDTHS } from "./image-config.mjs";

const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const out = path.resolve("out");
const problems = [];

const toFile = (url) => {
  const clean = url.split(/[?#]/)[0];
  if (base && !clean.startsWith(base + "/")) return null;
  let p = path.join(out, decodeURIComponent(clean.slice(base.length)));
  if (existsSync(p) && statSync(p).isDirectory()) p = path.join(p, "index.html");
  return p;
};

const htmlFiles = readdirSync(out, { recursive: true })
  .map(String)
  .filter((f) => f.endsWith(".html"));

let checked = 0;
for (const f of htmlFiles) {
  const html = readFileSync(path.join(out, f), "utf8");
  const urls = new Set();
  for (const m of html.matchAll(/\s(?:src|href)="([^"]+)"/g)) urls.add(m[1]);
  for (const m of html.matchAll(/\s(?:srcSet|srcset|imageSrcSet|imagesrcset)="([^"]+)"/g))
    for (const part of m[1].split(",")) urls.add(part.trim().split(/\s+/)[0]);
  for (const u of urls) {
    if (/^(https?:|mailto:|tel:|#|data:)/.test(u)) continue;
    checked++;
    const file = toFile(u);
    if (!file) problems.push(`${f}: missing basePath → ${u}`);
    else if (!existsSync(file)) problems.push(`${f}: not found → ${u}`);
  }
}

// Images referenced from content (rendered client-side too): every source in
// public/images must have a variant at every width.
const imgRoot = path.join(out, "images");
for (const rel of readdirSync(imgRoot, { recursive: true }).map(String)) {
  if (!/\.(jpe?g|png|webp)$/i.test(rel)) continue;
  const stem = rel.replace(/\.(jpe?g|png|webp)$/i, "");
  for (const w of ALL_WIDTHS) {
    checked++;
    const v = path.join(out, "_img", "images", `${stem}-${w}.webp`);
    if (!existsSync(v)) problems.push(`variant missing → _img/images/${stem}-${w}.webp`);
  }
}

// JS/CSS must load from the prefixed /_next path.
const index = readFileSync(path.join(out, "index.html"), "utf8");
if (base && /["'(]\/_next\//.test(index)) problems.push("index.html references /_next without basePath");

if (problems.length) {
  console.error(`check-export: ${problems.length} problem(s)\n` + problems.join("\n"));
  process.exit(1);
}
console.log(`check-export: OK — ${checked} references checked under "${base || "/"}"`);
