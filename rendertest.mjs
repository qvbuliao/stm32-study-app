// 渲染验证：抽出 template.html 的 md() 渲染器，在 Node 中跑遍所有内容
import fs from 'node:fs';

const html = fs.readFileSync('template.html', 'utf8');
const m = html.match(/function esc\(s\)\{[\s\S]*?\/\* ---------- 进度存储/);
if (!m) throw new Error('未能从 template.html 抽出 md() 渲染器');
const src = m[0].replace(/\/\* ----------[\s\S]*$/, '');
const md = new Function(src + '\nreturn md;')();

const data = fs.readFileSync('data.js', 'utf8') + '\n' + fs.readFileSync('data2.js', 'utf8');
const { PLAN, COURSES, CSURV, REF, QUIZ } = new Function(
  data + '\nreturn {PLAN,COURSES,CSURV,REF,QUIZ};')();

// 检查 HTML 标签配对
const VOID = new Set(['br', 'hr', 'img', 'input', 'meta', 'link']);
function checkTags(tag, out) {
  const stack = [];
  const re = /<\/?([a-z0-9]+)[^>]*?(\/?)>/g;
  let mm;
  while ((mm = re.exec(out))) {
    const [full, name, selfClose] = mm;
    if (!/^(p|div|pre|code|table|tr|td|th|blockquote|ul|ol|li|h2|h3|h4|b|span)$/.test(name)) continue;
    if (full.startsWith('</')) {
      if (stack.pop() !== name) return `${tag}: 标签不匹配 → ${full}`;
    } else if (!selfClose && !VOID.has(name)) stack.push(name);
  }
  return stack.length ? `${tag}: 未闭合 → ${stack.join(',')}` : null;
}

const problems = [];
let calls = 0;
const run = (tag, src) => {
  calls++;
  let out;
  try { out = md(src); } catch (e) { problems.push(`${tag}: 渲染抛异常 ${e.message}`); return; }
  const t = checkTags(tag, out);
  if (t) problems.push(t);
  if (/\[\[|\]\]/.test(out)) problems.push(`${tag}: 输出残留未渲染标记`);
  if (/&lt;b&gt;|&lt;code&gt;/.test(out)) problems.push(`${tag}: 标记被转义（未解析）`);
};

PLAN.forEach(d => { run('goal:' + d.id, d.goal); });
COURSES.forEach(c => c.items.forEach(i => run('body:' + i.id, i.body)));
CSURV.forEach(g => run('CSURV:' + g.t.slice(0, 12), g.body));
REF.forEach(g => run('REF:' + g.t.slice(0, 12), g.body));
QUIZ.forEach((q, i) => run('Q' + (i + 1), q.q));

console.log('渲染调用次数:', calls);
console.log('问题数:', problems.length);
problems.slice(0, 25).forEach(p => console.log('  ✗ ' + p));

// 抽样看一段输出，确认结构正确
const demo = md(COURSES.find(c => c.p === '6-1').items[1].body);
console.log('\n--- [6-1] 时基单元 渲染输出片段 ---');
console.log(demo.slice(0, 900));
