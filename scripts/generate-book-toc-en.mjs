import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const zhPath = path.join(root, 'lib/book-toc-data.json');
const enPath = path.join(root, 'lib/book-toc-data-en.json');

function loadBaseline() {
  const raw = execSync('git show HEAD:lib/book-toc-data.json', {
    cwd: root,
    encoding: 'utf8',
  });
  return JSON.parse(raw);
}

const baseline = loadBaseline();

const VOLUME_PATH = {
  prelude: 'prelude',
  v1: 'history',
  v2: 'design',
  v3: 'impl',
  v4: 'rewrite',
  appendix: 'appendix',
};

const VOLUME_EN = {
  prelude: {
    short: 'Preface',
    payoffFan: 'Read the thesis first, then choose which volume to enter. This is not a walkthrough or changelog.',
    payoffDev: 'Every principle ships with non-transferable conditions. Do not start from Volume IV.',
  },
  v1: {
    short: 'History & Business',
    payoffFan: 'Turn versions, mods, servers, and video into testable industrial history — not a nostalgia list.',
    payoffDev: 'What buy-once, UGC, dual engines, acquisition, and platformization each solved — and why “the next Minecraft” is so hard.',
  },
  v2: {
    short: 'Game Design',
    payoffFan: 'See how a handful of rules combinatorially explode over a voxel world — the spine of the book.',
    payoffDev: 'Transferable principles with their premises spelled out; Volume II is the frozen layer everything else cites.',
  },
  v3: {
    short: 'Implementation',
    payoffFan: 'Follow a working prototype dragged into impossible scale — architecture debt and design freedom share one origin.',
    payoffDev: 'Which debts are assets, which are real constraints, and why the moddable engine is the complete product.',
  },
  v4: {
    short: 'Rewrite',
    payoffFan: 'An exam, not a work order: what is essence, what is historical accident.',
    payoffDev: 'Compatibility as ethics toward player time; who may rewrite; the checklist before any greenfield project.',
  },
  appendix: {
    short: 'Appendix',
    payoffFan: 'Timeline and glossary for lookup — not for argument.',
    payoffDev: 'Comparison tables and exercises. No reference implementations.',
  },
};

const PART_DIRS = {
  v1: 'history',
  v2: 'design',
  v3: 'impl',
  v4: 'rewrite',
};

const PART_INTENT = {
  prelude: ['Set the reader contract, forbid misreadings, and map the four volumes.'],
  v1: [
    'How a working prototype grew into a product on open development and a minimal loop.',
    'How authors outside the base game defined in reverse what Minecraft is.',
    'How capital, two product lines, and version politics turned protection into governance.',
    'Revenue, grey economy, competition, and legacy on one map.',
  ],
  v2: [
    'The voxel, verbs, survival, and Creative mode — the frozen layer.',
    'How crafting, worldgen, redstone, commands, mobs, and dimensions interlock.',
    'Multiplayer defaults, who makes rules, mods as design method.',
    'Emergence, constraints, and transferable principles.',
  ],
  v3: [
    'How the world exists in memory, on disk, and in the generation pipeline.',
    'How the simulation advances each tick.',
    'Presentation, protocol, and client-side feel.',
    'Mods, datapacks, Java runtime, Bedrock, and servers.',
    'Technical debt and the moddable engine as complete product.',
  ],
  v4: [
    'Four products that cannot substitute for one another; invariants and accidents.',
    'World representation, scheduling, scripting, network, rendering.',
    'Compatibility ethics, who may rewrite, seeing the original clearly.',
  ],
  appendix: ['Timeline, people, comparisons, glossary, sources, and exercises — for lookup, not argument.'],
};

const TAG_EN = {
  先写: 'priority',
  结语: 'closing',
  枢纽: 'hub',
};

function readFileIfExists(filePath) {
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch {
    return null;
  }
}

function listPartDirs(volumeDir) {
  const base = path.join(root, 'docs', volumeDir);
  if (!fs.existsSync(base)) return [];
  return fs
    .readdirSync(base, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && /^\(part\d+\)$/.test(entry.name))
    .map((entry) => entry.name)
    .sort((a, b) => Number(a.match(/\d+/)[0]) - Number(b.match(/\d+/)[0]));
}

