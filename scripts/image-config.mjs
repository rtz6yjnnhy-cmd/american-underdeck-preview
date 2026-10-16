// Single source of truth for responsive image widths. next.config.mjs uses it
// to build srcsets; optimize-images.mjs pre-renders one WebP per width, because
// GitHub Pages has no image optimization server.
export const DEVICE_SIZES = [640, 828, 1080, 1200, 1920];
export const IMAGE_SIZES = [96, 256, 384];
export const ALL_WIDTHS = [...IMAGE_SIZES, ...DEVICE_SIZES];
export const SOURCE_DIR = "public/images";
export const OUTPUT_DIR = "public/_img";
export const QUALITY = 85;
