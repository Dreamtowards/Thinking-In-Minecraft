import { Suspense } from 'react';
import type { Metadata } from 'next';
import { KnowledgeMap } from '@/components/knowledge-map/knowledge-map';
import { buildKnowledgeMapData } from '@/lib/knowledge-map';
import { getTagData } from '@/lib/tags';

export const metadata: Metadata = {
  title: '标签地图',
  description: '从英文标签出发，探索《Minecraft 设计思想》跨卷章节与主题之间的联系。',
};

export default function MapPage() {
  return (
    <main className="map-page">
      <Suspense fallback={<p className="p-6 text-fd-muted-foreground" role="status">正在加载标签地图…</p>}>
        <KnowledgeMap data={buildKnowledgeMapData(getTagData())} />
      </Suspense>
    </main>
  );
}
