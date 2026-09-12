import defaultMdxComponents from 'fumadocs-ui/mdx';
import type { MDXComponents } from 'mdx/types';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { Accordion, Accordions } from 'fumadocs-ui/components/accordion';
import { File, Files, Folder } from 'fumadocs-ui/components/files';
import { Alternative, Constraint, Figure, Impl, Memoir, Note } from '@/components/mdx/blocks';
import { BookToc } from '@/components/book-toc';
import { Mermaid } from '@/components/mdx/mermaid';

function nodeText(node: ReactNode): string {
  if (node == null || typeof node === 'boolean') return '';
  if (typeof node === 'string' || typeof node === 'number') return String(node);
  if (Array.isArray(node)) return node.map(nodeText).join('');
  if (typeof node === 'object' && 'props' in node) {
    return nodeText((node as { props?: { children?: ReactNode } }).props?.children);
  }
  return '';
}

function codeLanguage(node: ReactNode): string | undefined {
  if (node == null || typeof node !== 'object') return undefined;
  if (Array.isArray(node)) {
    for (const child of node) {
      const lang = codeLanguage(child);
      if (lang) return lang;
    }
    return undefined;
  }
  const props = (node as { props?: { className?: string; children?: ReactNode } }).props;
  const className = props?.className;
  const match = typeof className === 'string' ? className.match(/language-([^\s]+)/) : null;
  if (match) return match[1];
  return codeLanguage(props?.children);
}

function isMermaidBlock(props: ComponentPropsWithoutRef<'pre'>) {
  const data = props as ComponentPropsWithoutRef<'pre'> & Record<string, unknown>;
  const lang = data['data-language'] ?? data['data-lang'] ?? data.lang;
  if (lang === 'mermaid') return true;
  if (typeof props.className === 'string' && /\blanguage-mermaid\b/.test(props.className)) {
    return true;
  }
  return codeLanguage(props.children) === 'mermaid';
}

function Pre(props: ComponentPropsWithoutRef<'pre'>) {
  if (isMermaidBlock(props)) {
    return <Mermaid chart={nodeText(props.children)} />;
  }

  const DefaultPre = defaultMdxComponents.pre;
  if (!DefaultPre) return <pre {...props} />;
  return <DefaultPre {...props} />;
}

function FallbackBlock({
  title,
  children,
}: {
  title?: string;
  children?: ReactNode;
  [key: string]: unknown;
}) {
  return (
    <div className="my-4 rounded-xl border border-fd-border p-4">
      {title ? <p className="mb-2 text-sm font-semibold">{title}</p> : null}
      <div className="[&_:last-child]:mb-0">{children}</div>
    </div>
  );
}

export function getMDXComponents(components?: MDXComponents) {
  const mapped: MDXComponents = {
    ...defaultMdxComponents,
    pre: Pre,
    Mermaid,
    Note,
    Impl,
    Constraint,
    Memoir,
    Alternative,
    Figure,
    Accordion,
    Accordions,
    File,
    Files,
    Folder,
    BookToc,
    ...components,
  };

  return new Proxy(mapped, {
    get(target, prop, receiver) {
      if (typeof prop === 'string' && !(prop in target) && /^[A-Z]/.test(prop)) {
        return FallbackBlock;
      }
      return Reflect.get(target, prop, receiver);
    },
    has(target, prop) {
      if (typeof prop === 'string' && /^[A-Z]/.test(prop)) return true;
      return Reflect.has(target, prop);
    },
  });
}

export const useMDXComponents = getMDXComponents;

declare global {
  type MDXProvidedComponents = ReturnType<typeof getMDXComponents>;
}
