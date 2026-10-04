import Link from 'next/link';
import { tagHref } from '@/lib/tag-utils';

export function TagLink({ tag, count, active = false }: { tag: string; count?: number; active?: boolean }) {
  return (
    <Link href={tagHref(tag)} aria-current={active ? 'page' : undefined}
      className={`inline-flex max-w-full items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs leading-5 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fd-primary ${active
        ? 'border-fd-primary bg-fd-primary text-fd-primary-foreground'
        : 'text-fd-muted-foreground hover:bg-fd-accent hover:text-fd-foreground'}`}>
      <span className="truncate">{tag}</span>
      {count !== undefined && <span className="shrink-0 opacity-70">{count}</span>}
    </Link>
  );
}
