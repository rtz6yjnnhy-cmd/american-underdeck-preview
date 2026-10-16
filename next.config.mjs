import { DEVICE_SIZES, IMAGE_SIZES } from "./scripts/image-config.mjs";

// GitHub Pages serves a project site from /<repository-name>. The workflow sets
// NEXT_PUBLIC_BASE_PATH (e.g. "/american-underdeck-demo"); locally it is empty.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  basePath,
  assetPrefix: basePath || undefined,
  trailingSlash: true,
  images: {
    // No optimizer on a static host: srcsets point at WebP variants
    // pre-rendered at build time (scripts/optimize-images.mjs).
    loader: "custom",
    loaderFile: "./src/lib/image-loader.ts",
    deviceSizes: DEVICE_SIZES,
    imageSizes: IMAGE_SIZES,
  },
};

export default nextConfig;
