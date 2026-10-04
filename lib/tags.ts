import { getPageTitle, source } from './source';
import { folderOrder } from './shared';
import { countTags, normalizeTags, tagId, type TaggedArticle } from './tag-utils';

export const volumeLabels: Record<string, string> = {
  prelude: '序言', history: '卷一 · 历史与商业', design: '卷二 · 游戏设计',
  impl: '卷三 · 技术实现', rewrite: '卷四 · 重新发明', extras: '番外', appendix: '附录', toc: '全书目录',
};

export function isCurrentBookPage(slugs: string[]): boolean {
  return (folderOrder as readonly string[]).includes(slugs[0]) || slugs[0] === 'toc';
}

/** Current Chinese edition only; translated and historical editions have separate URLs. */
export function getTaggedArticles(): TaggedArticle[] {
  return source.getPages().filter((page) => isCurrentBookPage(page.slugs))
    .map((page) => ({
      url: page.url,
      title: getPageTitle(page),
      description: page.data.description ?? '',
      volume: page.slugs[0],
      tags: normalizeTags(page.data.tags),
    }))
    .filter((article) => article.tags.length > 0)
    .sort((a, b) => folderOrder.indexOf(a.volume as typeof folderOrder[number]) - folderOrder.indexOf(b.volume as typeof folderOrder[number])
      || a.url.localeCompare(b.url, 'zh-CN'));
}

export function getTagCounts() {
  return countTags(getTaggedArticles());
}

export function getArticlesByTag(tag: string) {
  const id = tagId(tag);
  return getTaggedArticles().filter((article) => article.tags.some((value) => tagId(value) === id));
}

export function resolveTag(tag: string) {
  return getTagCounts().find((entry) => entry.id === tagId(tag));
}

/** Serializable input for tag browsers and future maps. */
export function getTagData() {
  const articles = getTaggedArticles();
  return { tags: countTags(articles), articles };
}
