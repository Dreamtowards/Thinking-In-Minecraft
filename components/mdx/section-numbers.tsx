import { Heading } from 'fumadocs-ui/components/heading';
import type { TOCItemType } from 'fumadocs-core/toc';
import { isValidElement, type ComponentProps, type ReactNode } from 'react';

type HeadingLevel = 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

function firstText(node: ReactNode): string {
  if (typeof node === 'string' || typeof node === 'number') return String(node);
  if (Array.isArray(node)) return node.map(firstText).join('');
  if (isValidElement<{ children?: ReactNode }>(node)) return firstText(node.props.children);
  return '';
}

const writtenNumber = /^\s*(?:\d+(?:\.\d+)*\.\s+|\d+(?:\.\d+)*\s+|[一二三四五六七八九十]+、)/;

function getHeadingId(url: string) {
  const fragment = url.split('#')[1];
  if (!fragment) return undefined;
  try {
    return decodeURIComponent(fragment);
  } catch {
    return fragment;
  }
}

export function numberArticleSections(toc: TOCItemType[]) {
  const counts = [0, 0, 0, 0, 0, 0, 0];
  const numbers = new Map<string, string>();

  const numberedToc = toc.map((item) => {
    if (item.depth < 2 || item.depth > 6) return item;
    const id = getHeadingId(item.url);
    if (id === 'footnote-label') return item;

    counts[item.depth] += 1;
    counts.fill(0, item.depth + 1);
    const number = counts.slice(2, item.depth + 1).filter(Boolean).join('.');
    if (writtenNumber.test(firstText(item.title))) return item;
    if (id) numbers.set(id, number);

    return {
      ...item,
      title: <><span className="book-section-number">{number}</span>{item.title}</>,
    };
  });

  function heading(level: HeadingLevel) {
    return function ArticleHeading(props: ComponentProps<typeof level>) {
      const number = props.id && numbers.get(props.id);
      return (
        <Heading as={level} {...props}>
          {number ? <span className="book-section-number">{number}</span> : null}
          {props.children}
        </Heading>
      );
    };
  }

  return {
    toc: numberedToc,
    headings: {
      h2: heading('h2'),
      h3: heading('h3'),
      h4: heading('h4'),
      h5: heading('h5'),
      h6: heading('h6'),
    },
  };
}
