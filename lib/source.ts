import { loader } from 'fumadocs-core/source';
import { lucideIconsPlugin } from 'fumadocs-core/source/lucide-icons';
import type { Item, Node, Root } from 'fumadocs-core/page-tree';
import { docsContentRoute, docsRoute } from './shared';
import { defineDocs } from 'fumadocs-mdx/macro';
import { metaSchema, pageSchema } from 'fumadocs-core/source/schema';
import { z } from 'zod';

const docs = defineDocs({
  dir: 'docs',
  docs: {
    // Keep scanning the existing VitePress tree; skip the old homepage and tooling dirs.
    files: ['**/*.md', '**/*.mdx', '!index.md', '!.vitepress/**', '!.obsidian/**'],
    schema: pageSchema.extend({
      title: z.string().optional(),
      description: z.string().optional(),
    }),
    postprocess: {
      includeProcessedMarkdown: true,
    },
  },
  meta: {
    files: ['**/meta.json'],
    schema: metaSchema,
  },
});

export const source = loader({
  baseUrl: docsRoute,
  source: docs.toFumadocsSource(),
  plugins: [lucideIconsPlugin()],
});

export function getPageTitle(page: (typeof source)['$inferPage']): string {
  const raw = page.data.title;
  if (typeof raw === 'string' && raw.length > 0) return raw;

  const heading = page.data.toc?.find((item) => item.depth === 1);
  if (typeof heading?.title === 'string' && heading.title.length > 0) return heading.title;

  return page.slugs.at(-1) ?? page.url;
}

function decoratePage(node: Item): Item {
  const page = source.getPage(node.url.replace(docsRoute, '').split('/').filter(Boolean));
  if (!page) return node;
  return { ...node, name: getPageTitle(page) };
}

function decorateNode(node: Node): Node {
  if (node.type === 'page') return decoratePage(node);

  if (node.type === 'folder') {
    return {
      ...node,
      index: node.index ? decoratePage(node.index) : undefined,
      children: node.children.map(decorateNode),
    };
  }

  return node;
}

export function getDecoratedPageTree(): Root {
  const tree = source.getPageTree();
  return {
    ...tree,
    children: tree.children.map(decorateNode),
  };
}

export function getPageImageUrl(_page: (typeof source)['$inferPage']) {
  return {
    segments: ['og.png'],
    url: '/og.png',
  };
}

export function getPageMarkdownUrl(page: (typeof source)['$inferPage']) {
  const segments = [...page.slugs, 'content.md'];

  return {
    segments,
    url: '/' + [page.locale, ...docsContentRoute.split('/'), ...segments].filter(Boolean).join('/'),
  };
}

export async function getLLMText(page: (typeof source)['$inferPage']) {
  const processed = await page.data.getText('processed');

  return `# ${getPageTitle(page)} (${page.url})

${processed}`;
}
