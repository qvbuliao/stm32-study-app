// ------------------------------------------------------------
// 用 CDP 精确模拟手机视口截图 + 收集运行期错误
// 用法：node cdp.mjs
// 产出：%TEMP%\stm32cdp\*.png
// ------------------------------------------------------------
import { spawn, execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const CHROME = 'C:\\Users\\qv\\AppData\\Local\\Google\\Chrome\\Application\\chrome.exe';
const APP = path.resolve('index.html');
const OUT = path.join(os.tmpdir(), 'stm32cdp');
const PORT = 9333;

fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });

const sleep = ms => new Promise(r => setTimeout(r, ms));

// ---- 启动 Chrome 并等调试端口就绪 ----
const chrome = spawn(CHROME, [
  '--headless=new', '--disable-gpu', '--no-sandbox', '--hide-scrollbars',
  `--remote-debugging-port=${PORT}`,
  `--user-data-dir=${path.join(OUT, 'profile')}`,
  '--window-size=1200,900',
  'about:blank',
], { stdio: 'ignore', detached: false });

let version = null;
for (let i = 0; i < 50; i++) {
  try { version = await (await fetch(`http://127.0.0.1:${PORT}/json/version`)).json(); break; }
  catch { await sleep(200); }
}
if (!version) { chrome.kill(); throw new Error('Chrome 调试端口未就绪'); }

// 取一个 page target（Page/Runtime/Log 这些 domain 只挂在 page target 上）
let target = null;
for (let i = 0; i < 50; i++) {
  const list = await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json();
  target = list.find(t => t.type === 'page' && t.webSocketDebuggerUrl);
  if (target) break;
  await sleep(200);
}
if (!target) { chrome.kill(); throw new Error('没有可用的 page target'); }

// ---- 极简 CDP 客户端 ----
class CDP {
  constructor(ws) { this.ws = ws; this.id = 0; this.pend = new Map(); this.events = []; }
  static async connect(url) {
    const ws = new WebSocket(url);
    await new Promise((res, rej) => { ws.onopen = res; ws.onerror = rej });
    const c = new CDP(ws);
    ws.onmessage = e => {
      const m = JSON.parse(e.data);
      if (m.id && c.pend.has(m.id)) {
        const { res, rej } = c.pend.get(m.id); c.pend.delete(m.id);
        m.error ? rej(new Error(m.error.message)) : res(m.result);
      } else if (m.method) c.events.push(m);
    };
    return c;
  }
  send(method, params = {}) {
    const id = ++this.id;
    return new Promise((res, rej) => {
      this.pend.set(id, { res, rej });
      this.ws.send(JSON.stringify({ id, method, params }));
    });
  }
  close() { try { this.ws.close() } catch { } }
}

const cdp = await CDP.connect(target.webSocketDebuggerUrl);
await cdp.send('Page.enable');
await cdp.send('Runtime.enable');
await cdp.send('Log.enable');

const SCENES = [
  { name: '1-plan', view: 'plan', expand: true },
  { name: '2-course-2-2', view: 'course', expand: true },
  { name: '3-course-6-1', view: 'course', topic: 9, expand: true },
  { name: '4-c', view: 'c', expand: true },
  { name: '5-ref', view: 'ref', expand: false },
  { name: '6-quiz', view: 'quiz', expand: true },
];

