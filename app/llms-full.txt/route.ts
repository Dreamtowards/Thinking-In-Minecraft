import { getLLMText, source } from '@/lib/source';

export const revalidate = false;

export function GET() {
  const scan = source.getPages().map(getLLMText);
  return Promise.all(scan).then((scanned) => new Response(scanned.join('\n\n')));
}
