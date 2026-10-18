// ------------------------------------------------------------
// 生成 PWA 图标：用本机 Chrome 把 icon-source.html / icon-maskable-source.html
// 渲染成各尺寸 PNG。
// 用法：node icons.mjs
// ------------------------------------------------------------
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const DIR = path.dirname(fileURLToPath(import.meta.url));
const CHROME = process.env.CHROME_PATH ||
  [
    'C:\\Users\\qv\\AppData\\Local\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
  ].find(p => fs.existsSync(p)) ||
  null;

if (!CHROME) {
  console.error('找不到 Chrome。请设置环境变量 CHROME_PATH 指向 chrome.exe');
  process.exit(1);
}

const OUT = path.join(os.tmpdir(), 'stm32icons-build');
fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });

const JOBS = [
  { src: 'icon-source.html', out: 'icon-512.png', size: 512 },
  { src: 'icon-source.html', out: 'icon-192.png', size: 192 },
  { src: 'icon-maskable-source.html', out: 'icon-maskable-512.png', size: 512 },
];

for (const j of JOBS) {
  const srcAbs = path.join(DIR, j.src);
  if (!fs.existsSync(srcAbs)) { console.error(`缺少源文件 ${j.src}`); process.exit(1); }
  const tmpPng = path.join(OUT, j.out);
  execFileSync(CHROME, [
    '--headless=new', '--disable-gpu', '--no-sandbox', '--hide-scrollbars',
    `--user-data-dir=${path.join(OUT, 'profile')}`,
    `--window-size=${j.size},${j.size}`,
    '--force-device-scale-factor=1',
    `--screenshot=${tmpPng}`,
    '--virtual-time-budget=3000',
    `file:///${srcAbs.replace(/\\/g, '/')}`,
  ], { stdio: 'pipe', timeout: 60000 });

  if (!fs.existsSync(tmpPng)) { console.error(`渲染失败: ${j.out}`); process.exit(1); }
  fs.copyFileSync(tmpPng, path.join(DIR, j.out));
  const kb = (fs.statSync(tmpPng).size / 1024).toFixed(1);
  console.log(`  ${j.out.padEnd(26)} ${j.size}×${j.size}  ${kb} KB`);
}

console.log(`\n图标已更新（共 ${JOBS.length} 个）。`);
console.log('提示：改动图标后，记得把 sw.js 里的 CACHE 版本号 +1，让手机端更新缓存。');