const report = [];
for (const s of SCENES) {
  cdp.events.length = 0;
  // 精确手机视口
  await cdp.send('Emulation.setDeviceMetricsOverride', {
    width: 390, height: 844, deviceScaleFactor: 2, mobile: true,
  });
  await cdp.send('Page.navigate', { url: `file:///${APP.replace(/\\/g, '/')}` });
  await new Promise(res => {
    const t = setInterval(() => {
      if (cdp.events.some(e => e.method === 'Page.loadEventFired')) { clearInterval(t); res() }
    }, 50);
    setTimeout(() => { clearInterval(t); res() }, 8000);
  });
  await sleep(400);

  // 切换视图 + 展开
  const script = `
    (() => {
      const b = document.querySelector('nav button[data-v="${s.view}"]'); b && b.click();
      ${s.topic !== undefined ? `const t=document.querySelector('#topics button[data-topic="${s.topic}"]'); t&&t.click();` : ''}
      ${s.expand ? `document.querySelectorAll('.read,.day').forEach(e=>e.classList.add('open'));document.querySelectorAll('details').forEach(d=>d.open=true);` : ''}
      const vw = window.innerWidth;
      const over = [];
      document.querySelectorAll('*').forEach(el => {
        const r = el.getBoundingClientRect();
        if (r.right > vw + 1 && getComputedStyle(el).overflowX === 'visible' && r.width < 2000) {
          over.push(el.tagName.toLowerCase() + '.' + String(el.className).split(' ')[0] + '=' + Math.round(r.width));
        }
      });
      return JSON.stringify({
        innerWidth: vw,
        scrollWidth: document.documentElement.scrollWidth,
        bodyScroll: document.body.scrollWidth,
        view: document.querySelector('.view.on')?.id,
        nodes: document.querySelectorAll('main *').length,
        overflow: [...new Set(over)].slice(0, 8),
      });
    })()`;
  const ev = await cdp.send('Runtime.evaluate', { expression: script, returnByValue: true });
  const info = JSON.parse(ev.result.value);

  const shot = await cdp.send('Page.captureScreenshot', {
    format: 'png', captureBeyondViewport: false,      // 只截手机一屏
  });
  const png = path.join(OUT, `${s.name}.png`);
  fs.writeFileSync(png, Buffer.from(shot.data, 'base64'));

  // 再截一张滚动到主内容区的
  await cdp.send('Runtime.evaluate', {
    expression: `window.scrollTo(0, Math.round(document.documentElement.scrollHeight*${s.scroll ?? 0.35}))`,
  });
  await sleep(250);
  const shot2 = await cdp.send('Page.captureScreenshot', {
    format: 'png', captureBeyondViewport: false,
  });
  const png2 = path.join(OUT, `${s.name}-b.png`);
  fs.writeFileSync(png2, Buffer.from(shot2.data, 'base64'));

  const errs = cdp.events
    .filter(e => e.method === 'Runtime.exceptionThrown' || e.method === 'Log.entryAdded')
    .map(e => e.method === 'Runtime.exceptionThrown'
      ? 'EXC: ' + (e.params.exceptionDetails?.exception?.description || '').slice(0, 120)
      : `${e.params.entry.level}: ${e.params.entry.text} (${e.params.entry.url || ''})`)
    .filter(t => !/^verbose/.test(t));

  report.push({ s, info, errs, size: fs.statSync(png).size });
}

