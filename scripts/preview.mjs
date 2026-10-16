// Serves the static export (out/) under the same basePath GitHub Pages uses,
// so subdirectory paths can be checked locally. No dependencies.
//   NEXT_PUBLIC_BASE_PATH=/american-underdeck-preview npm run build
//   npm run preview   → http://localhost:3002/american-underdeck-preview/
import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import http from "node:http";
import path from "node:path";

const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "/american-underdeck-preview";
const port = Number(process.env.PORT ?? 3002);
const root = path.resolve("out");
const types = {
  ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".css": "text/css",
  ".json": "application/json", ".svg": "image/svg+xml", ".webp": "image/webp",
  ".png": "image/png", ".jpg": "image/jpeg", ".woff2": "font/woff2", ".txt": "text/plain",
};

http
  .createServer(async (req, res) => {
    const url = decodeURIComponent((req.url ?? "/").split("?")[0]);
    if (!url.startsWith(base)) {
      res.writeHead(404).end(`Not under ${base}/`);
      return;
    }
    let file = path.join(root, url.slice(base.length));
    if (!file.startsWith(root)) return void res.writeHead(403).end();
    try {
      if ((await stat(file)).isDirectory()) file = path.join(file, "index.html");
      await stat(file);
    } catch {
      file = path.join(root, "404.html");
      res.statusCode = 404;
    }
    res.setHeader("Content-Type", types[path.extname(file)] ?? "application/octet-stream");
    createReadStream(file).pipe(res);
  })
  .listen(port, () => console.log(`Preview: http://localhost:${port}${base}/`));
