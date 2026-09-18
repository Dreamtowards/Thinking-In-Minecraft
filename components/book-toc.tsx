'use client';

import bookEn from '@/lib/book-toc-data-en.json';
import bookZh from '@/lib/book-toc-data.json';
import type { BookTocData, TocAudience, TocChapter, TocVolume } from '@/lib/book-toc';
import Link from 'next/link';
import { useState } from 'react';

type Locale = 'zh' | 'en';
type Tab = 'overview' | TocVolume['id'];
type Filter = 'all' | 'fan' | 'dev' | 'written';

const DATA: Record<Locale, BookTocData> = {
  zh: bookZh as BookTocData,
  en: bookEn as BookTocData,
};

type Labels = {
  overview: string;
  allReaders: string;
  fanFocus: string;
  devFocus: string;
  writtenOnly: string;
  searchPlaceholder: string;
  fourVolumes: string;
  volumeCol: string;
  thesisCol: string;
  howToRead: string;
  youAre: string;
  route: string;
  skippable: string;
  fanPayoff: string;
  devPayoff: string;
  blurbOutline: string;
  answers: string;
  written: string;
  draft: string;
  audience: Record<TocAudience, string>;
  volumeTab: (v: TocVolume) => string;
  volumeHeading: (v: TocVolume) => string;
  readingRoutes: { you: string; route: string; skip: string }[];
};

const LABELS: Record<Locale, Labels> = {
  zh: {
    overview: '总览',
    allReaders: '全部读者',
    fanFocus: '爱好者侧重',
    devFocus: '开发者侧重',
    writtenOnly: '只看已写',
    searchPlaceholder: '按章名、简介或节标题筛选',
    fourVolumes: '四卷对照',
    volumeCol: '卷',
    thesisCol: '命题',
    howToRead: '怎么读',
    youAre: '你更像',
    route: '顺序',
    skippable: '可跳过',
    fanPayoff: '爱好者带走：',
    devPayoff: '开发者带走：',
    blurbOutline: '简介与节大纲',
    answers: '要回答：',
    written: '已写',
    draft: '未写',
    audience: { both: '两类', fan: '爱好者', dev: '开发者' },
    volumeTab: (v) => (v.roman ? `卷${v.roman} ${v.short}` : v.short),
    volumeHeading: (v) => (v.roman ? `第 ${v.roman} 卷 · ${v.short}` : v.short),
    readingRoutes: [
      {
        you: '设计师 / 玩法程序',
        route: '序 → 卷二全部 → 卷一 04–06、12 → 卷三 17–18',
        skip: '卷三实现细节',
      },
      {
        you: '引擎 / 技术程序',
        route: '序 → 卷二 01–02、07 → 卷三全部 → 卷四',
        skip: '卷一影像章可略',
      },
      {
        you: '制作人 / 商业',
        route: '卷一全部 → 卷二 11–16 → 卷三 15–17',
        skip: '红石实现、渲染',
      },
      {
        you: '资深玩家通读',
        route: '按卷顺序；每章先读简介与「要回答」',
        skip: '开发者侧重章可读命题与结尾',
      },
    ],
  },
  en: {
    overview: 'Overview',
    allReaders: 'All readers',
    fanFocus: 'Fan focus',
    devFocus: 'Dev focus',
    writtenOnly: 'Written only',
    searchPlaceholder: 'Filter by title, blurb, or section',
    fourVolumes: 'Four volumes',
    volumeCol: 'Volume',
    thesisCol: 'Thesis',
    howToRead: 'How to read',
    youAre: 'You are',
    route: 'Route',
    skippable: 'Skippable',
    fanPayoff: 'Fans take away: ',
    devPayoff: 'Devs take away: ',
    blurbOutline: 'Blurb & outline',
    answers: 'Answers: ',
    written: 'Written',
    draft: 'Draft',
    audience: { both: 'Both', fan: 'Fans', dev: 'Devs' },
    volumeTab: (v) => (v.roman ? `Vol. ${v.roman} ${v.short}` : v.short),
    volumeHeading: (v) => (v.roman ? `Volume ${v.roman} · ${v.short}` : v.short),
    readingRoutes: [
      {
        you: 'Designer / gameplay programmer',
        route: 'Preface → Vol. II all → Vol. I 04–06, 12 → Vol. III 17–18',
        skip: 'Vol. III implementation detail',
      },
      {
        you: 'Engine / tech programmer',
        route: 'Preface → Vol. II 01–02, 07 → Vol. III all → Vol. IV',
        skip: 'Vol. I video chapter',
      },
      {
        you: 'Producer / business',
        route: 'Vol. I all → Vol. II 11–16 → Vol. III 15–17',
        skip: 'Redstone impl, rendering',
      },
      {
        you: 'Veteran player (full read)',
        route: 'Volume order; read each chapter blurb first',
        skip: 'Dev-heavy chapters: thesis + closing',
      },
    ],
  },
};