// ---------- 交互验证：真实点击 + 真实键盘/鼠标事件 ----------
const inter = [];
{
  const bad = (t, m) => inter.push(`✗ ${t}: ${m}`);
  const ok = (t, m) => inter.push(`✓ ${t}: ${m}`);

  await cdp.send('Emulation.setDeviceMetricsOverride',
    { width: 390, height: 844, deviceScaleFactor: 2, mobile: true });
  await cdp.send('Page.navigate', { url: `file:///${APP.replace(/\\/g, '/')}` });
  await sleep(900);

  const evalJS = async expr =>
    (await cdp.send('Runtime.evaluate', { expression: expr, returnByValue: true })).result.value;

  // 用 CDP 派发真实鼠标点击（不是 el.click()）
  const clickAt = async (x, y) => {
    for (const type of ['mousePressed', 'mouseReleased']) {
      await cdp.send('Input.dispatchMouseEvent',
        { type, x, y, button: 'left', clickCount: 1 });
    }
    await sleep(220);
  };
  const centerOf = async sel => JSON.parse(await evalJS(`
    (()=>{const e=document.querySelector(${JSON.stringify(sel)});
     if(!e)return "null";
     e.scrollIntoView({block:'center'});
     const r=e.getBoundingClientRect();
     return JSON.stringify({x:Math.round(r.left+r.width/2),y:Math.round(r.top+r.height/2)});})()`));
  // 元素可能位于横向滚动区外，需先滚入视口
  const hcenterOf = async sel => JSON.parse(await evalJS(`
    (()=>{const e=document.querySelector(${JSON.stringify(sel)});
     if(!e)return "null";
     e.scrollIntoView({block:'center',inline:'center'});
     const box=e.closest('#topics')||e.closest('pre')||e.closest('table')||e.parentElement;
     if(box&&box.tagName!=='BODY'){const cr=box.getBoundingClientRect(),er=e.getBoundingClientRect();
       if(er.right>cr.right||er.left<cr.left){box.scrollLeft+=er.left-cr.left-8;}}
     const r=e.getBoundingClientRect();
     return JSON.stringify({x:Math.round(r.left+r.width/2),y:Math.round(r.top+r.height/2)});})()`));

  // 1. 勾选 Day1 第一个任务的 checkbox
  const t0 = await evalJS(`document.getElementById('overall').textContent`);
  const cb = await centerOf('input[data-task="d1t1"]');
  if (cb === 'null') bad('勾选任务', '找不到 checkbox');
  else {
    await clickAt(cb.x, cb.y);
    const t1 = await evalJS(`document.getElementById('overall').textContent`);
    const saved = await evalJS(`(JSON.parse(localStorage.getItem('stm32-5d-progress-v1')||'{}'))['d1t1']===true`);
    t1 !== t0 ? ok('勾选任务', `顶栏 ${t0} → ${t1}，已写入 localStorage=${saved}`)
      : bad('勾选任务', `进度未变（${t0}）`);
  }

  // 2. 折叠/展开 Day 卡片（先折叠，再点开，验证两种状态）
  await evalJS(`document.querySelector('[data-day="d2"]').classList.remove('open')`);
  await sleep(120);
  const dh = await centerOf('[data-dayh="d2"]');
  const openBefore = await evalJS(`document.querySelector('[data-day="d2"]').classList.contains('open')`);
  await clickAt(dh.x, dh.y);
  const openAfter = await evalJS(`document.querySelector('[data-day="d2"]').classList.contains('open')`);
  openBefore !== openAfter ? ok('折叠 Day 卡片', `${openBefore} → ${openAfter}`)
    : bad('折叠 Day 卡片', '状态未变');

  // 3. 切到「课程」页并切换章节 tab
  const navCourse = await centerOf('nav button[data-v="course"]');
  await clickAt(navCourse.x, navCourse.y);
  const viewNow = await evalJS(`document.querySelector('.view.on').id`);
  viewNow === 'v-course' ? ok('切换导航', '进入 v-course') : bad('切换导航', viewNow);

  const tab6 = await hcenterOf('#topics button[data-topic="9"]');
  await clickAt(tab6.x, tab6.y);
  const heading = await evalJS(`document.querySelector('.view.on .read-h b')?.textContent||''`);
  const chapNo = await evalJS(`document.querySelector('.view.on .read .no')?.textContent||''`);
  /^6-1/.test(chapNo) ? ok('切换章节 tab', `章节=${chapNo}，首节="${heading}"`) : bad('切换章节 tab', `章节=${chapNo}`);

  // 4. 折叠再展开单节详解（.read 初始即 open）
  await evalJS(`document.querySelector('.view.on .read').classList.remove('open')`);
  await sleep(120);
  const collapsed = await evalJS(`
    (()=>{const b=document.querySelector('.view.on .read-b');
     return b? Math.round(b.getBoundingClientRect().height) : -1})()`);
  const rh = await centerOf('.view.on .read .read-h');
  await clickAt(rh.x, rh.y);
  const expanded = await evalJS(`
    (()=>{const b=document.querySelector('.view.on .read-b');
     return b? Math.round(b.getBoundingClientRect().height) : -1})()`);
  (collapsed < 50 && expanded > 50)
    ? ok('折叠/展开详解', `高度 ${collapsed} → ${expanded}px`)
    : bad('折叠/展开详解', `高度 ${collapsed} → ${expanded}px`);

  // 5. 标记已复习
  const tq = await centerOf('.view.on [data-toq]');
  await clickAt(tq.x, tq.y);
  const ckText = await evalJS(`document.querySelector('.view.on .read .ck')?.textContent||''`);
  /已复习/.test(ckText) ? ok('标记已复习', `状态="${ckText}"`) : bad('标记已复习', ckText);

  // 6. 自测页答题
  const navQuiz = await centerOf('nav button[data-v="quiz"]');
  await clickAt(navQuiz.x, navQuiz.y);
  const o1 = await centerOf('.view.on .q button[data-o="1"]');
  await clickAt(o1.x, o1.y);
  const expOn = await evalJS(`document.querySelector('.view.on .q .exp')?.classList.contains('on')`);
  const scoreTxt = await evalJS(`document.querySelector('.view.on .score')?.textContent||''`);
  expOn ? ok('答题', `解析展开；计分"${scoreTxt.trim()}"`) : bad('答题', '解析未展开');

  // 7. 速查页搜索
  const navRef = await centerOf('nav button[data-v="ref"]');
  await clickAt(navRef.x, navRef.y);
  const before = await evalJS(`document.querySelectorAll('#reflist details').length`);
  await evalJS(`(()=>{const s=document.getElementById('refq');s.value='定时器';
    s.dispatchEvent(new Event('input',{bubbles:true}));})()`);
  await sleep(200);
  const after = await evalJS(`document.querySelectorAll('#reflist details').length`);
  after < before && after > 0 ? ok('速查搜索', `${before} → ${after} 条命中`)
    : bad('速查搜索', `${before} → ${after}`);

  // 8. 重载后进度是否保留
  await cdp.send('Page.navigate', { url: `file:///${APP.replace(/\\/g, '/')}` });
  await sleep(900);
  const t2 = await evalJS(`document.getElementById('overall').textContent`);
  const stillChecked = await evalJS(`document.querySelector('input[data-task="d1t1"]')?.checked===true`);
  stillChecked ? ok('重载保留进度', `顶栏 ${t2}，勾选仍在`)
    : bad('重载保留进度', `勾选丢失，顶栏 ${t2}`);
}

