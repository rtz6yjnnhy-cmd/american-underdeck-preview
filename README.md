# American Underdeck Systems — Unofficial Website Concept

A single-page design concept created as a portfolio demonstration. **Not the company's website and not affiliated with or endorsed by American Underdeck Systems.** Photography and videos © American Underdeck Systems.

Stack: Next.js 14 (App Router, static export), TypeScript, Tailwind CSS 3, Framer Motion, React Three Fiber (three 0.172).

## Run locally

```bash
npm install
npm run dev                 # http://localhost:3000 (generates image variants first)
```

Preview the production export exactly as GitHub Pages serves it (under the repository path):

```bash
NEXT_PUBLIC_BASE_PATH=/american-underdeck-demo npm run build
NEXT_PUBLIC_BASE_PATH=/american-underdeck-demo npm run check:export
npm run preview             # http://localhost:3002/american-underdeck-demo/
```

On Windows Git Bash, prefix those commands with `MSYS_NO_PATHCONV=1` so the path isn't rewritten.

## Publish on GitHub Pages

1. Create the repository (suggested: `american-underdeck-demo`) and push this project to `main`.
2. Repository **Settings → Pages → Build and deployment → Source: GitHub Actions**.
3. Every push to `main` runs `.github/workflows/deploy-pages.yml`: type check, lint, build, path validation, deploy.
   The repository name becomes the `basePath`, so the site is served at `https://<owner>.github.io/<repository>/`.

No secrets or environment variables need to be configured.

If you later use a custom domain or a `<owner>.github.io` repository (site at the domain root), set `NEXT_PUBLIC_BASE_PATH` to an empty string in the workflow.

## How static export works here

- `next.config.mjs`: `output: "export"`, `basePath`/`assetPrefix` from `NEXT_PUBLIC_BASE_PATH`, `trailingSlash: true`.
- Images: GitHub Pages has no image optimizer, so `scripts/optimize-images.mjs` (runs before `dev` and `build`) pre-renders every file in `public/images` as WebP at each srcset width into `public/_img/` (generated, git-ignored). `src/lib/image-loader.ts` points `next/image` at those files. YouTube thumbnails load directly from YouTube.
- `scripts/check-export.mjs` verifies every exported URL carries the basePath and exists in `out/`.

## Content

- All facts come from americanunderdecksystems.com; nothing is invented.
- Videos are embedded from the official YouTube channel `@americanunderdecksystems6811` (privacy-enhanced, loaded on tap).
- The estimate form is front-end only: it validates input and sends nothing.
- The 3D section is an illustrative visualization, not an engineering drawing.
- Pages are `noindex` on purpose.
