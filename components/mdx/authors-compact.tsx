import type { Author } from '@/lib/authors';

const pillClassName = 'inline-flex items-center rounded-full border border-dashed border-fd-muted-foreground/35 px-2 py-0.5 text-xs text-fd-muted-foreground/75';

export function AuthorsCompact({ authors }: { authors: Author[] }) {
  if (authors.length === 0) return null;
  const [first, ...rest] = authors;

  if (rest.length === 0) {
    return <span className={`${pillClassName} shrink-0`} title={first.role ? `${first.name}：${first.role}` : undefined}>{first.name}</span>;
  }

  return (
    <details className="group relative shrink-0">
      <summary aria-label={`作者：${first.name} 等 ${authors.length} 位，展开完整名单`}
        className={`${pillClassName} cursor-pointer list-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fd-primary [&::-webkit-details-marker]:hidden`}>
        {first.name}<span className="ml-0.5 opacity-60">+{rest.length}</span>
      </summary>
      <div className="absolute left-0 top-full z-20 mt-1 w-max max-w-[min(18rem,calc(100vw-3rem))] rounded-md border bg-fd-popover px-2.5 py-1.5 text-xs shadow-md">
        <ul aria-label="作者名单" className="space-y-1">
          {authors.map((author, index) => (
            <li key={index} className="break-words">
              <span className="text-fd-foreground">{author.name}</span>
              {author.role && <span className="text-fd-muted-foreground"> · {author.role}</span>}
            </li>
          ))}
        </ul>
      </div>
    </details>
  );
}
