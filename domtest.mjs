// 交互验证：用最小 DOM shim 真实执行 App 的渲染函数，确认五个页面都能正常生成
import fs from 'node:fs';

const html = fs.readFileSync('template.html', 'utf8');
const dataSrc = fs.readFileSync('data.js', 'utf8') + '\n' + fs.readFileSync('data2.js', 'utf8');

// 抽 <script> 主体（跳过 /*__DATA__*/ 占位那个）
const scripts = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m => m[1]);
const app = scripts[scripts.length - 1];

function makeEl(id) {
  const el = {
    id, innerHTML: '', textContent: '', _cls: new Set(), style: {},
    dataset: {}, scrollIntoView() { },
    addEventListener() { }, removeEventListener() { },
    classList: {
      add: c => el._cls.add(c), remove: c => el._cls.delete(c),
      toggle: (c, on) => { (on === undefined ? !el._cls.has(c) : on) ? el._cls.add(c) : el._cls.delete(c) },
      contains: c => el._cls.has(c),
    },
    closest: () => null, matches: () => false, scrollTo() { },
  };
  return el;
}
const els = {};
const getById = id => (els[id] ||= makeEl(id));
const stub = () => makeEl('stub');

const store = {};
global.localStorage = {
  getItem: k => store[k] ?? null,
  setItem: (k, v) => { store[k] = String(v) },
  removeItem: k => { delete store[k] },
};
global.document = {
  getElementById: getById,
  querySelector: () => stub(),
  querySelectorAll: () => [],
  body: makeEl('body'),
  createElement: () => makeEl('x'),
};
global.window = { scrollTo() { } };

const mod = new Function(
  dataSrc + '\n' + app +
  '\nreturn {renderPlan,renderCourse,renderC,renderRef,renderQuiz,refreshAll,md,PLAN,COURSES,CSURV,REF,QUIZ,toggle,isDone,setTopic:(i)=>{curTopic=i;renderCourse();}};'
)();
const { renderPlan, renderCourse, renderC, renderRef, renderQuiz, refreshAll, md, PLAN, COURSES, CSURV, REF, QUIZ, toggle, setTopic } = mod;

const errs = [];
const check = (name, elId, mustContain = [], minLen = 200) => {
  try {
    if (elId) {
      const h = getById(elId).innerHTML;
      if (h.length < minLen) errs.push(`${name}: 输出过短 (${h.length})`);
      mustContain.forEach(s => { if (!h.includes(s)) errs.push(`${name}: 缺少 ${JSON.stringify(s)}`); });
      if (/\[\[|\]\]/.test(h)) errs.push(`${name}: 残留未渲染标记`);
      if (/undefined/.test(h) && !/undefined symbol|is undefined|报 undefined/.test(h)) errs.push(`${name}: 出现可疑 undefined`);
    }
  } catch (e) { errs.push(`${name}: 抛异常 ${e.message}`); }
};

renderPlan(); check('计划', 'v-plan', ['Day 1', 'Day 5', '[2-2] 新建工程', 'STM32-Template']);
renderCourse(); check('课程', 'v-course', ['2-2', '3-1', '6-2', '工程架构'], 1000);
{
  const h = getById('v-course').innerHTML;
  const tabs = (h.match(/data-topic="\d+"/g) || []).length;
  if (tabs !== COURSES.length) errs.push(`课程 tab 数 ${tabs} ≠ 章节数 ${COURSES.length}`);
  if (!h.includes('bilibili.com/video/BV1th411z7sn?p=4')) errs.push('课程页缺少 [2-2] 的视频链接');
}
renderC(); check('急救', 'v-c', ['typedef', '结构体', '指针', '#define']);
renderRef(); check('速查', 'v-ref', ['GPIO 库函数速查', 'TIM 定时器速查', 'E 盘资料索引']);
renderQuiz(); check('自测', 'v-quiz', ['Q1', 'Q30', '正确答案']);
refreshAll();
check('顶栏进度', null);

// 交互：勾选任务 → 进度应上升
const before = getById('overall').textContent;
toggle('d1t1'); refreshAll();
const after = getById('overall').textContent;
if (before === after) errs.push(`勾选任务后进度未变化 (${before} → ${after})`);
const saved = JSON.parse(store['stm32-5d-progress-v1'] || '{}');
if (!saved['d1t1']) errs.push('勾选状态未写入 localStorage');

// 交互：逐个切换章节 tab，每章都要能渲染出内容
COURSES.forEach((c, i) => {
  setTopic(i);
  const h = getById('v-course').innerHTML;
  if (h.length < 300) errs.push(`章节 ${c.p} 渲染过短 (${h.length})`);
  if (!h.includes('class="read-b"')) errs.push(`章节 ${c.p} 未渲染内容块`);
  if (/\[\[|\]\]/.test(h)) errs.push(`章节 ${c.p} 残留未渲染标记`);
});

// 渲染规模统计
console.log('计划页 HTML 长度:', getById('v-plan').innerHTML.length);
console.log('课程页 HTML 长度:', getById('v-course').innerHTML.length);
console.log('急救页 HTML 长度:', getById('v-c').innerHTML.length);
console.log('速查页 HTML 长度:', getById('v-ref').innerHTML.length);
console.log('自测页 HTML 长度:', getById('v-quiz').innerHTML.length);
console.log('进度:', before, '→', after);
console.log('localStorage:', Object.keys(saved).join(',') || '(空)');
console.log('\n问题数:', errs.length);
errs.forEach(e => console.log('  ✗ ' + e));
