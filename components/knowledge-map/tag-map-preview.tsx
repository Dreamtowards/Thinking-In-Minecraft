import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { forceCollide, forceLink, forceManyBody, forceSimulation, forceX, forceY, type SimulationNodeDatum } from 'd3-force';
import { buildKnowledgeMapData, type MapTag } from '@/lib/knowledge-map';
import { getTagData } from '@/lib/tags';
import { topicColor } from './topic-colors';

type PreviewNode = MapTag & SimulationNodeDatum;
type PreviewEdge = { source: string | PreviewNode; target: string | PreviewNode; count: number };

export function TagMapPreview() {
  const data = buildKnowledgeMapData(getTagData());
  const nodes: PreviewNode[] = data.tags.filter((tag) => tag.count >= 2)
    .sort((a, b) => b.count - a.count || a.id.localeCompare(b.id))
    .slice(0, 16).map((tag) => ({ ...tag }));
  const ids = new Set(nodes.map((node) => node.id));
  const pairs = new Map<string, PreviewEdge>();
  for (const article of data.articles) {
    const tags = article.tags.filter((tag) => ids.has(tag)).sort();
    for (let i = 0; i < tags.length; i++) {
      for (let j = i + 1; j < tags.length; j++) {
        const key = `${tags[i]}\0${tags[j]}`;
        const pair = pairs.get(key) ?? { source: tags[i], target: tags[j], count: 0 };
        pair.count++;
        pairs.set(key, pair);
      }
    }
  }
  const degrees = new Map<string, number>();
  const edges = [...pairs.values()]
    .sort((a, b) => b.count - a.count || String(a.source).localeCompare(String(b.source)) || String(a.target).localeCompare(String(b.target)))
    .filter((edge) => {
      const source = String(edge.source);
      const target = String(edge.target);
      if ((degrees.get(source) ?? 0) >= 4 || (degrees.get(target) ?? 0) >= 4) return false;
      degrees.set(source, (degrees.get(source) ?? 0) + 1);
      degrees.set(target, (degrees.get(target) ?? 0) + 1);
      return true;
    });

  // A fixed layout makes the preview available without client JavaScript or animation.
  forceSimulation(nodes).stop()
    .force('link', forceLink<PreviewNode, PreviewEdge>(edges).id((node) => node.id).distance(105))
    .force('charge', forceManyBody().strength(-350))
    .force('collide', forceCollide<PreviewNode>((node) => Math.max(35, node.id.length * 3.4)))
    .force('x', forceX(0).strength(0.08))
    .force('y', forceY(0).strength(0.16))
    .tick(160);

  const padding = 90;
  const minX = Math.min(0, ...nodes.map((node) => node.x ?? 0)) - padding;
  const minY = Math.min(0, ...nodes.map((node) => node.y ?? 0)) - padding;
  const width = Math.max(1, Math.max(0, ...nodes.map((node) => node.x ?? 0)) + padding - minX);
  const height = Math.max(1, Math.max(0, ...nodes.map((node) => node.y ?? 0)) + padding - minY);

  return (
    <section aria-label="标签节点图预览" className="not-prose relative mb-6 overflow-hidden rounded-xl border bg-fd-card">
      <Link href="/map?view=tags" className="absolute right-3 top-3 z-10 inline-flex items-center gap-1 rounded-md border bg-fd-background/80 px-2 py-1 text-xs text-fd-muted-foreground backdrop-blur-sm hover:bg-fd-accent hover:text-fd-foreground">
        完整地图 <ArrowUpRight size={13} aria-hidden="true" />
      </Link>
      {nodes.length > 0 ? (
        <svg viewBox={`${minX} ${minY} ${width} ${height}`} className="block h-52 w-full sm:h-60" role="group" aria-label="高频标签与共同章节的联系">
          <g stroke="currentColor" className="text-fd-muted-foreground" opacity={0.2} aria-hidden="true">
            {edges.map((edge, index) => {
              const source = edge.source as PreviewNode;
              const target = edge.target as PreviewNode;
              return <line key={index} x1={source.x} y1={source.y} x2={target.x} y2={target.y} strokeWidth={Math.min(4, 1 + edge.count * 0.4)} />;
            })}
          </g>
          {nodes.map((node) => (
            <a key={node.id} href={`/map?view=tags&tag=${encodeURIComponent(node.id)}`} aria-label={`${node.id}，${node.count} 篇章节，打开标签地图`} className="group outline-none">
              <title>{node.id} · {node.count} 篇章节</title>
              <circle cx={node.x} cy={node.y} r={24} fill="transparent" />
              <circle cx={node.x} cy={node.y} r={Math.min(15, 6 + Math.sqrt(node.count) * 2)} fill={topicColor(node.topic)} className="stroke-transparent group-hover:stroke-current group-focus:stroke-current" strokeWidth={3} />
              <text x={node.x} y={(node.y ?? 0) + 29} textAnchor="middle" fill="currentColor" fontSize={13} className="font-medium">{node.id}</text>
            </a>
          ))}
        </svg>
      ) : (
        <p className="px-4 py-8 text-center text-sm text-fd-muted-foreground">标签在多篇章节中出现后，会在这里形成节点图。</p>
      )}
    </section>
  );
}