function matchesFilter(ch: TocChapter, filter: Filter) {
  if (filter === 'written') return ch.written;
  if (filter === 'fan') return ch.audience !== 'dev';
  if (filter === 'dev') return ch.audience !== 'fan';
  return true;
}

function matchesQuery(ch: TocChapter, q: string) {
  if (!q) return true;
  const blob = [ch.title, ch.desc, ch.question, ...ch.sections].join('\n').toLowerCase();
  return blob.includes(q);
}

export function BookToc({ locale = 'zh' }: { locale?: Locale }) {
  const data = DATA[locale];
  const L = LABELS[locale];
  const [tab, setTab] = useState<Tab>('overview');
  const [filter, setFilter] = useState<Filter>('all');
  const [query, setQuery] = useState('');
  const q = query.trim().toLowerCase();
  const active = data.volumes.find((v) => v.id === tab);

  return (
    <div className="not-prose mt-10">
      <div className="mb-4 flex flex-wrap gap-2">
        <TabPill active={tab === 'overview'} onClick={() => setTab('overview')}>
          {L.overview}
        </TabPill>
        {data.volumes.map((v) => (
          <TabPill key={v.id} active={tab === v.id} onClick={() => setTab(v.id)}>
            {L.volumeTab(v)}
          </TabPill>
        ))}
      </div>

      <div className="mb-8 flex flex-wrap items-center gap-2">
        <TabPill active={filter === 'all'} onClick={() => setFilter('all')} quiet>
          {L.allReaders}
        </TabPill>
        <TabPill active={filter === 'fan'} onClick={() => setFilter('fan')} quiet>
          {L.fanFocus}
        </TabPill>
        <TabPill active={filter === 'dev'} onClick={() => setFilter('dev')} quiet>
          {L.devFocus}
        </TabPill>
        <TabPill active={filter === 'written'} onClick={() => setFilter('written')} quiet>
          {L.writtenOnly}
        </TabPill>
        {tab !== 'overview' ? (
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={L.searchPlaceholder}
            className="ml-auto min-w-[12rem] flex-1 rounded-lg border border-fd-border bg-fd-card px-3 py-1.5 text-sm outline-none focus:border-fd-primary"
          />
        ) : null}
      </div>

      {tab === 'overview' ? <Overview data={data} filter={filter} labels={L} /> : null}
      {active ? <VolumeTree volume={active} filter={filter} query={q} labels={L} /> : null}
    </div>
  );
}

function TabPill({
  active,
  onClick,
  children,
  quiet,
}: {
  active: boolean;
  onClick: () => void;
  children: string;
  quiet?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        'rounded-full px-3 py-1 text-sm transition-colors ' +
        (active
          ? 'bg-fd-primary text-fd-primary-foreground'
          : quiet
            ? 'text-fd-muted-foreground hover:bg-fd-accent hover:text-fd-accent-foreground'
            : 'border border-fd-border text-fd-muted-foreground hover:bg-fd-accent hover:text-fd-accent-foreground')
      }
    >
      {children}
    </button>
  );
}

