// ------------------------------------------------------------
// 构建单文件 App —— 把数据内联进 template.html 外壳，产出单文件
//   index.html    默认入口（GitHub Pages / 本地预览）
//   STM32-5天速通.html  用户友好名（传手机用）
//   stm32.html    ASCII 名（局域网服务用）
//
// 用法：node build.mjs
// ------------------------------------------------------------
import fs from 'node:fs';

const SRC = ['data.js', 'data2.js'];          // 数据源
const SHELL = 'template.html';               // HTML/CSS/渲染引擎外壳
const OUT = 'index.html';                    // 默认入口名 —— GitHub Pages 直接可用
const OUT_USER = 'STM32-5天速通.html';       // 用户友好名（微信/文件管理器里认得出）
const OUT_ASCII = 'stm32.html';              // ASCII 名（局域网服务 / URL 传输用）

// ---- 1. 规范化代码块围栏 --------------------------------------
// 数据文件在模板字符串内，故围栏统一写作 \`\`\`（转义的反引号）
const FENCE = '\\`\\`\\`';
const OPEN = /^\s*\[\[\[[a-z0-9]*\]?\s*$/;
const CLOSE = /^\s*\]\]+\s*$/;
const TICK = /^\s*\\?`{2,}\s*$/;

let fixed = 0;
for (const f of SRC) {
  const lines = fs.readFileSync(f, 'utf8').split('\n');
  for (let i = 0; i < lines.length; i++) {
    const L = lines[i];
    if ((OPEN.test(L) || CLOSE.test(L) || TICK.test(L)) && L.trim() !== FENCE) {
      lines[i] = L.match(/^\s*/)[0] + FENCE;
      fixed++;
    }
  }
  fs.writeFileSync(f, lines.join('\n'), 'utf8');
}

// ---- 2. 内联数据，生成单文件 ----------------------------------
const read = f => fs.readFileSync(f, 'utf8').replace(/\s*\/\*__TAIL__\*\/\s*$/, '');
const data = SRC.map(read).join('\n');

const shell = fs.readFileSync(SHELL, 'utf8');
if (!shell.includes('/*__DATA__*/')) throw new Error(`${SHELL} 缺少 /*__DATA__*/ 占位符`);
if (/<\/script/i.test(data)) throw new Error('数据中含有 </script，会破坏单文件结构');

const out = shell.replace('/*__DATA__*/', '\n' + data + '\n');
fs.writeFileSync(OUT, out, 'utf8');            // 默认入口（GitHub Pages / 本地预览）
fs.writeFileSync(OUT_USER, out, 'utf8');       // 传手机用
fs.copyFileSync(OUT, OUT_ASCII);               // 局域网服务用

console.log(`围栏规范化: ${fixed} 行`);
console.log(`输出 ${OUT} / ${OUT_USER} / ${OUT_ASCII}: ${(out.length / 1024).toFixed(1)} KB（同一内容，三个文件名）`);
