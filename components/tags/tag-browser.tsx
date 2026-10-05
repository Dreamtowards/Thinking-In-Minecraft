import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { DocsPage, DocsTitle, DocsDescription } from 'fumadocs-ui/layouts/docs/page';
import { volumeLabels } from '@/lib/tags';
import type { TaggedArticle, TagWithCount } from '@/lib/tag-utils';
import { TagFilters } from './tag-filters';
import { TagLink } from './tag-link';
import { TagMapPreview } from '@/components/knowledge-map/tag-map-preview';

export function TagBrowser({ tags, articles, active }: { tags: TagWithCount[]; articles: TaggedArticle[]; active?: TagWithCount }) {
  return (
    <DocsPage full>
      <DocsTitle>{active ? `标签：${active.tag}` : '标签'}</DocsTitle>
      <DocsDescription>沿着同一个主题，探索历史、设计、技术与重新发明之间的联系。</DocsDescription>
      {!active && <TagMapPreview />}
      <TagFilters tags={tags} activeId={active?.id} />
      <section className="mt-8 space-y-4" aria-label="相关章节">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-lg font-semibold">{active ? `${active.count} 篇相关章节` : `已添加标签的章节 · ${articles.length}`}</h2>
          {active && <Link href="/tags" className="text-sm text-fd-muted-foreground hover:text-fd-foreground">全部标签</Link>}
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {articles.map((article) => (
            <article key={article.url} className="rounded-xl border bg-fd-card p-5">
              <p className="mb-2 text-xs text-fd-muted-foreground">{volumeLabels[article.volume] ?? article.volume}</p>
              <Link href={article.url} className="group flex items-start justify-between gap-3 font-medium hover:text-fd-primary">
                {article.title}<ArrowRight size={16} aria-hidden="true" className="mt-1 shrink-0 transition-transform group-hover:translate-x-1" />
              </Link>
              {article.description && <p className="mt-2 text-sm leading-relaxed text-fd-muted-foreground">{article.description}</p>}
              <div className="mt-4 flex flex-wrap gap-1.5">
                {article.tags.map((tag) => <TagLink key={tag} tag={tag} />)}
              </div>
            </article>
          ))}
        </div>
      </section>
    </DocsPage>
  );
}
