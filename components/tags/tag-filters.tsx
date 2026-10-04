'use client';

import { ChevronDown, Search } from 'lucide-react';
import { useId, useState } from 'react';
import type { TagWithCount } from '@/lib/tag-utils';
import { TagLink } from './tag-link';

const FEATURED_COUNT = 12;

export function TagFilters({ tags, activeId }: { tags: TagWithCount[]; activeId?: string }) {
  const [expanded, setExpanded] = useState(false);
  const [query, setQuery] = useState('');
  const listId = useId();
  const featured = tags.slice(0, FEATURED_COUNT);
  const selected = tags.find((tag) => tag.id === activeId);
  if (selected && !featured.includes(selected)) featured.splice(FEATURED_COUNT - 1, 1, selected);
  const matches = [...tags].sort((a, b) => a.tag.localeCompare(b.tag, 'zh-CN'))
    .filter((tag) => tag.tag.toLowerCase().includes(query.trim().toLowerCase()));

  if (tags.length === 0) return <p className="rounded-xl border bg-fd-card p-6 text-sm text-fd-muted-foreground">还没有标签。章节添加标签后，会在这里汇集成跨卷阅读入口。</p>;

  return (
    <section className="space-y-3" aria-label="按标签浏览">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-sm font-medium">按标签浏览</h2>
        <button type="button" onClick={() => setExpanded(!expanded)} aria-expanded={expanded} aria-controls={listId}
          className="inline-flex items-center gap-1 text-xs text-fd-muted-foreground hover:text-fd-foreground">
          {expanded ? '收起标签' : `搜索全部 ${tags.length} 个标签`}
          <ChevronDown size={14} aria-hidden="true" className={expanded ? 'rotate-180' : ''} />
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {featured.map(({ id, tag, count }) => <TagLink key={id} tag={tag} count={count} active={id === activeId} />)}
      </div>
      <div id={listId} hidden={!expanded} className="space-y-3 rounded-xl border bg-fd-card p-4">
        <div className="flex items-center gap-2 rounded-lg border bg-fd-background px-3 focus-within:border-fd-primary">
          <Search size={16} aria-hidden="true" className="text-fd-muted-foreground" />
          <input type="search" aria-label="搜索全部标签" placeholder="搜索标签" value={query}
            onChange={(event) => setQuery(event.target.value)} className="min-w-0 w-full bg-transparent py-2 text-sm outline-none" />
        </div>
        <p className="text-xs text-fd-muted-foreground" aria-live="polite">{matches.length} 个标签</p>
        <div className="flex max-h-60 flex-wrap gap-2 overflow-y-auto">
          {matches.map(({ id, tag, count }) => <TagLink key={id} tag={tag} count={count} active={id === activeId} />)}
          {matches.length === 0 && <p className="text-sm text-fd-muted-foreground">没有匹配的标签。</p>}
        </div>
      </div>
    </section>
  );
}
