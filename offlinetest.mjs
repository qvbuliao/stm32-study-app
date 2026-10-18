// ------------------------------------------------------------
// 验证离线可用性：Service Worker 注册 + 断网后仍能打开
// 用法：node offlinetest.mjs
//
// 做法：起一个本地 http 服务器（SW 需要 http/https，localhost 视为安全上下文），
//   1) 用 Chrome 打开页面，等 SW 激活
//   2) 用 CDP 把网络切成 offline
//   3) 重新导航，确认页面仍然渲染出内容
// ------------------------------------------------------------
import { spawn, execFileSync } from 'node:child_process';
import http from 'node:http';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const DIR = path.dirname(fileURLToPath(import.meta.url));
const CHROME = 'C:\\Users\\qv\\AppData\\Local\\Google\\Chrome\\Application\\chrome.exe';
const HTTP_PORT = 8123;
const CDP_PORT = 9341;
const OUT = path.join(os.tmpdir(), 'stm32offline');
fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });

const sleep = ms => new Promise(r => setTimeout(r, ms));
const TYPES = { '.html': 'text/html; charset=utf-8', '.png': 'image/png',
  '.webmanifest': 'application/manifest+json', '.js': 'text/javascript; charset=utf-8' };

// ---- 本地静态服务器（必须带正确 MIME，否则 SW 不会注册）----
const server = http.createServer((req, res) => {
  let rel = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  if (rel === '/') rel = '/index.html';
  const file = path.join(DIR, rel);
  if (!file.startsWith(DIR) || !fs.existsSync(file) || !fs.statSync(file).isFile()) {
    res.writeHead(404).end('nope'); return;
  }
  res.writeHead(200, {
    'Content-Type': TYPES[path.extname(file).toLowerCase()] || 'application/octet-stream',
    'Cache-Control': 'no-cache',
  });
  fs.createReadStream(file).pipe(res);
});
await new Promise(r => server.listen(HTTP_PORT, '127.0.0.1', r));
const URL_APP = `http://127.0.0.1:${HTTP_PORT}/index.html`;

// ---- 启动 Chrome ----
const chrome = spawn(CHROME, [
  '--headless=new', '--disable-gpu', '--no-sandbox',
  `--remote-debugging-port=${CDP_PORT}`,
  `--user-data-dir=${path.join(OUT, 'profile')}`,
  'about:blank',
], { stdio: 'ignore' });

let target = null;
for (let i = 0; i < 60; i++) {
  try {
    const list = await (await fetch(`http://127.0.0.1:${CDP_PORT}/json/list`)).json();
    target = list.find(t => t.type === 'page' && t.webSocketDebuggerUrl);
    if (target) break;
  } catch { }
  await sleep(200);
}
if (!target) { chrome.kill(); server.close(); throw new Error('Chrome 未就绪'); }

const ws = new WebSocket(target.webSocketDebuggerUrl);
await new Promise((res, rej) => { ws.onopen = res; ws.onerror = rej });
let id = 0; const pend = new Map(); const events = [];
ws.onmessage = e => {
  const m = JSON.parse(e.data);
  if (m.id && pend.has(m.id)) { const { res, rej } = pend.get(m.id); pend.delete(m.id); m.error ? rej(new Error(m.error.message)) : res(m.result); }
  else if (m.method) events.push(m);
};
const send = (method, params = {}) => new Promise((res, rej) => {
  const i = ++id; pend.set(i, { res, rej }); ws.send(JSON.stringify({ id: i, method, params }));
});
const evalJS = async expr =>
  (await send('Runtime.evaluate', { expression: expr, returnByValue: true, awaitPromise: true })).result.value;

await send('Page.enable');
await send('Runtime.enable');
await send('Network.enable');

const results = [];
const check = (name, ok, detail) => { results.push({ name, ok, detail }); console.log(`  ${ok ? '✓' : '✗'} ${name}${detail ? ' — ' + detail : ''}`); };

// ===== 1. 首次在线加载，确认 SW 注册成功 =====
await send('Page.navigate', { url: URL_APP });
await sleep(2500);

const swState = await evalJS(`(async()=>{
  if(!('serviceWorker' in navigator)) return 'NO_SW_API';
  const r = await navigator.serviceWorker.getRegistration();
  return r ? (r.active ? 'ACTIVE' : (r.installing ? 'INSTALLING' : (r.waiting?'WAITING':'REGISTERED_NO_ACTIVE'))) : 'NOT_REGISTERED';
})()`);
check('Service Worker 注册', swState === 'ACTIVE', String(swState));

// manifest 与图标可访问
const man = await evalJS(`fetch('manifest.webmanifest').then(r=>r.ok?'OK '+r.status:'FAIL '+r.status).catch(e=>'ERR')`);
check('manifest 可访问', man === 'OK 200', String(man));
const ico = await evalJS(`fetch('icon-192.png').then(r=>r.ok?'OK '+r.status:'FAIL '+r.status).catch(e=>'ERR')`);
check('图标可访问', ico === 'OK 200', String(ico));

// 确认内容真的渲染了
const nodesOnline = await evalJS(`document.querySelectorAll('main *').length`);
const planOK = await evalJS(`!!document.querySelector('[data-day="d5"]')`);
check('在线时内容渲染', nodesOnline > 500 && planOK, `${nodesOnline} 个节点`);

// ===== 2. 断网，重新导航 =====
await send('Network.emulateNetworkConditions', {
  offline: true, latency: 0, downloadThroughput: 0, uploadThroughput: 0,
});
await sleep(400);
events.length = 0;

await send('Page.navigate', { url: URL_APP });
await sleep(2500);

const offlineTitle = await evalJS(`document.title.slice(0,40)`);
const nodesOffline = await evalJS(`document.querySelectorAll('main *').length`);
const planOffline = await evalJS(`document.querySelectorAll('.day').length`);
const quizOffline = await evalJS(`document.querySelectorAll('.q').length`);
const stillRegistered = await evalJS(`!!navigator.serviceWorker.controller`);

check('断网后仍能打开（标题）', /STM32/.test(offlineTitle || ''), String(offlineTitle));
check('断网后内容完整', nodesOffline > 500, `${nodesOffline} 个节点`);
check('断网后计划页 5 天', planOffline === 5, `${planOffline} 天`);
check('断网后题库 30 题', quizOffline === 30, `${quizOffline} 题`);
check('断网时由 SW 接管', stillRegistered === true, String(stillRegistered));

// 断网时交互也要能用
const before = await evalJS(`document.getElementById('overall').textContent`);
await evalJS(`document.querySelector('input[data-task="d1t1"]').click()`);
await sleep(300);
const after = await evalJS(`document.getElementById('overall').textContent`);
check('断网时勾选仍可用', before !== after, `${before} → ${after}`);

// 恢复网络
await send('Network.emulateNetworkConditions', {
  offline: false, latency: 0, downloadThroughput: -1, uploadThroughput: -1,
});

ws.close(); chrome.kill(); server.close();
try { execFileSync('taskkill', ['/F', '/IM', 'chrome.exe'], { stdio: 'ignore' }); } catch { }

const fails = results.filter(r => !r.ok);
console.log(fails.length ? `\n✗ 离线验证失败 ${fails.length} 项` : '\n✓ 离线可用性验证全部通过');
process.exit(fails.length ? 1 : 0);