function Overview({
  data,
  filter,
  labels: L,
}: {
  data: BookTocData;
  filter: Filter;
  labels: Labels;
}) {
  return (
    <div className="space-y-10">
      <section>
        <h2 className="mb-3 text-lg font-semibold">{L.fourVolumes}</h2>
        <div className="overflow-x-auto rounded-xl border border-fd-border">
          <table className="w-full text-left text-sm">
            <thead className="bg-fd-muted/50 text-fd-muted-foreground">
              <tr>
                <th className="px-4 py-2.5 font-medium">{L.volumeCol}</th>
                <th className="px-4 py-2.5 font-medium">{L.thesisCol}</th>
              </tr>
            </thead>
            <tbody>
              {data.volumes.map((v) => (
                <tr key={v.id} className="border-t border-fd-border align-top">
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="font-medium">{v.roman ? `${v.roman} · ${v.short}` : v.short}</div>
                    <div className="text-xs text-fd-muted-foreground">{v.english}</div>
                  </td>
                  <td className="px-4 py-3 text-fd-muted-foreground leading-6">{v.thesis}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {data.volumes.map((v) => (
        <section key={v.id}>
          <h2 className="mb-1 text-lg font-semibold">{L.volumeHeading(v)}</h2>
          <p className="mb-4 text-sm text-fd-muted-foreground leading-6">{v.thesis}</p>
          <ul className="space-y-3">
            {v.parts.map((p) => {
              const visible = p.chapters.filter((c) => matchesFilter(c, filter));
              if (visible.length === 0) return null;
              return (
                <li key={p.title} className="rounded-xl border border-fd-border px-4 py-3">
                  <div className="flex flex-wrap items-baseline gap-x-2">
                    <span className="font-medium">{p.title}</span>
                    {p.span ? <span className="text-xs text-fd-muted-foreground">{p.span}</span> : null}
                  </div>
                  {p.intent ? (
                    <p className="mt-1 text-sm text-fd-muted-foreground leading-6">{p.intent}</p>
                  ) : null}
                  <p className="mt-2 text-sm leading-7">
                    {visible.map((c, i) => (
                      <span key={c.id}>
                        {i > 0 ? <span className="text-fd-muted-foreground"> · </span> : null}
                        {c.href ? (
                          <Link href={c.href} className="text-fd-primary hover:underline">
                            {c.title}
                          </Link>
                        ) : (
                          <span className="text-fd-muted-foreground">{c.title}</span>
                        )}
                      </span>
                    ))}
                  </p>
                </li>
              );
            })}
          </ul>
        </section>
      ))}

      <section>
        <h2 className="mb-3 text-lg font-semibold">{L.howToRead}</h2>
        <div className="overflow-x-auto rounded-xl border border-fd-border">
          <table className="w-full text-left text-sm">
            <thead className="bg-fd-muted/50 text-fd-muted-foreground">
              <tr>
                <th className="px-4 py-2.5 font-medium">{L.youAre}</th>
                <th className="px-4 py-2.5 font-medium">{L.route}</th>
                <th className="px-4 py-2.5 font-medium">{L.skippable}</th>
              </tr>
            </thead>
            <tbody className="text-fd-muted-foreground">
              {L.readingRoutes.map((row) => (
                <tr key={row.you} className="border-t border-fd-border">
                  <td className="px-4 py-3">{row.you}</td>
                  <td className="px-4 py-3">{row.route}</td>
                  <td className="px-4 py-3">{row.skip}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function VolumeTree({
  volume,
  filter,
  query,
  labels: L,
}: {
  volume: TocVolume;
  filter: Filter;
  query: string;
  labels: Labels;
}) {
  let n = 0;
  return (
    <div>
      <header className="mb-8 border-b border-fd-border pb-6">
        <p className="text-xs tracking-wide text-fd-muted-foreground uppercase">
          {volume.english}
        </p>
        <h2 className="mt-1 text-2xl font-semibold tracking-tight">{L.volumeHeading(volume)}</h2>
        <p className="mt-3 max-w-3xl text-[0.9375rem] leading-7 text-fd-muted-foreground">
          {volume.thesis}
        </p>
        <p className="mt-3 max-w-3xl text-sm leading-6">
          <span className="text-fd-muted-foreground">{L.fanPayoff}</span>
          {volume.payoffFan}
        </p>
        <p className="mt-1 max-w-3xl text-sm leading-6">
          <span className="text-fd-muted-foreground">{L.devPayoff}</span>
          {volume.payoffDev}
        </p>
      </header>

      <div className="space-y-10">
        {volume.parts.map((part) => {
          const chapters = part.chapters.filter(
            (c) => matchesFilter(c, filter) && matchesQuery(c, query),
          );
          if (chapters.length === 0) {
            n += part.chapters.length;
            return null;
          }
          return (
            <section key={part.title}>
              <h3 className="mb-1 text-base font-semibold">
                {part.title}
                {part.span ? (
                  <span className="ml-2 text-sm font-normal text-fd-muted-foreground">
                    {part.span}
                  </span>
                ) : null}
              </h3>
              {part.intent ? (
                <p className="mb-4 text-sm text-fd-muted-foreground leading-6">{part.intent}</p>
              ) : null}
              <ol className="divide-y divide-fd-border rounded-xl border border-fd-border">
                {part.chapters.map((ch) => {
                  n += 1;
                  const num = n;
                  if (!matchesFilter(ch, filter) || !matchesQuery(ch, query)) return null;
                  return (
                    <li key={ch.id}>
                      <ChapterRow chapter={ch} num={num} labels={L} />
                    </li>
                  );
                })}
              </ol>
            </section>
          );
        })}
      </div>
    </div>
  );
}

function ChapterRow({
  chapter,
  num,
  labels: L,
}: {
  chapter: TocChapter;
  num: number;
  labels: Labels;
}) {
  const title = (
    <span className="font-medium">
      <span className="mr-2 tabular-nums text-fd-muted-foreground">{String(num).padStart(2, '0')}</span>
      {chapter.title}
    </span>
  );

  return (
    <div className="px-4 py-3">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-3">
        <div className="min-w-0 flex-1">
          {chapter.href ? (
            <Link href={chapter.href} className="hover:text-fd-primary hover:underline">
              {title}
            </Link>
          ) : (
            title
          )}
        </div>
        <div className="flex shrink-0 flex-wrap gap-1.5 text-xs">
          {chapter.written ? (
            <span className="rounded-md border border-fd-border px-1.5 py-0.5">{L.written}</span>
          ) : (
            <span className="rounded-md px-1.5 py-0.5 text-fd-muted-foreground">{L.draft}</span>
          )}
          <span className="rounded-md px-1.5 py-0.5 text-fd-muted-foreground">
            {L.audience[chapter.audience]}
          </span>
          {chapter.tags.map((t) => (
            <span key={t} className="rounded-md bg-fd-muted px-1.5 py-0.5 text-fd-muted-foreground">
              {t}
            </span>
          ))}
        </div>
      </div>
      <details className="mt-2 group">
        <summary className="cursor-pointer text-sm text-fd-muted-foreground hover:text-fd-foreground [&::-webkit-details-marker]:hidden">
          {L.blurbOutline}
        </summary>
        <div className="mt-3 max-w-3xl pb-1">
          <p className="text-sm leading-6 text-fd-muted-foreground">{chapter.desc}</p>
          {chapter.question ? (
            <p className="mt-2 text-sm leading-6">
              <span className="text-fd-muted-foreground">{L.answers}</span>
              {chapter.question}
            </p>
          ) : null}
          {chapter.sections.length > 0 ? (
            <ol className="mt-3 list-decimal space-y-1 pl-5 text-sm leading-6">
              {chapter.sections.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ol>
          ) : null}
        </div>
      </details>
    </div>
  );
}
