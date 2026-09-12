import fs from 'node:fs';

const md = fs.readFileSync('c:/dev/Projects/Thinking-In-Minecraft/PLAN.md', 'utf8');
const lines = md.split(/\r?\n/);
const start = lines.findIndex((l) => l === '## 总序');
const end = lines.findIndex((l) => l === '## 怎么读');
const slice = lines.slice(start, end);

const published = new Set([
  'docs/prelude/index.mdx',
  'docs/prelude/thesis.mdx',
  'docs/prelude/method.mdx',
  'docs/history/infiniminer.mdx',
  'docs/history/alpha.mdx',
  'docs/history/mojang-beta.mdx',
  'docs/history/mods-as-authors.mdx',
  'docs/history/servers.mdx',
  'docs/history/media-education.mdx',
]);

function hrefFromFile(file) {
  if (!file || !published.has(file)) return null;
  const p = file.replace(/^docs\//, '').replace(/\.mdx$/, '');
  if (p.endsWith('/index')) return `/${p.slice(0, -'/index'.length)}`;
  return `/${p}`;
}

const volumes = [];
let vol = null;
let part = null;
let ch = null;
let mode = null;
let expectIntent = false;

function flushCh() {
  if (ch && part) part.chapters.push(ch);
  ch = null;
  mode = null;
}
function flushPart() {
  flushCh();
  if (part && vol) vol.parts.push(part);
  part = null;
  expectIntent = false;
}

for (const line of slice) {
  const h2 = line.match(/^## (.+)$/);
  if (h2) {
    flushPart();
    const title = h2[1];
    let id = 'other';
    if (title.includes('总序')) id = 'prelude';
    else if (title.includes('第一卷')) id = 'v1';
    else if (title.includes('第二卷')) id = 'v2';
    else if (title.includes('第三卷')) id = 'v3';
    else if (title.includes('第四卷')) id = 'v4';
    else if (title.includes('附录')) id = 'appendix';
    vol = { id, heading: title, thesis: '', parts: [] };
    volumes.push(vol);
    if (id === 'prelude') {
      part = { title: '总序', span: '', intent: '划定读者、禁止误读、说明三卷分工。', chapters: [] };
    }
    if (id === 'appendix') {
      part = { title: '查阅', span: '', intent: '年表、人物、对照与术语。不承担论证。', chapters: [] };
    }
    continue;
  }

  if (vol && line.startsWith('**卷命题**：')) {
    vol.thesis = line.replace('**卷命题**：', '').trim();
    continue;
  }

  const h3part = line.match(/^### (第.+部 · .+)$/);
  if (h3part && vol && vol.id !== 'prelude' && vol.id !== 'appendix') {
    flushPart();
    const raw = h3part[1];
    const spanMatch = raw.match(/（([^）]+)）/);
    part = {
      title: raw.replace(/（[^）]+）/, '').trim(),
      span: spanMatch ? spanMatch[1] : '',
      intent: '',
      chapters: [],
    };
    expectIntent = true;
    continue;
  }

  if (expectIntent && part && line.trim() && !line.startsWith('#') && !line.startsWith('-') && !line.startsWith('---')) {
    part.intent = line.trim();
    expectIntent = false;
    continue;
  }
  if (expectIntent && (line.startsWith('#') || line.startsWith('---'))) {
    expectIntent = false;
  }

  const chapHead = line.match(/^#{3,4} `([^`]+)` (.+)$/);
  if (chapHead && vol) {
    if (chapHead[1].endsWith('/index') && chapHead[1] !== 'prelude/index') {
      flushCh();
      continue;
    }
    flushCh();
    if (!part) part = { title: '本卷', span: '', intent: '', chapters: [] };
    const full = chapHead[2];
    const tags = [];
    if (full.includes('枢纽')) tags.push('枢纽');
    if (full.includes('先写')) tags.push('先写');
    if (full.includes('卷结语') || full.includes('全书结语')) tags.push('结语');
    ch = {
      id: chapHead[1],
      title: full.replace(/ · .+$/, '').trim(),
      file: '',
      audience: 'both',
      desc: '',
      question: '',
      sections: [],
      tags,
      href: null,
    };
    continue;
  }

  if (!ch) continue;

  const file = line.match(/^- 文件：`([^`]+)`/);
  if (file) {
    ch.file = file[1];
    ch.href = hrefFromFile(file[1]);
    if (line.includes('爱好者')) ch.audience = 'fan';
    else if (line.includes('开发者')) ch.audience = 'dev';
    else ch.audience = 'both';
    continue;
  }

  if (line.startsWith('- **简介**：')) {
    ch.desc = line.replace('- **简介**：', '').trim();
    continue;
  }
  if (line.startsWith('- **要回答**：')) {
    ch.question = line.replace('- **要回答**：', '').trim();
    continue;
  }
  if (line.startsWith('- **大纲**：')) {
    const rest = line.replace('- **大纲**：', '').trim();
    if (rest) ch.sections.push(rest.replace(/\*\*/g, ''));
    mode = 'outline';
    continue;
  }
  if (mode === 'outline') {
    const item = line.match(/^\s+(\d+)\.\s+(.+)$/);
    if (item) {
      ch.sections.push(item[2].replace(/\*\*/g, ''));
      continue;
    }
    if (line.trim() === '' || line.startsWith('- **') || line.startsWith('#')) {
      mode = null;
    }
  }
}
flushPart();

const preludeFiles = {
  'prelude/thesis': 'docs/prelude/thesis.mdx',
  'prelude/method': 'docs/prelude/method.mdx',
  'prelude/index': 'docs/prelude/index.mdx',
};
const appendixFiles = {
  'appendix/timeline': 'docs/appendix/timeline.mdx',
  'appendix/people': 'docs/appendix/people.mdx',
  'appendix/java-bedrock': 'docs/appendix/java-bedrock.mdx',
  'appendix/glossary': 'docs/appendix/glossary.mdx',
  'appendix/references': 'docs/appendix/references.mdx',
  'appendix/exercises': 'docs/appendix/exercises.mdx',
};

for (const v of volumes) {
  for (const p of v.parts) {
    for (const c of p.chapters) {
      if (!c.file && preludeFiles[c.id]) {
        c.file = preludeFiles[c.id];
        c.href = hrefFromFile(c.file);
      }
      if (!c.file && appendixFiles[c.id]) {
        c.file = appendixFiles[c.id];
        c.href = hrefFromFile(c.file);
      }
    }
  }
}

const rewriteParts = [
  { title: '第一部 · 重写之前先界定问题', ids: ['rewrite/01', 'rewrite/02', 'rewrite/03'], intent: '四个产品不能互相替代。先冻结不变量，再谈偶然。' },
  { title: '第二部 · 架构提案', ids: ['rewrite/04', 'rewrite/05', 'rewrite/06', 'rewrite/07', 'rewrite/08'], intent: '世界、调度、模组双层、社会功能与工具链。' },
  { title: '第三部 · 产品与伦理', ids: ['rewrite/09', 'rewrite/10', 'rewrite/11'], intent: '兼容是对玩家时间的伦理。重写是为了看清原作。' },
];

const v4 = volumes.find((v) => v.id === 'v4');
if (v4) {
  const all = v4.parts.flatMap((p) => p.chapters);
  v4.parts = rewriteParts.map((spec) => ({
    title: spec.title,
    span: '',
    intent: spec.intent,
    chapters: spec.ids.map((id) => all.find((c) => c.id === id)).filter(Boolean),
  }));
}

const prelude = volumes.find((v) => v.id === 'prelude');
if (prelude?.parts[0]) {
  const order = ['prelude/index', 'prelude/thesis', 'prelude/method'];
  const byId = new Map(prelude.parts[0].chapters.map((c) => [c.id, c]));
  prelude.parts[0].chapters = order.map((id) => byId.get(id)).filter(Boolean);
}

const meta = {
  prelude: {
    roman: '',
    short: '序',
    english: 'How to read',
    color: 'gray',
    payoffFan: '先知道这书不是攻略、维基或怀旧。读命题，再决定跳哪一卷。',
    payoffDev: '原则必须带不可迁移条件。不要从卷四起笔。',
  },
  v1: {
    roman: 'I',
    short: '历史与商业',
    english: 'History & Business',
    color: 'orange',
    payoffFan: '把版本、模组、服务器和影像写成可检验的产业史，不是怀旧清单。',
    payoffDev: '买断、UGC、双引擎、收购与平台化各自解决了什么，以及「下一个 Minecraft」为何极难出现。',
  },
  v2: {
    roman: 'II',
    short: '游戏设计',
    english: 'Game Design',
    color: 'blue',
    payoffFan: '习以为常的机制变成可证伪的判断：创造不是编辑器，红石不是电线。',
    payoffDev: '十二条原则，以及抄不走的条件。本卷是全书中轴。',
  },
  v3: {
    roman: 'III',
    short: '技术实现',
    english: 'Implementation',
    color: 'green',
    payoffFan: '卡顿、杜普、TPS 能说成机制，而不必读混淆名录。',
    payoffDev: '一个能跑的原型如何被拖进不可能的规模；哪些债其实是资产。',
  },
  v4: {
    roman: 'IV',
    short: '重写',
    english: 'Rewrite',
    color: 'purple',
    payoffFan: '看清哪些是 Minecraft，哪些只是 2009 年的偶然。',
    payoffDev: '考试，不是开工令。不变量冻结之前不要把本卷写成定论。',
  },
  appendix: {
    roman: '',
    short: '附录',
    english: 'Appendix',
    color: 'gray',
    payoffFan: '年表和术语，用来查，不用来论证。',
    payoffDev: '对照表与实验题。不给标准实现。',
  },
};

const book = {
  thesis: 'Minecraft 不是一套被消费的关卡，而是一套允许被居住、误用、再开发的规则。',
  volumes: volumes.map((v) => ({
    ...meta[v.id],
    id: v.id,
    heading: v.heading,
    thesis: v.thesis || (v.id === 'prelude' ? '划定读者、禁止误读、说明三卷分工。第四卷写在不变量冻结之后。' : v.id === 'appendix' ? '查阅用，不承担论证。' : ''),
    parts: v.parts.map((p) => ({
      title: p.title,
      span: p.span,
      intent: p.intent,
      chapters: p.chapters.map((c) => ({
        id: c.id,
        title: c.title,
        audience: c.audience,
        desc: c.desc,
        question: c.question,
        sections: c.sections,
        tags: c.tags,
        href: c.href,
        written: Boolean(c.href),
      })),
    })),
  })),
};

const json = JSON.stringify(book, null, 2);
fs.writeFileSync('c:/dev/Projects/Thinking-In-Minecraft/lib/book-toc-data.json', json, 'utf8');
fs.writeFileSync('c:/dev/Projects/Thinking-In-Minecraft/scripts/toc-extracted.json', json, 'utf8');

const counts = book.volumes.map((v) => {
  const n = v.parts.reduce((s, p) => s + p.chapters.length, 0);
  const written = v.parts.reduce((s, p) => s + p.chapters.filter((c) => c.written).length, 0);
  const missingSec = v.parts.flatMap((p) => p.chapters.filter((c) => c.sections.length === 0).map((c) => c.id));
  return { id: v.id, parts: v.parts.length, chapters: n, written, missingSec };
});
console.log(JSON.stringify(counts, null, 2));
