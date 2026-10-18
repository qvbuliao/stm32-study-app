// ------------------------------------------------------------
// 极简局域网静态服务器 —— 让手机浏览器直接打开 STM32 App
// 用法：node serve.mjs [端口]        默认 8000
// 停止：Ctrl+C（或关掉这个窗口）
// ------------------------------------------------------------
import http from 'node:http';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const DIR = path.dirname(fileURLToPath(import.meta.url));
const PORT = Number(process.argv[2] || process.env.PORT || 8000);
const ENTRY = '/stm32.html';

// 只有这些后缀会被提供，避免把源码/脚本暴露给局域网
const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.webmanifest': 'application/manifest+json',
};

const server = http.createServer((req, res) => {
  let rel;
  try {
    rel = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
  } catch {
    res.writeHead(400).end('bad request');
    return;
  }
  if (rel === '/' || rel === '') rel = ENTRY;

  // 阻止目录穿越
  const file = path.resolve(DIR, '.' + rel);
  if (!file.startsWith(DIR + path.sep)) {
    res.writeHead(403).end('forbidden');
    return;
  }
  if (!fs.existsSync(file) || !fs.statSync(file).isFile()) {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('404 — 只提供 ' + ENTRY);
    return;
  }
  const type = TYPES[path.extname(file).toLowerCase()];
  if (!type) {
    res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('403 — 该文件类型不对外提供');
    return;
  }

  res.writeHead(200, {
    'Content-Type': type,
    'Cache-Control': 'no-cache',           // 手机上总是拿到最新版
    'X-Content-Type-Options': 'nosniff',
  });
  fs.createReadStream(file).pipe(res);
});

server.on('error', err => {
  console.error('\n启动失败：' + err.message);
  if (err.code === 'EADDRINUSE') console.error(`端口 ${PORT} 已被占用，换一个：node serve.mjs 8080`);
  process.exit(1);
});

server.listen(PORT, '0.0.0.0', () => {
  const urls = [];
  for (const [name, addrs] of Object.entries(os.networkInterfaces())) {
    for (const a of addrs || []) {
      if (a.family === 'IPv4' && !a.internal) urls.push({ name, url: `http://${a.address}:${PORT}${ENTRY}` });
    }
  }
  console.log('='.repeat(62));
  console.log('STM32 App 已在局域网提供，服务目录：');
  console.log('  ' + DIR);
  console.log('='.repeat(62));
  console.log('\n手机浏览器输入下面任意一条（和电脑连同一个 WiFi）：\n');
  urls.forEach(u => console.log(`  [${u.name}]  ${u.url}`));
  console.log('\n如果打不开：确认手机和电脑在同一 WiFi；');
  console.log('Windows 弹出防火墙提示时点「允许访问」。');
  console.log('\n按 Ctrl+C 停止服务。');
});
