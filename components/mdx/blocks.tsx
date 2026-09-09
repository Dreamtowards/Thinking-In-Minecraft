import { Callout } from 'fumadocs-ui/components/callout';
import type { ReactNode } from 'react';

export function Note({ children }: { children?: ReactNode }) {
  return <Callout>{children}</Callout>;
}

export function Impl({ title, children }: { title?: string; children?: ReactNode }) {
  return (
    <div className="my-6 rounded-xl border border-fd-border bg-fd-card p-4">
      {title ? (
        <p className="mb-2 text-sm font-semibold text-fd-muted-foreground">{title}</p>
      ) : null}
      <div className="text-fd-muted-foreground [&_:last-child]:mb-0">{children}</div>
    </div>
  );
}

const verdictClass: Record<string, string> = {
  地基: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300',
  凑合: 'bg-fd-muted text-fd-muted-foreground',
  待定: 'bg-amber-500/15 text-amber-700 dark:text-amber-300',
};

export function Constraint({
  name,
  verdict,
  chain,
  children,
}: {
  name?: string;
  verdict?: string;
  chain?: string;
  children?: ReactNode;
}) {
  return (
    <section className="my-6 rounded-xl border border-fd-border p-4">
      <header className="mb-3 flex flex-wrap items-baseline gap-x-3 gap-y-1">
        {name ? <h3 className="text-base font-semibold m-0">{name}</h3> : null}
        {verdict ? (
          <span
            className={`rounded-full px-2 py-0.5 text-xs font-medium ${verdictClass[verdict] ?? 'bg-fd-muted'}`}
          >
            {verdict}
          </span>
        ) : null}
        {chain ? <span className="text-xs text-fd-muted-foreground">{chain}</span> : null}
      </header>
      <div className="[&_:last-child]:mb-0">{children}</div>
    </section>
  );
}

export function Alternative({ title, children }: { title?: string; children?: ReactNode }) {
  return (
    <div className="my-6 rounded-xl border border-dashed border-fd-border p-4">
      {title ? <p className="mb-2 text-sm font-semibold">{title}</p> : null}
      <div className="[&_:last-child]:mb-0">{children}</div>
    </div>
  );
}

export function Memoir({ title, children }: { title?: string; children?: ReactNode }) {
  return (
    <aside className="my-4 rounded-xl border-l-4 border-fd-primary bg-fd-primary/5 px-4 py-3">
      {title ? <p className="mb-2 text-sm font-semibold">{title}</p> : null}
      <div className="text-fd-muted-foreground [&_:last-child]:mb-0">{children}</div>
    </aside>
  );
}

