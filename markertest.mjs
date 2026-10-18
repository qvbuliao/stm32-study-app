// 检查 md() 是否漏渲染任何 [xxx] 标记（除已支持的 blockquote/heading 前缀）
import fs from 'node:fs';
const html = fs.readFileSync('template.html', 'utf8');
const m = html.match(/function esc\(s\)\{[\s\S]*?\/\* ---------- 进度存储/);
const md = new Function(m[0].replace(/\/\* ----------[\s\S]*$/, '') + '\nreturn md;')();

const data = fs.readFileSync('data.js', 'utf8') + '\n' + fs.readFileSync('data2.js', 'utf8');
const { PLAN, COURSES, CSURV, REF, QUIZ } = new Function(
  data + '\nreturn {PLAN,COURSES,CSURV,REF,QUIZ};')();

const KNOWN = new Set(['warn', 'ok', 'bad', 'h2', 'h3', 'h4', 'c', 'text', 'asm']);
const hits = new Map();
const scan = (tag, src) => {
  const out = md(src);
  const lines = src.split('\n').filter(l => /^\s*\[[a-z0-9]+\]/.test(l));
  lines.forEach(l => {
    const k = l.match(/^\s*\[([a-z0-9]+)\]/)[1];
    if (!KNOWN.has(k)) hits.set(k, (hits.get(k) || 0) + 1);
  });
  // 输出里不应残留未解析的 [xxx] 行标记（除了被转义的）
  const stray = out.match(/<p>(?:\[[a-z0-9]+\][^<]*?)<\/p>/g) || [];
  stray.forEach(s => hits.set('STRAY:' + s.slice(0, 40), (hits.get('STRAY:' + s.slice(0, 40)) || 0) + 1));
};
PLAN.forEach(d => scan(d.id, d.goal));
COURSES.forEach(c => c.items.forEach(i => scan(i.id, i.body)));
CSURV.forEach(g => scan(g.t, g.body));
REF.forEach(g => scan(g.t, g.body));
QUIZ.forEach((q, i) => scan('Q' + (i + 1), q.q));

console.log('未知标记:', hits.size ? [...hits.entries()] : '无');
