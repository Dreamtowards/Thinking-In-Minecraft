import fs from 'node:fs';

const md = fs.readFileSync('c:/dev/Projects/Thinking-In-Minecraft/PLAN.md', 'utf8');
const lines = md.split(/\r?\n/);
const start = lines.findIndex((l) => l === '## 总序');
const end = lines.findIndex((l) => l === '## 怎么读');
const slice = lines.slice(start, end);

function resolveDocFile(file) {
  if (!file) return null;
  if (fs.existsSync(file)) return file;

  const normalized = file.replace(/\\/g, '/');
  const slash = normalized.lastIndexOf('/');
  const dir = normalized.slice(0, slash);
  const name = normalized.slice(slash + 1);

  if (!fs.existsSync(dir)) return null;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (!entry.isDirectory() || !/^\(part\d+\)$/.test(entry.name)) continue;
    const candidate = `${dir}/${entry.name}/${name}`;
    if (fs.existsSync(candidate)) return candidate;
  }
  return null;
}

function hrefFromFile(file) {
  const resolved = resolveDocFile(file);
  if (!resolved) return null;

  let p = resolved
    .replace(/\\/g, '/')
    .replace(/^docs\//, '')
    .replace(/\.mdx$/, '')
    .replace(/\/\(part\d+\)(?=\/)/g, '');

  if (p.endsWith('/index')) p = p.slice(0, -'/index'.length);
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
      part = { title: '总序', span: '', intent: '说明作者为什么写、这本书真正追问什么，以及后文怎样形成判断。', chapters: [] };
    }
    if (id === 'appendix') {
      part = { title: '查阅', span: '', intent: '年表、人物、对照与术语。不承担论证。', chapters: [] };
    }
    continue;
  }

  if (vol && (line.startsWith('**卷命题**：') || line.startsWith('**当前问题**：'))) {
    vol.thesis = line.replace(/^\*\*(?:卷命题|当前问题)\*\*：/, '').trim();
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
  { title: '第一部 · 先弄清我们想继承什么', ids: ['rewrite/01', 'rewrite/02', 'rewrite/03'], intent: '区分设计关系、具体表达与历史偶然；先把所谓“不变量”降级成待验证原则。' },
  { title: '第二部 · 把旧原则放进新世界', ids: ['rewrite/04', 'rewrite/05', 'rewrite/06', 'rewrite/07', 'rewrite/08'], intent: '用平滑体素、真实物理、运行时 UGC、Avatar / VR 与更高表现力逐项做压力测试。' },
  { title: '第三部 · 新的变量与最后的反问', ids: ['rewrite/09', 'rewrite/10', 'rewrite/11'], intent: '加入 AI 等新变量，再回头判断下一代沙盒真正值得稳定哪些关系与接口。' },
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
    english: 'Preface',
    color: 'gray',
    payoffFan: '先知道这本书为什么写、正在追问什么，再从你关心的卷开始。',
    payoffDev: '方法页说明不同材料各自能回答什么；从具体问题进入对应卷即可。',
  },
  v1: {
    roman: 'I',
    short: '历史与商业',
    english: 'History & Business',
    color: 'orange',
    payoffFan: '不只看版本更新，而是把原型、社区、服务器、影像、跨平台与保存串成一段完整历史。',
    payoffDev: '看一个长期沙盒如何从原型变成跨平台产品与创作生态，以及兼容、商业化和社区基础设施各自带来的代价。',
  },
  v2: {
    roman: 'II',
    short: '游戏设计',
    english: 'Game Design',
    color: 'blue',
    payoffFan: '把习以为常的方块、动作、生存、红石与多人重新看成彼此咬合的设计关系。',
    payoffDev: '得到一份可继续被技术与 Reinvention 检验的候选原则，而不是固定教条。',
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
    short: '重新发明',
    english: 'Reinvention',
    color: 'purple',
    payoffFan: '把方块、低保真与旧实现换掉后，再看哪些 Minecraft 式关系仍然值得留下。',
    payoffDev: '用平滑体素、物理、UGC、VR / Avatar 与 AI 对前三卷的候选原则做压力测试。',
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
  thesis: '为什么 Minecraft 能从一款游戏长成一个可以长期生活、创造、改写，并不断被重新解释的世界？',
  volumes: volumes.map((v) => ({
    ...meta[v.id],
    id: v.id,
    heading: v.heading,
    thesis: v.thesis || (v.id === 'prelude' ? '为什么 Minecraft 能从一款游戏长成一个长期存在、不断被玩家重新解释的世界？' : v.id === 'appendix' ? '查阅用，不承担论证。' : ''),
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

const counts = book.volumes.map((v) => {
  const n = v.parts.reduce((s, p) => s + p.chapters.length, 0);
  const written = v.parts.reduce((s, p) => s + p.chapters.filter((c) => c.written).length, 0);
  const missingSec = v.parts.flatMap((p) => p.chapters.filter((c) => c.sections.length === 0).map((c) => c.id));
  return { id: v.id, parts: v.parts.length, chapters: n, written, missingSec };
});
console.log(JSON.stringify(counts, null, 2));
