import { tagId, type TaggedArticle, type TagWithCount } from './tag-utils';

export type MapArticle = {
  id: string;
  title: string;
  description: string;
  topic: string;
  tags: string[];
};

export type MapTag = { id: string; count: number; topic: string };
export type KnowledgeMapData = { articles: MapArticle[]; tags: MapTag[] };

/** Adapt the shared tag index to Elytra's map format; topic is the book volume. */
export function buildKnowledgeMapData(data: { articles: TaggedArticle[]; tags: TagWithCount[] }): KnowledgeMapData {
  const articles = data.articles.map((article) => ({
    id: article.url,
    title: article.title,
    description: article.description,
    topic: article.volume,
    tags: [...new Set(article.tags.map(tagId))],
  }));
  const tagVolumes = new Map<string, Map<string, number>>();
  for (const article of articles) {
    for (const tag of article.tags) {
      const volumes = tagVolumes.get(tag) ?? new Map<string, number>();
      volumes.set(article.topic, (volumes.get(article.topic) ?? 0) + 1);
      tagVolumes.set(tag, volumes);
    }
  }
  const tags = data.tags.map(({ id, count }) => {
    const volumes = tagVolumes.get(id);
    const topic = volumes
      ? [...volumes].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))[0]?.[0]
      : undefined;
    return { id, count, topic: topic ?? 'prelude' };
  });
  return { articles, tags };
}
