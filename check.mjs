// ------------------------------------------------------------
// 数据自检：结构完整性、ID 唯一性、标记配对、答案索引
// 用法：node check.mjs
// ------------------------------------------------------------
import fs from 'node:fs';

const src = fs.readFileSync('data.js', 'utf8') + '\n' + fs.readFileSync('data2.js', 'utf8');
const { PLAN, COURSES, CSURV, REF, QUIZ } = new Function(
  src + '\nreturn {PLAN,COURSES,CSURV,REF,QUIZ};')();

const errs = [];
const ids = [];

// 计划
if (PLAN.length !== 5) errs.push(`计划天数应为 5，实为 ${PLAN.length}`);
PLAN.forEach(d => {
  if (!d.id || !d.no || !d.title || !d.goal) errs.push(`计划 ${d.id} 字段缺失`);
  if (!d.tasks.length) errs.push(`计划 ${d.id} 无任务`);
  d.tasks.forEach(t => {
    if (!t.id || !t.t) errs.push(`任务 ${t.id} 字段缺失`);
    ids.push(t.id);
    t.tags?.forEach(g => { if (!g.n) errs.push(`任务 ${t.id} 标签缺名`); });
  });
});

// 课程
if (!COURSES.length) errs.push('课程章节为空');
COURSES.forEach(c => {
  if (!c.p || !c.short) errs.push('章节缺少 p/short');
  if (!/^https:\/\/www\.bilibili\.com/.test(c.link || '')) errs.push(`章节 ${c.p} 缺少 B 站链接`);
  if (!c.items.length) errs.push(`章节 ${c.p} 无内容`);
  c.items.forEach(i => { if (!i.id || !i.t || !i.body) errs.push(`章节 ${c.p} 内容项字段缺失`); ids.push(i.id); });
});

// 其他三块
[['CSURV', CSURV], ['REF', REF]].forEach(([n, g]) => {
  if (!g.length) errs.push(`${n} 为空`);
  g.forEach(x => { if (!x.t || !x.body) errs.push(`${n} 项字段缺失`); });
});
if (QUIZ.length < 20) errs.push(`题库偏少：${QUIZ.length}`);
QUIZ.forEach((q, i) => {
  if (q.a == null || q.a < 0 || q.a >= q.o.length) errs.push(`Q${i + 1} 答案索引越界`);
  if (new Set(q.o).size !== q.o.length) errs.push(`Q${i + 1} 选项重复`);
  if (q.o.length < 2) errs.push(`Q${i + 1} 选项过少`);
  if (!q.e) errs.push(`Q${i + 1} 缺少解析`);
});

// ID 唯一
const dup = ids.filter((v, i) => ids.indexOf(v) !== i);
if (dup.length) errs.push('重复 ID: ' + [...new Set(dup)].join(','));

// 标记配对（剔除围栏行）
const strip = b => b.split('\n').filter(l => !/^\s*(\\?`|\[\[\[|\]\])/.test(l)).join('\n');
const chk = (id, body) => {
  const t = strip(body);
  const a = (t.match(/\[\[/g) || []).length, b = (t.match(/\]\]/g) || []).length;
  if (a !== b) errs.push(`${id}: [[=${a} ]]=${b}`);
  const oa = (body.match(/^\s*\\`\\`\\`/gm) || []).length;
  if (oa % 2) errs.push(`${id}: 代码围栏数为奇数 (${oa})`);
};
COURSES.forEach(c => c.items.forEach(i => chk(i.id, i.body)));
[...CSURV, ...REF].forEach(g => chk(g.t.slice(0, 16), g.body));
PLAN.forEach(d => chk(d.id, d.goal));

// 汇总
console.log(`计划 ${PLAN.length} 天 / ${PLAN.reduce((n, d) => n + d.tasks.length, 0)} 项任务`);
console.log(`课程 ${COURSES.length} 章 / ${COURSES.reduce((n, c) => n + c.items.length, 0)} 节详解`);
console.log(`急救 ${CSURV.length} 节 · 速查 ${REF.length} 节 · 自测 ${QUIZ.length} 题`);
console.log(`可勾选条目 ${ids.length} 个，无重复`);
console.log(errs.length ? `\n✗ 问题 ${errs.length} 个:\n  ${errs.join('\n  ')}` : '\n✓ 全部检查通过');
process.exit(errs.length ? 1 : 0);
