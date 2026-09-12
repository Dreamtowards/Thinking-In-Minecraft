'use client';

import book from '@/lib/book-toc-data.json';
import type { BookTocData, TocAudience, TocChapter, TocVolume } from '@/lib/book-toc';
import Link from 'next/link';
import { useMemo, useState } from 'react';

const data = book as BookTocData;

type Tab = 'overview' | TocVolume['id'];
type Filter = 'all' | 'fan' | 'dev' | 'written';

const AUDIENCE: Record<TocAudience, string> = {
  both: '两类',
  fan: '爱好者',
  dev: '开发者',
};

function chapterCount(v: TocVolume) {
  return v.parts.reduce((n, p) => n + p.chapters.length, 0);
}

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

export function BookToc() {
  const [tab, setTab] = useState<Tab>('overview');
  const [filter, setFilter] = useState<Filter>('all');
  const [query, setQuery] = useState('');
  const q = query.trim().toLowerCase();

  const totals = useMemo(() => {
    const chapters = data.volumes.reduce((n, v) => n + chapterCount(v), 0);
    const parts = data.volumes.reduce((n, v) => n + v.parts.length, 0);
    const written = data.volumes.reduce(
      (n, v) => n + v.parts.reduce((m, p) => m + p.chapters.filter((c) => c.written).length, 0),
      0,
    );
    return { volumes: data.volumes.length, parts, chapters, written };
  }, []);

  const active = data.volumes.find((v) => v.id === tab);

  return (
    <div className="not-prose">
      <p className="text-fd-muted-foreground mb-6 text-[0.9375rem] leading-7">{data.thesis}</p>

      <dl className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          [String(totals.volumes), '卷（含序与附录）'],
          [String(totals.parts), '部'],
          [String(totals.chapters), '章'],
          [`${totals.written}/${totals.chapters}`, '已成稿'],
        ].map(([value, label]) => (
          <div key={label} className="rounded-xl border border-fd-border px-4 py-3">
            <dt className="text-xs text-fd-muted-foreground">{label}</dt>
            <dd className="mt-1 text-xl font-semibold tracking-tight">{value}</dd>
          </div>
        ))}
      </dl>

      <div className="mb-4 flex flex-wrap gap-2">
        <TabPill active={tab === 'overview'} onClick={() => setTab('overview')}>
          总览
        </TabPill>
        {data.volumes.map((v) => (
          <TabPill key={v.id} active={tab === v.id} onClick={() => setTab(v.id)}>
            {v.roman ? `卷${v.roman} ${v.short}` : v.short}
          </TabPill>
        ))}
      </div>

      <div className="mb-8 flex flex-wrap items-center gap-2">
        <TabPill active={filter === 'all'} onClick={() => setFilter('all')} quiet>
          全部读者
        </TabPill>
        <TabPill active={filter === 'fan'} onClick={() => setFilter('fan')} quiet>
          爱好者侧重
        </TabPill>
        <TabPill active={filter === 'dev'} onClick={() => setFilter('dev')} quiet>
          开发者侧重
        </TabPill>
        <TabPill active={filter === 'written'} onClick={() => setFilter('written')} quiet>
          只看已写
        </TabPill>
        {tab !== 'overview' ? (
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="按章名、简介或节标题筛选"
            className="ml-auto min-w-[12rem] flex-1 rounded-lg border border-fd-border bg-fd-card px-3 py-1.5 text-sm outline-none focus:border-fd-primary"
          />
        ) : null}
      </div>

      {tab === 'overview' ? <Overview filter={filter} /> : null}
      {active ? <VolumeTree volume={active} filter={filter} query={q} /> : null}
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