function normalizePageSlug(page) {
  return page.replace(/^\.\.\//, '');
}

/** Map numbered ids (e.g. impl/05) to canonical hrefs from volume part meta.json. */
function buildChapterHrefMap() {
  const map = {};
  for (const volumeDir of ['history', 'design', 'impl', 'rewrite']) {
    let n = 0;
    for (const part of listPartDirs(volumeDir)) {
      const metaPath = path.join(root, 'docs', volumeDir, part, 'meta.json');
      const raw = readFileIfExists(metaPath);
      if (!raw) continue;
      const meta = JSON.parse(raw);
      for (const page of meta.pages) {
        n += 1;
        const slug = normalizePageSlug(page);
        map[`${volumeDir}/${String(n).padStart(2, '0')}`] = `/${volumeDir}/${slug}`;
      }
    }
  }
  return map;
}

function parseFrontmatter(source) {
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) return null;
  const block = match[1];
  const body = match[2];
  const title = block.match(/^title:\s*(.+)$/m)?.[1]?.trim();
  const description = block.match(/^description:\s*(.+)$/m)?.[1]?.trim();
  const clean = (value) => {
    if (!value) return '';
    let v = value;
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
      v = v.slice(1, -1);
    }
    return v.replace(/\\"/g, '"').replace(/\\'/g, "'");
  };
  return {
    title: clean(title),
    description: clean(description),
    body,
  };
}

function resolveDoc(href, locale) {
  if (!href) return null;
  const rel = href.replace(/^\//, '');
  const docsRoot = locale === 'en' ? path.join(root, 'docs', 'en') : path.join(root, 'docs');
  const candidates = [
    path.join(docsRoot, `${rel}.mdx`),
    path.join(docsRoot, rel, 'index.mdx'),
  ];

  const [volume, slug] = rel.split('/');
  if (volume && slug) {
    const volumeDir = path.join(docsRoot, volume);
    if (fs.existsSync(volumeDir)) {
      for (const entry of fs.readdirSync(volumeDir, { withFileTypes: true })) {
        if (entry.isDirectory() && entry.name.startsWith('(part')) {
          candidates.push(path.join(volumeDir, entry.name, `${slug}.mdx`));
        }
      }
    }
  }

  for (const candidate of candidates) {
    const raw = readFileIfExists(candidate);
    if (raw) return parseFrontmatter(raw);
  }
  return null;
}

function loadPartMeta(volumeId, partIndex) {
  const dir = PART_DIRS[volumeId];
  if (!dir) return null;
  const metaPath = path.join(root, 'docs/en', dir, `(part${partIndex + 1})`, 'meta.json');
  const raw = readFileIfExists(metaPath);
  if (!raw) return null;
  return JSON.parse(raw);
}

function resolveChapterHref(ch, slugMap) {
  return ch.href ?? slugMap[ch.id] ?? null;
}

function enrichChapter(ch, slugMap, locale) {
  const baseHref = resolveChapterHref(ch, slugMap);
  const doc = resolveDoc(baseHref, locale);
  const href =
    baseHref && locale === 'en' ? `/en${baseHref}` : baseHref;

  return {
    ...ch,
    title: doc?.title || ch.title,
    desc: doc?.description || ch.desc,
    question: doc && locale === 'en' ? '' : ch.question,
    href,
    written: Boolean(doc),
    tags: locale === 'en' ? ch.tags.map((tag) => TAG_EN[tag] ?? tag) : ch.tags,
  };
}

const slugMap = buildChapterHrefMap();

const syncedZh = {
  ...baseline,
  volumes: baseline.volumes.map((volume) => ({
    ...volume,
    parts: volume.parts.map((part) => ({
      ...part,
      chapters: part.chapters.map((ch) => enrichChapter(ch, slugMap, 'zh')),
    })),
  })),
};

fs.writeFileSync(zhPath, `${JSON.stringify(syncedZh, null, 2)}\n`);

const en = {
  thesis:
    'Minecraft is not disposable content, but a system you can inhabit, play beyond its design, and redevelop through mods and servers.',
  volumes: syncedZh.volumes.map((volume) => {
    const meta = VOLUME_EN[volume.id] ?? {};
    const volPath = VOLUME_PATH[volume.id];
    const volDoc = volPath ? resolveDoc(`/${volPath}`, 'en') : null;

    return {
      ...volume,
      short: meta.short ?? volume.english ?? volume.short,
      heading: volDoc?.title ?? volume.english ?? volume.short,
      thesis: volDoc?.description ?? volume.thesis,
      payoffFan: meta.payoffFan ?? volume.payoffFan,
      payoffDev: meta.payoffDev ?? volume.payoffDev,
      parts: volume.parts.map((part, partIndex) => {
        const partMeta = loadPartMeta(volume.id, partIndex);
        const intents = PART_INTENT[volume.id];
        return {
          ...part,
          title:
            volume.id === 'prelude'
              ? 'Preface'
              : volume.id === 'appendix'
                ? 'Reference'
                : (partMeta?.title ?? part.title),
          intent: intents?.[partIndex] ?? part.intent,
          chapters: part.chapters.map((ch) => enrichChapter(ch, slugMap, 'en')),
        };
      }),
    };
  }),
};

fs.writeFileSync(enPath, `${JSON.stringify(en, null, 2)}\n`);
console.log(`Synced ${zhPath}`);
console.log(`Wrote ${enPath}`);
