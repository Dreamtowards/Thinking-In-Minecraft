'use client';

import { useSearchParams } from 'next/navigation';
import type { KnowledgeMapData } from '@/lib/knowledge-map';
import { tagId } from '@/lib/tag-utils';
import { TagKnowledgeMap } from './tag-knowledge-map';
import './knowledge-map.css';

export function KnowledgeMap({ data }: { data: KnowledgeMapData }) {
  const params = useSearchParams();
  const tag = params.get('tag');
  return <TagKnowledgeMap data={data} initialArticle={params.get('article') ?? undefined}
    initialTag={tag === null ? undefined : tagId(tag)} />;
}
