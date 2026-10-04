export type TaggedArticle = {
  url: string;
  title: string;
  description: string;
  volume: string;
  tags: string[];
};

export type TagWithCount = { id: string; tag: string; count: number };

// Preserve punctuation: C++, C# and C must remain different tags.
export function tagId(tag: string): string {
  return tag.trim().normalize('NFC').toLowerCase();
}

export function tagHref(tag: string): string {
  return `/tags/${encodeURIComponent(tagId(tag))}`;
}

export function normalizeTags(tags: string[] = []): string[] {
  const unique = new Map<string, string>();
  for (const tag of tags) {
    const label = tag.trim().normalize('NFC');
    const id = tagId(label);
    if (id && !unique.has(id)) unique.set(id, label);
  }
  return [...unique.values()];
}

export function countTags(articles: TaggedArticle[]): TagWithCount[] {
  const counts = new Map<string, TagWithCount>();
  for (const article of articles) {
    for (const tag of normalizeTags(article.tags)) {
      const id = tagId(tag);
      const entry = counts.get(id);
      if (entry) entry.count++;
      else counts.set(id, { id, tag, count: 1 });
    }
  }
  return [...counts.values()].sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag, 'zh-CN'));
}
