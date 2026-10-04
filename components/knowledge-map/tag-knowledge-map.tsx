'use client';

import { forceCollide, forceLink, forceManyBody, forceSimulation, forceX, forceY } from 'd3-force';
import Link from 'next/link';
import { ArrowRight, Compass, Minus, Plus, RotateCcw, Search, X } from 'lucide-react';
import { useEffect, useMemo, useRef, useState, type PointerEvent } from 'react';
import type { KnowledgeMapData, MapArticle } from '@/lib/knowledge-map';
import { mapVolumes, topicColor } from './topic-colors';
import { navigateMap } from './map-navigation';

type Node = {
  id: string;
  kind: 'tag' | 'article';
  label: string;
  topic: string;
  count: number;
  x: number;
  y: number;
  anchorX: number;
  anchorY: number;
  fx?: number | null;
  fy?: number | null;
};
type Edge = { source: string | Node; target: string | Node; count: number; kind: 'cooccurrence' | 'membership' };
type View = { x: number; y: number; width: number; height: number };
type Drag = { kind: 'pan'; x: number; y: number; view: View } | { kind: 'node'; id: string; x: number; y: number; moved: boolean };

const BASE_VIEW: View = { x: 0, y: 0, width: 1000, height: 640 };
const tagNodeId = (id: string) => `tag:${id}`;
const edgeId = (end: string | Node) => typeof end === 'string' ? end : end.id;

function hash(value: string) {
  let result = 0;
  for (const character of value) result = (result * 31 + character.charCodeAt(0)) | 0;
  return result >>> 0;
}

function zoomView(view: View, factor: number): View {
  const width = Math.max(350, Math.min(1900, view.width * factor));
  const height = width * 0.64;
  return { x: view.x + (view.width - width) / 2, y: view.y + (view.height - height) / 2, width, height };
}

