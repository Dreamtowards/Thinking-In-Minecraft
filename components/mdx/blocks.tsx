import {
  CalloutContainer,
  CalloutDescription,
  CalloutTitle,
} from 'fumadocs-ui/components/callout';
import { Accordion, Accordions } from 'fumadocs-ui/components/accordion';
import { BookOpenText, Boxes, GitCompareArrows, Info, Link2, Scale } from 'lucide-react';
import type { ReactNode } from 'react';

const iconClass = 'mt-0.5 size-4.5 shrink-0 text-(--callout-color)';

export function Note({ children }: { children?: ReactNode }) {
  return (
    <CalloutContainer type="info" icon={<Info className={iconClass} />}>
      <CalloutDescription>{children}</CalloutDescription>
    </CalloutContainer>
  );
}

export function Impl({ title, children }: { title?: string; children?: ReactNode }) {
  return (
    <Accordions className="my-6 shadow-sm">
      <Accordion
        title={
          <span className="flex items-center gap-2">
            <Boxes className="size-4 text-fd-muted-foreground" />
            <span>{title ?? '实现细节'}</span>
          </span>
        }
      >
        {children}
      </Accordion>
    </Accordions>
  );
}

const verdictStyle: Record<string, string> = {
  地基: 'border-fd-success/25 bg-fd-success/10 text-fd-success',
  凑合: 'border-fd-border bg-fd-muted text-fd-muted-foreground',
  待定: 'border-fd-warning/25 bg-fd-warning/10 text-fd-warning',
};

export function Constraint({ name, verdict, chain, children }: {
  name: string;
  verdict: string;
  chain: string;
  children?: ReactNode;
}) {
  return (
    <section className="not-prose my-6 overflow-hidden rounded-xl border border-fd-border bg-fd-card text-fd-card-foreground shadow-sm">
      <header className="flex flex-col gap-3 border-b border-fd-border bg-fd-muted/35 px-4 py-3.5 sm:flex-row sm:items-center">
        <div className="flex min-w-0 flex-1 items-center gap-2.5">
          <Scale className="size-4.5 shrink-0 text-fd-muted-foreground" />
          <h3 className="truncate text-sm font-semibold">{name}</h3>
        </div>
        <div className="flex flex-wrap items-center gap-2 pl-7 sm:pl-0">
          <span className={`rounded-md border px-2 py-0.5 text-xs font-medium ${verdictStyle[verdict] ?? verdictStyle.凑合}`}>
            {verdict}
          </span>
          <span className="inline-flex items-center gap-1.5 text-xs text-fd-muted-foreground">
            <Link2 className="size-3.5" />
            {chain}
          </span>
        </div>
      </header>
      <div className="prose px-4 py-4 text-[0.9375rem] prose-no-margin">{children}</div>
    </section>
  );
}

export function Alternative({ title, children }: { title?: string; children?: ReactNode }) {
  return (
    <CalloutContainer type="idea" icon={<GitCompareArrows className={iconClass} />} className="my-6">
      <CalloutTitle>{title ?? '另一种做法'}</CalloutTitle>
      <CalloutDescription>{children}</CalloutDescription>
    </CalloutContainer>
  );
}

export function Figure({
  src,
  alt,
  caption,
}: {
  src: string;
  alt: string;
  caption?: string;
}) {
  return (
    <figure className="not-prose my-6">
      <img
        src={src}
        alt={alt}
        className="w-full rounded-xl border border-fd-border bg-fd-card"
      />
      {caption ? (
        <figcaption className="mt-2 text-center text-sm text-fd-muted-foreground">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}

export function Memoir({ title, children }: { title?: string; children?: ReactNode }) {
  return (
    <CalloutContainer icon={<BookOpenText className={iconClass} />} className="my-6 [--callout-color:var(--color-fd-primary)]">
      <CalloutTitle>{title ?? '亲历记'}</CalloutTitle>
      <CalloutDescription className="italic [&_strong]:not-italic">{children}</CalloutDescription>
    </CalloutContainer>
  );
}
