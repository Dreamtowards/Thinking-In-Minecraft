import { getPageImageUrl, getPageMarkdownUrl, getPageTitle, source } from '@/lib/source';
import {
  DocsBody,
  DocsDescription,
  DocsPage,
  DocsTitle,
  ViewOptionsPopover,
} from 'fumadocs-ui/layouts/docs/page';
import { notFound } from 'next/navigation';
import { getMDXComponents } from '@/components/mdx';
import type { Metadata } from 'next';
import { createRelativeLink } from 'fumadocs-ui/mdx';
import { gitConfig } from '@/lib/shared';
import { TagLink } from '@/components/tags/tag-link';
import { normalizeTags } from '@/lib/tag-utils';
import { isCurrentBookPage } from '@/lib/tags';
import { SectionNumberToggle } from '@/components/mdx/section-number-toggle';
import { numberArticleSections } from '@/components/mdx/section-numbers';
import { AuthorsCompact } from '@/components/mdx/authors-compact';
import { normalizeAuthors } from '@/lib/authors';

export const revalidate = false;

export default async function Page({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params;
  const page = source.getPage(slug);
  if (!page) notFound();

  const MDX = page.data.body;
  const markdownUrl = getPageMarkdownUrl(page).url;
  const title = getPageTitle(page);
  const tags = isCurrentBookPage(page.slugs) ? normalizeTags(page.data.tags) : [];
  const sections = numberArticleSections(page.data.toc);

  return (
    <DocsPage toc={sections.toc} full={page.data.full}>
      <DocsTitle>{title}</DocsTitle>
      {typeof page.data.description === 'string' ? (
        <DocsDescription className="mb-0">{page.data.description}</DocsDescription>
      ) : null}
      <div className="flex min-w-0 items-center gap-2 border-b pb-4">
        <AuthorsCompact authors={normalizeAuthors(page.data.authors)} />
        {tags.length > 0 && (
          <nav aria-label="章节标签" className="flex min-w-0 flex-1 flex-nowrap gap-1.5 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden [&>a]:shrink-0">
            {tags.map((tag) => <TagLink key={tag} tag={tag} />)}
          </nav>
        )}
        <div className="flex shrink-0 items-center gap-2">
          <SectionNumberToggle />
          <ViewOptionsPopover
            markdownUrl={markdownUrl}
            githubUrl={`https://github.com/${gitConfig.user}/${gitConfig.repo}/blob/${gitConfig.branch}/docs/${page.path}`}
          />
        </div>
      </div>
      <DocsBody>
        <MDX
          components={getMDXComponents({
            ...sections.headings,
            a: createRelativeLink(source, page),
          })}
        />
      </DocsBody>
    </DocsPage>
  );
}

export async function generateStaticParams() {
  return source.generateParams().filter((params) => params.slug && params.slug.length > 0);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = source.getPage(slug);
  if (!page) notFound();

  return {
    title: getPageTitle(page),
    description: typeof page.data.description === 'string' ? page.data.description : undefined,
    openGraph: {
      images: getPageImageUrl(page).url,
    },
  };
}
