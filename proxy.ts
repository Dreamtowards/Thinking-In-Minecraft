import { NextRequest, NextResponse } from 'next/server';
import { isMarkdownPreferred, rewritePath } from 'fumadocs-core/negotiation';
import { docsContentRoute, folderOrder } from '@/lib/shared';

const { rewrite: rewriteDocs } = rewritePath(`{/*path}`, `${docsContentRoute}{/*path}/content.md`);
const { rewrite: rewriteSuffix } = rewritePath(`{/*path}.md`, `${docsContentRoute}{/*path}/content.md`);

function isDocPath(pathname: string) {
  return folderOrder.some((folder) => pathname === `/${folder}` || pathname.startsWith(`/${folder}/`));
}

export default function proxy(request: NextRequest) {
  if (!isDocPath(request.nextUrl.pathname)) {
    return NextResponse.next();
  }

  const result = rewriteSuffix(request.nextUrl.pathname);
  if (result) {
    return NextResponse.rewrite(new URL(result, request.nextUrl));
  }

  if (isMarkdownPreferred(request)) {
    const rewritten = rewriteDocs(request.nextUrl.pathname);

    if (rewritten) {
      return NextResponse.rewrite(new URL(rewritten, request.nextUrl), {
        headers: { Vary: 'Accept' },
      });
    }
  }

  return NextResponse.next();
}
