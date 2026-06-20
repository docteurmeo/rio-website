import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Serve from this file's own directory, so the repo runs anywhere it's cloned.
const ROOT = path.dirname(fileURLToPath(import.meta.url));
const PORT = 8899;

http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  const urlPath = decodeURIComponent(req.url.split('?')[0]);
  const filePath = path.normalize(path.join(ROOT, urlPath));
  if (filePath !== ROOT && !filePath.startsWith(ROOT + path.sep)) { res.writeHead(403); return res.end('forbidden'); }
  fs.readFile(filePath, (err, data) => {
    if (err) { res.writeHead(404); return res.end('not found'); }
    const ext = path.extname(filePath);
    const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.json': 'application/json; charset=utf-8', '.svg': 'image/svg+xml', '.js': 'text/javascript', '.ttf': 'font/ttf', '.otf': 'font/otf', '.woff2': 'font/woff2' };
    const type = types[ext] || 'text/plain; charset=utf-8';
    res.writeHead(200, { 'Content-Type': type });
    res.end(data);
  });
}).listen(PORT, '127.0.0.1', () => console.log('serving on http://127.0.0.1:' + PORT));
