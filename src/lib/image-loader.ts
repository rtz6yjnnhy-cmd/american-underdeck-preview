// Static-export image loader (GitHub Pages has no image optimizer).
// Maps a local /images/... source + requested width to the WebP variant
// pre-rendered by scripts/optimize-images.mjs, prefixed with the basePath.
// Remote images (YouTube thumbnails) use `unoptimized` and never reach here.

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export default function imageLoader({ src, width }: { src: string; width: number; quality?: number }) {
  if (/^https?:\/\//.test(src)) return src;
  const withoutExt = src.replace(/\.(jpe?g|png|webp)$/i, "");
  return `${basePath}/_img${withoutExt}-${width}.webp`;
}
