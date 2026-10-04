import { getArticlesByTag, getTagData, resolveTag } from '@/lib/tags';

export function GET(request: Request) {
  const tag = new URL(request.url).searchParams.get('tag');
  if (tag === null) return Response.json(getTagData());
  const active = resolveTag(tag);
  if (!active) return Response.json({ error: '标签不存在' }, { status: 404 });
  return Response.json({ tag: active, articles: getArticlesByTag(active.id) });
}
