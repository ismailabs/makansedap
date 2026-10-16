import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root = path.resolve(fileURLToPath(new URL('../site/', import.meta.url)));
const types = {'.html':'text/html; charset=utf-8','.css':'text/css','.js':'text/javascript','.svg':'image/svg+xml','.webp':'image/webp','.png':'image/png','.woff2':'font/woff2','.txt':'text/plain'};
export function startServer(port = 8000) {
  const server = http.createServer(async (req, res) => {
    try {
      const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
      let target = path.resolve(root, '.' + pathname);
      if (target !== root && !target.startsWith(root + path.sep)) { res.writeHead(403).end(); return; }
      if ((await stat(target)).isDirectory()) {
        if (!pathname.endsWith('/')) { res.writeHead(301, {Location: pathname + '/'}).end(); return; }
        target = path.join(target, 'index.html');
      }
      const body = await readFile(target);
      res.writeHead(200, {'Content-Type':types[path.extname(target)] || 'application/octet-stream','X-Robots-Tag':'index, follow','X-Content-Type-Options':'nosniff','Cache-Control':'no-cache'});
      res.end(body);
    } catch { res.writeHead(404, {'Content-Type':'text/plain'}).end('Not found'); }
  });
  return new Promise(resolve => server.listen(port, '127.0.0.1', () => resolve(server)));
}
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  await startServer(Number(process.env.PORT || 8000));
  console.log(`MakanSedap preview: http://127.0.0.1:${process.env.PORT || 8000}/`);
}