function Overview({ filter }: { filter: Filter }) {
  return (
    <div className="space-y-10">
      <section>
        <h2 className="mb-3 text-lg font-semibold">四卷对照</h2>
        <div className="overflow-x-auto rounded-xl border border-fd-border">
          <table className="w-full text-left text-sm">
            <thead className="bg-fd-muted/50 text-fd-muted-foreground">
              <tr>
                <th className="px-4 py-2.5 font-medium">卷</th>
                <th className="px-4 py-2.5 font-medium">命题</th>
                <th className="px-4 py-2.5 font-medium whitespace-nowrap">章</th>
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
                  <td className="px-4 py-3 tabular-nums">{chapterCount(v)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {data.volumes.map((v) => (
        <section key={v.id}>
          <h2 className="mb-1 text-lg font-semibold">
            {v.roman ? `第 ${v.roman} 卷 · ${v.short}` : v.short}
          </h2>
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
        <h2 className="mb-3 text-lg font-semibold">怎么读</h2>
        <div className="overflow-x-auto rounded-xl border border-fd-border">
          <table className="w-full text-left text-sm">
            <thead className="bg-fd-muted/50 text-fd-muted-foreground">
              <tr>
                <th className="px-4 py-2.5 font-medium">你更像</th>
                <th className="px-4 py-2.5 font-medium">顺序</th>
                <th className="px-4 py-2.5 font-medium">可跳过</th>
              </tr>
            </thead>
            <tbody className="text-fd-muted-foreground">
              <tr className="border-t border-fd-border">
                <td className="px-4 py-3">设计师 / 玩法程序</td>
                <td className="px-4 py-3">序 → 卷二全部 → 卷一 04–06、12 → 卷三 17–18</td>
                <td className="px-4 py-3">卷三实现细节</td>
              </tr>
              <tr className="border-t border-fd-border">
                <td className="px-4 py-3">引擎 / 技术程序</td>
                <td className="px-4 py-3">序 → 卷二 01–02、07 → 卷三全部 → 卷四</td>
                <td className="px-4 py-3">卷一影像章可略</td>
              </tr>
              <tr className="border-t border-fd-border">
                <td className="px-4 py-3">制作人 / 商业</td>
                <td className="px-4 py-3">卷一全部 → 卷二 11–16 → 卷三 15–17</td>
                <td className="px-4 py-3">红石实现、渲染</td>
              </tr>
              <tr className="border-t border-fd-border">
                <td className="px-4 py-3">资深玩家通读</td>
                <td className="px-4 py-3">按卷顺序；每章先读简介与「要回答」</td>
                <td className="px-4 py-3">开发者侧重章可读命题与结尾</td>
              </tr>
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
}: {
  volume: TocVolume;
  filter: Filter;
  query: string;
}) {
  let n = 0;
  return (
    <div>
      <header className="mb-8 border-b border-fd-border pb-6">
        <p className="text-xs tracking-wide text-fd-muted-foreground uppercase">
          {volume.english}
        </p>
        <h2 className="mt-1 text-2xl font-semibold tracking-tight">
          {volume.roman ? `第 ${volume.roman} 卷 · ${volume.short}` : volume.short}
        </h2>
        <p className="mt-3 max-w-3xl text-[0.9375rem] leading-7 text-fd-muted-foreground">
          {volume.thesis}
        </p>
        <p className="mt-3 max-w-3xl text-sm leading-6">
          <span className="text-fd-muted-foreground">爱好者带走：</span>
          {volume.payoffFan}
        </p>
        <p className="mt-1 max-w-3xl text-sm leading-6">
          <span className="text-fd-muted-foreground">开发者带走：</span>
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
                      <ChapterRow chapter={ch} num={num} />
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

function ChapterRow({ chapter, num }: { chapter: TocChapter; num: number }) {
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
            <span className="rounded-md border border-fd-border px-1.5 py-0.5">已写</span>
          ) : (
            <span className="rounded-md px-1.5 py-0.5 text-fd-muted-foreground">未写</span>
          )}
          <span className="rounded-md px-1.5 py-0.5 text-fd-muted-foreground">{AUDIENCE[chapter.audience]}</span>
          {chapter.tags.map((t) => (
            <span key={t} className="rounded-md bg-fd-muted px-1.5 py-0.5 text-fd-muted-foreground">
              {t}
            </span>
          ))}
        </div>
      </div>
      <details className="mt-2 group">
        <summary className="cursor-pointer text-sm text-fd-muted-foreground hover:text-fd-foreground [&::-webkit-details-marker]:hidden">
          简介与节大纲
        </summary>
        <div className="mt-3 max-w-3xl pb-1">
          <p className="text-sm leading-6 text-fd-muted-foreground">{chapter.desc}</p>
          {chapter.question ? (
            <p className="mt-2 text-sm leading-6">
              <span className="text-fd-muted-foreground">要回答：</span>
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