export function TagKnowledgeMap({ data, initialArticle, initialTag }: {
  data: KnowledgeMapData;
  initialArticle?: string;
  initialTag?: string;
}) {
  const firstArticle = data.articles.find((article) => article.id === initialArticle);
  const validTag = initialTag !== undefined && data.tags.some((tag) => tag.id === initialTag)
    && (!firstArticle || firstArticle.tags.includes(initialTag)) ? initialTag : undefined;
  const selectedTag = validTag ?? firstArticle?.tags[0] ?? null;
  const selectedArticle = firstArticle?.id ?? null;
  const [focusMode, setFocusMode] = useState(false);
  const [search, setSearch] = useState('');
  const [tagFilter, setTagFilter] = useState('');
  const [view, setView] = useState<View>(BASE_VIEW);
  const [positions, setPositions] = useState<Record<string, { x: number; y: number }>>({});
  const [hint, setHint] = useState<{ x: number; y: number; count: number } | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const nodesRef = useRef<Map<string, Node>>(new Map());
  const simulationRef = useRef<ReturnType<typeof forceSimulation<Node>> | null>(null);
  const dragRef = useRef<Drag | null>(null);
  const reducedMotionRef = useRef(false);
  const articlesById = useMemo(() => new Map(data.articles.map((article) => [article.id, article])), [data.articles]);
  const tagsById = useMemo(() => new Map(data.tags.map((tag) => [tag.id, tag])), [data.tags]);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    // React's passive wheel listener cannot prevent page scrolling over the map.
    const wheel = (event: WheelEvent) => {
      event.preventDefault();
      setView((current) => zoomView(current, event.deltaY > 0 ? 1.12 : 0.89));
    };
    svg.addEventListener('wheel', wheel, { passive: false });
    return () => svg.removeEventListener('wheel', wheel);
  }, []);

  const cooccurrence = useMemo(() => {
    const pairs = new Map<string, { first: string; second: string; count: number }>();
    for (const article of data.articles) {
      const tags = [...new Set(article.tags)].sort();
      for (let i = 0; i < tags.length; i++) {
        for (let j = i + 1; j < tags.length; j++) {
          const key = `${tags[i]}\0${tags[j]}`;
          const pair = pairs.get(key) ?? { first: tags[i], second: tags[j], count: 0 };
          pair.count++;
          pairs.set(key, pair);
        }
      }
    }
    return [...pairs.values()];
  }, [data.articles]);

  const graph = useMemo(() => {
    const nodes: Node[] = [];
    const edges: Edge[] = [];
    if (!selectedTag) {
      const overviewTags = data.tags.filter((tag) => tag.count >= (focusMode ? 3 : 2));
      const overviewIds = new Set(overviewTags.map((tag) => tag.id));
      for (const tag of overviewTags) {
        const angle = (hash(tag.id) % 6283) / 1000;
        const radius = 130 + (hash(`${tag.id}:radius`) % 170);
        const x = 500 + Math.cos(angle) * radius;
        const y = 320 + Math.sin(angle) * radius * 0.7;
        nodes.push({ id: tagNodeId(tag.id), kind: 'tag', label: tag.id, topic: tag.topic, count: tag.count, x, y, anchorX: x, anchorY: y });
      }
      const candidates = cooccurrence
        .filter((pair) => overviewIds.has(pair.first) && overviewIds.has(pair.second) && pair.count >= (focusMode ? 2 : 1))
        .sort((a, b) => b.count - a.count || a.first.localeCompare(b.first) || a.second.localeCompare(b.second));
      const degrees = new Map<string, number>();
      for (const pair of candidates) {
        if ((degrees.get(pair.first) ?? 0) >= 4 || (degrees.get(pair.second) ?? 0) >= 4) continue;
        edges.push({ source: tagNodeId(pair.first), target: tagNodeId(pair.second), count: pair.count, kind: 'cooccurrence' });
        degrees.set(pair.first, (degrees.get(pair.first) ?? 0) + 1);
        degrees.set(pair.second, (degrees.get(pair.second) ?? 0) + 1);
      }
    } else {
      const tag = tagsById.get(selectedTag);
      if (!tag) return { nodes, edges };
      nodes.push({ id: tagNodeId(tag.id), kind: 'tag', label: tag.id, topic: tag.topic, count: tag.count, x: 330, y: 320, anchorX: 330, anchorY: 320 });
      const articles = data.articles.filter((article) => article.tags.includes(selectedTag));
      const related = cooccurrence
        .filter((pair) => pair.first === selectedTag || pair.second === selectedTag)
        .map((pair) => ({ id: pair.first === selectedTag ? pair.second : pair.first, count: pair.count }))
        .sort((a, b) => b.count - a.count || a.id.localeCompare(b.id, 'zh-CN'))
        .slice(0, focusMode ? 0 : 14);
      for (const [index, article] of articles.entries()) {
        const angle = -Math.PI / 2 + (index / articles.length) * Math.PI * 2;
        const x = 430 + Math.cos(angle) * 175;
        const y = 320 + Math.sin(angle) * 220;
        nodes.push({ id: article.id, kind: 'article', label: article.title, topic: article.topic, count: 0, x, y, anchorX: x, anchorY: y });
        edges.push({ source: tagNodeId(selectedTag), target: article.id, count: 1, kind: 'membership' });
      }
      for (const [index, item] of related.entries()) {
        const relatedTag = tagsById.get(item.id);
        if (!relatedTag) continue;
        const angle = -Math.PI / 2 + (index / related.length) * Math.PI * 2;
        const x = 770 + Math.cos(angle) * 125;
        const y = 320 + Math.sin(angle) * 240;
        nodes.push({ id: tagNodeId(item.id), kind: 'tag', label: item.id, topic: relatedTag.topic, count: relatedTag.count, x, y, anchorX: x, anchorY: y });
        for (const article of articles) {
          if (article.tags.includes(item.id)) edges.push({ source: article.id, target: tagNodeId(item.id), count: 1, kind: 'membership' });
        }
      }
    }
    return { nodes, edges };
  }, [cooccurrence, data.articles, data.tags, focusMode, selectedTag, tagsById]);

  useEffect(() => {
    const nodes = graph.nodes.map((node) => ({ ...node }));
    const edges = graph.edges.map((edge) => ({ ...edge }));
    nodesRef.current = new Map(nodes.map((node) => [node.id, node]));
    setPositions(Object.fromEntries(nodes.map((node) => [node.id, { x: node.x, y: node.y }])));
    const simulation = forceSimulation(nodes)
      .force('links', forceLink<Node, Edge>(edges).id((node) => node.id)
        .distance((edge) => edge.kind === 'cooccurrence' ? 115 : 135)
        .strength((edge) => edge.kind === 'cooccurrence' ? 0.08 : 0.13))
      .force('charge', forceManyBody<Node>().strength((node) => node.kind === 'tag' ? -270 : -110))
      .force('collision', forceCollide<Node>().radius((node) => node.kind === 'tag' ? 43 : 27).strength(0.9))
      .force('x', forceX<Node>((node) => node.anchorX).strength(0.16))
      .force('y', forceY<Node>((node) => node.anchorY).strength(0.16))
      .alphaDecay(0.055)
      .on('tick', () => setPositions(Object.fromEntries(nodes.map((node) => [node.id, { x: node.x, y: node.y }]))));
    simulationRef.current = simulation;
    reducedMotionRef.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotionRef.current) {
      simulation.stop();
      simulation.tick(160);
      setPositions(Object.fromEntries(nodes.map((node) => [node.id, { x: node.x, y: node.y }])));
    }
    return () => {
      simulation.stop();
      if (simulationRef.current === simulation) simulationRef.current = null;
    };
  }, [graph]);

  const selectedTagData = selectedTag ? tagsById.get(selectedTag) : undefined;
  const activeArticle = selectedArticle ? articlesById.get(selectedArticle) : undefined;
  const taggedArticles = selectedTag ? data.articles.filter((article) => article.tags.includes(selectedTag)) : [];
  const relatedTags = selectedTag ? cooccurrence
    .filter((pair) => pair.first === selectedTag || pair.second === selectedTag)
    .map((pair) => ({ id: pair.first === selectedTag ? pair.second : pair.first, count: pair.count }))
    .sort((a, b) => b.count - a.count || a.id.localeCompare(b.id, 'zh-CN')) : [];
  const query = search.trim().toLocaleLowerCase();
  const matchedTags = query ? data.tags.filter((tag) => tag.id.toLocaleLowerCase().includes(query)).slice(0, 5) : [];
  const matchedArticles = query ? data.articles.filter((article) =>
    [article.title, article.description, ...article.tags].some((value) => value.toLocaleLowerCase().includes(query))).slice(0, 5) : [];
  const sidebarTags = data.tags.filter((tag) => tag.id.toLocaleLowerCase().includes(tagFilter.trim().toLocaleLowerCase()));

  function selectTag(tag: string | null) {
    setSearch('');
    setHint(null);
    setView(BASE_VIEW);
    navigateMap(tag ? `/map?view=tags&tag=${encodeURIComponent(tag)}` : '/map?view=tags');
  }

  function selectArticle(article: MapArticle) {
    const tag = selectedTag && article.tags.includes(selectedTag) ? selectedTag : article.tags[0];
    setSearch('');
    setHint(null);
    setView(BASE_VIEW);
    navigateMap(`/map?view=tags&article=${encodeURIComponent(article.id)}${tag ? `&tag=${encodeURIComponent(tag)}` : ''}`);
  }

  function selectNode(id: string) {
    if (id.startsWith('tag:')) selectTag(id.slice(4));
    else {
      const article = articlesById.get(id);
      if (article) selectArticle(article);
    }
  }

  function graphPoint(event: PointerEvent<SVGSVGElement>) {
    const svg = svgRef.current;
    if (!svg) return null;
    const point = svg.createSVGPoint();
    point.x = event.clientX;
    point.y = event.clientY;
    const matrix = svg.getScreenCTM();
    return matrix ? point.matrixTransform(matrix.inverse()) : null;
  }

  function startNodeDrag(event: PointerEvent<SVGGElement>, id: string) {
    event.stopPropagation();
    const node = nodesRef.current.get(id);
    if (!node) return;
    node.fx = node.x;
    node.fy = node.y;
    if (!reducedMotionRef.current) simulationRef.current?.alphaTarget(0.2).restart();
    dragRef.current = { kind: 'node', id, x: event.clientX, y: event.clientY, moved: false };
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function movePointer(event: PointerEvent<SVGSVGElement>) {
    const drag = dragRef.current;
    if (!drag) return;
    if (drag.kind === 'pan') {
      const matrix = event.currentTarget.getScreenCTM();
      if (!matrix) return;
      const factor = 1 / Math.hypot(matrix.a, matrix.b);
      setView({ ...drag.view, x: drag.view.x - (event.clientX - drag.x) * factor, y: drag.view.y - (event.clientY - drag.y) * factor });
      return;
    }
    const node = nodesRef.current.get(drag.id);
    const point = graphPoint(event);
    if (!node || !point) return;
    if (Math.hypot(event.clientX - drag.x, event.clientY - drag.y) > 5) drag.moved = true;
    node.fx = point.x;
    node.fy = point.y;
    if (reducedMotionRef.current) {
      node.x = point.x;
      node.y = point.y;
      setPositions((current) => ({ ...current, [node.id]: { x: point.x, y: point.y } }));
    } else simulationRef.current?.alpha(0.2).restart();
  }

  function endPointer(event: PointerEvent<SVGSVGElement>) {
    const drag = dragRef.current;
    if (!drag) return;
    dragRef.current = null;
    if (drag.kind === 'node') {
      const node = nodesRef.current.get(drag.id);
      if (node) { node.fx = null; node.fy = null; }
      simulationRef.current?.alphaTarget(0);
      if (!drag.moved && event.type !== 'pointercancel') selectNode(drag.id);
    }
  }

  return <div className="knowledge-map">
    <div className="km-shell">
      <aside className="km-topics" aria-label="标签选择">
        <div className="km-panel-title"><Compass size={17} aria-hidden="true" /><h1>标签地图</h1></div>
        <Link href="/toc" className="km-back-link">← 返回全书目录</Link>
        <nav className="km-mode-switch" aria-label="标签浏览方式">
          <Link href="/tags">列表</Link>
          <Link href="/map?view=tags" className="is-active" aria-current="page">节点</Link>
        </nav>
        <p className="km-sidebar-caption">{data.articles.length} 篇文章 · {data.tags.length} 个标签</p>
        <label className="km-tag-filter"><Search size={14} aria-hidden="true" /><input value={tagFilter} onChange={(event) => setTagFilter(event.target.value)} placeholder="筛选标签" aria-label="筛选标签" /></label>
        <div className="km-sidebar-list">
          <button type="button" className={`km-topic ${!selectedTag ? 'is-active' : ''}`} aria-pressed={!selectedTag} onClick={() => selectTag(null)}>
            <span className="km-topic-mark km-topic-all" />标签总览<span className="km-topic-count">{data.tags.length}</span>
          </button>
          {sidebarTags.map((tag) => <button key={tag.id} type="button" className={`km-topic ${selectedTag === tag.id ? 'is-active' : ''}`} aria-pressed={selectedTag === tag.id} onClick={() => selectTag(tag.id)}>
            <span className="km-topic-mark" style={{ backgroundColor: topicColor(tag.topic) }} />
            <span className="km-tag-name">{tag.id}</span><span className="km-topic-count">{tag.count}</span>
          </button>)}
          {sidebarTags.length === 0 && <p className="km-topics-note">没有匹配的标签。</p>}
        </div>
        <div className="km-volume-legend" aria-label="节点颜色">
          {mapVolumes.map((volume) => <span key={volume.id}><i className="km-topic-mark" style={{ backgroundColor: topicColor(volume.id) }} aria-hidden="true" />{volume.label}</span>)}
        </div>
      </aside>

      <div className="km-main">
        <div className="km-toolbar">
          <div className="km-search-wrap">
            <Search size={17} aria-hidden="true" />
            <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="搜索标签或文章" aria-label="搜索标签或文章" />
            {search && <button type="button" aria-label="清除搜索" onClick={() => setSearch('')}><X size={16} /></button>}
            {search && <div className="km-search-results" role="listbox" aria-label="搜索结果">
              {matchedTags.map((tag) => <button type="button" role="option" aria-selected={false} key={tag.id} onClick={() => selectTag(tag.id)}><span>#{tag.id}</span><small>{tag.count} 篇</small></button>)}
              {matchedArticles.map((article) => <button type="button" role="option" aria-selected={false} key={article.id} onClick={() => selectArticle(article)}><span>{article.title}</span><small>文章</small></button>)}
              {!matchedTags.length && !matchedArticles.length && <p>没有匹配的内容</p>}
            </div>}
          </div>
          <div className="km-toolbar-hint"><span className="km-legend-line" />共同出现 <span className="km-legend-line is-dashed" />文章标签</div>
          <button type="button" className={`km-focus-toggle ${focusMode ? 'is-active' : ''}`} aria-pressed={focusMode} onClick={() => setFocusMode((current) => !current)}>
            <span className="km-focus-indicator" aria-hidden="true" />聚焦模式
          </button>
          <div className="km-zoom" aria-label="地图视图控制">
            <button type="button" aria-label="缩小地图" onClick={() => setView((current) => zoomView(current, 1.2))}><Minus size={17} /></button>
            <button type="button" aria-label="重置视图" onClick={() => setView(BASE_VIEW)}><RotateCcw size={15} /></button>
            <button type="button" aria-label="放大地图" onClick={() => setView((current) => zoomView(current, 0.83))}><Plus size={17} /></button>
          </div>
        </div>
        <div className="km-canvas-wrap">
          {graph.nodes.length === 0 && <div className="km-empty" role="status">
            <strong>{data.tags.length === 0 ? '还没有标签' : '当前总览没有符合条件的标签'}</strong>
            <p>{data.tags.length === 0 ? '章节添加英文标签后，节点和联系会自动出现在这里。' : '从左侧选择一个标签查看文章，或关闭聚焦模式。'}</p>
          </div>}
          <svg ref={svgRef} className="km-canvas" viewBox={`${view.x} ${view.y} ${view.width} ${view.height}`} preserveAspectRatio="xMidYMid meet"
            role="img" aria-label={selectedTag ? `${selectedTag}标签文章关系图` : '文章标签共现关系图'}
            onPointerMove={movePointer} onPointerUp={endPointer} onPointerCancel={endPointer}>
            <rect x={view.x - 1000} y={view.y - 1000} width={view.width + 2000} height={view.height + 2000} fill="transparent"
              onPointerDown={(event) => { dragRef.current = { kind: 'pan', x: event.clientX, y: event.clientY, view }; event.currentTarget.setPointerCapture(event.pointerId); }} />
            <g className="km-links">
              {graph.edges.map((edge, index) => {
                const source = positions[edgeId(edge.source)] ?? nodesRef.current.get(edgeId(edge.source));
                const target = positions[edgeId(edge.target)] ?? nodesRef.current.get(edgeId(edge.target));
                if (!source || !target) return null;
                return <g key={`${edgeId(edge.source)}-${edgeId(edge.target)}-${index}`}>
                  <line x1={source.x} y1={source.y} x2={target.x} y2={target.y} className={`km-link km-tag-${edge.kind}`} strokeWidth={edge.kind === 'cooccurrence' ? Math.min(4, 1.3 + edge.count * 0.65) : undefined} />
                  {edge.kind === 'cooccurrence' && <line x1={source.x} y1={source.y} x2={target.x} y2={target.y} className="km-link-hit"
                    onMouseMove={(event) => {
                      const bounds = event.currentTarget.ownerSVGElement?.getBoundingClientRect();
                      if (bounds) setHint({ x: Math.max(8, Math.min(event.clientX - bounds.left + 14, bounds.width - 180)), y: Math.max(8, Math.min(event.clientY - bounds.top + 14, bounds.height - 65)), count: edge.count });
                    }} onMouseLeave={() => setHint(null)} />}
                </g>;
              })}
            </g>
            <g className="km-nodes">
              {graph.nodes.map((node) => {
                const position = positions[node.id] ?? node;
                const active = node.kind === 'tag' ? selectedTag === node.label : selectedArticle === node.id;
                const color = topicColor(node.topic);
                return <g key={node.id} transform={`translate(${position.x}, ${position.y})`}
                  className={`km-node km-node-${node.kind} ${active ? 'is-selected' : ''}`}
                  role="button" tabIndex={0} aria-label={node.kind === 'tag' ? `${node.label}标签，${node.count}篇文章` : node.label}
                  onPointerDown={(event) => startNodeDrag(event, node.id)}
                  onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); selectNode(node.id); } }}>
                  {node.kind === 'tag' ? <>
                    <circle r="34" className="km-node-halo" fill={color} />
                    <circle r={Math.min(26, 15 + Math.sqrt(node.count) * 2)} className="km-node-disc" fill={color} />
                    <text className="km-node-tag-label" y="48" textAnchor="middle">{node.label}</text>
                  </> : <>
                    <circle r="15" className="km-article-halo" fill={color} />
                    <circle r="8" className="km-article-disc" fill={color} />
                    <text className="km-node-article-label" y="-20" textAnchor="middle">{node.label.length > 15 ? `${node.label.slice(0, 14)}…` : node.label}</text>
                  </>}
                </g>;
              })}
            </g>
          </svg>
          {hint && <div className="km-link-hint" style={{ left: hint.x, top: hint.y }} role="status"><strong>共同出现</strong><span>{hint.count} 篇文章同时使用这两个标签</span></div>}
        </div>
      </div>

      <aside className="km-detail" aria-live="polite">
        {activeArticle ? <>
          <div className="km-detail-kicker"><span className="km-topic-mark" style={{ backgroundColor: topicColor(activeArticle.topic) }} />文章</div>
          <h2>{activeArticle.title}</h2>
          <p className="km-detail-description">{activeArticle.description}</p>
          <Link className="km-read-link" href={activeArticle.id}>阅读文章 <ArrowRight size={17} aria-hidden="true" /></Link>
          <div className="km-related"><h3>这篇文章的标签</h3>
            {activeArticle.tags.map((tag) => <button type="button" key={tag} onClick={() => selectTag(tag)}><span>#{tag}</span></button>)}
          </div>
        </> : selectedTagData ? <>
          <div className="km-detail-kicker"><span className="km-topic-mark" style={{ backgroundColor: topicColor(selectedTagData.topic) }} />标签</div>
          <h2>#{selectedTagData.id}</h2>
          <p className="km-detail-description">{selectedTagData.count} 篇文章使用这个标签。</p>
          <Link className="km-read-link" href={`/tags/${encodeURIComponent(selectedTagData.id)}`}>查看章节列表 <ArrowRight size={17} aria-hidden="true" /></Link>
          <div className="km-related"><h3>相关文章</h3>
            {taggedArticles.map((article) => <button type="button" key={article.id} onClick={() => selectArticle(article)}><span>{article.title}</span></button>)}
          </div>
          {relatedTags.length > 0 && <div className="km-related"><h3>经常一起出现的标签</h3>
            {relatedTags.slice(0, 8).map((tag) => <button type="button" key={tag.id} onClick={() => selectTag(tag.id)}><span>#{tag.id}</span><small>共同出现于 {tag.count} 篇文章</small></button>)}
          </div>}
        </> : <>
          <div className="km-detail-kicker"><span className="km-topic-mark km-topic-all" />标签网络</div>
          <h2>从标签发现联系</h2>
          <p className="km-detail-description">地图显示至少出现在两篇文章中的标签。连线表示两个标签曾用于同一篇文章，线越粗，共同出现的次数越多。</p>
          <p className="km-detail-description">选择标签可查看它关联的文章和其他标签。侧栏也能找到只出现一次的标签。</p>
          <p className="km-detail-description">聚焦模式只保留至少出现在三篇文章中的标签；选中标签后，只显示它与文章的联系。颜色表示卷归属，跨卷标签按出现最多的卷配色。</p>
        </>}
      </aside>
    </div>
  </div>;
}