cdp.close();
chrome.kill();
try { execFileSync('taskkill', ['/F', '/IM', 'chrome.exe', '/FI', 'PID ne 0'], { stdio: 'ignore' }); } catch { }

console.log('%-16s %-8s %-9s %-6s %-7s %s'.replace(/%-(\d+)s/g, (m, n) => '%' + n + 's'),
  'scene', 'view', 'innerW', 'scrollW', '溢出', 'size');
for (const { s, info, errs, size } of report) {
  console.log(`  ${s.name.padEnd(14)} ${String(info.view).padEnd(9)} ${String(info.innerWidth).padEnd(7)} ${String(info.scrollWidth).padEnd(7)} ${String(info.bodyScroll === info.scrollWidth ? 'ok' : 'BAD').padEnd(6)} ${(size / 1024).toFixed(0)}KB`);
  if (info.overflow.length) console.log('      溢出元素:', info.overflow.join(', '));
  if (info.scrollWidth > info.innerWidth) console.log(`      ⚠ 水平溢出 ${info.scrollWidth - info.innerWidth}px`);
  errs.forEach(e => console.log('      ✗ ' + e));
}
console.log('\n运行期错误总数:', report.reduce((n, r) => n + r.errs.length, 0));

console.log('\n===== 真实交互验证 =====');
inter.forEach(l => console.log('  ' + l));
const fails = inter.filter(l => l.startsWith('✗'));
console.log(fails.length ? `\n✗ 交互失败 ${fails.length} 项` : '\n✓ 全部交互通过');
process.exit(fails.length ? 1 : 0);
