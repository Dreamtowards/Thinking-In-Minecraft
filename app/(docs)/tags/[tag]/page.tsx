import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { TagBrowser } from '@/components/tags/tag-browser';
import { getArticlesByTag, getTagCounts, resolveTag } from '@/lib/tags';

export function generateStaticParams() {
  return getTagCounts().map(({ id }) => ({ tag: id }));
}

function resolveTagParam(value: string) {
  // This Next.js version can pass percent-encoded dynamic segments through.
  const direct = resolveTag(value);
  if (direct) return direct;
  try {
    return resolveTag(decodeURIComponent(value));
  } catch {
    return undefined;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ tag: string }> }): Promise<Metadata> {
  const active = resolveTagParam((await params).tag);
  if (!active) notFound();
  return { title: `标签：${active.tag}`, description: `探索与“${active.tag}”有关的 ${active.count} 篇章节。` };
}

export default async function TagPage({ params }: { params: Promise<{ tag: string }> }) {
  const active = resolveTagParam((await params).tag);
  if (!active) notFound();
  return <TagBrowser tags={getTagCounts()} articles={getArticlesByTag(active.id)} active={active} />;
}
