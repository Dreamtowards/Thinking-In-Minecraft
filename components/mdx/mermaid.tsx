import { CodeBlock, Pre } from 'fumadocs-ui/components/codeblock';
import { renderMermaidSVG } from 'beautiful-mermaid';

function normalizeChart(chart: string) {
  return chart.replaceAll('\\n', '\n').trim();
}

function inheritPageFont(svg: string) {
  return svg
    .replace(/@import url\('https:\/\/fonts\.googleapis\.com[^']+'\);\s*/g, '')
    .replace(
      /text \{ font-family: '[^']+', system-ui, sans-serif; \}/,
      'text { font-family: inherit; }',
    );
}

export function Mermaid({ chart }: { chart: string }) {
  try {
    const svg = inheritPageFont(
      renderMermaidSVG(normalizeChart(chart), {
        bg: 'var(--color-fd-card)',
        fg: 'var(--color-fd-foreground)',
        accent: 'var(--color-fd-primary)',
        muted: 'var(--color-fd-muted-foreground)',
        surface: 'var(--color-fd-secondary)',
        border: 'var(--color-fd-border)',
        interactive: true,
        transparent: true,
      }),
    );

    return (
      <div
        className="mermaid-diagram my-6 overflow-x-auto rounded-xl border border-fd-border bg-fd-card p-4 [&_svg]:mx-auto [&_svg]:h-auto [&_svg]:max-w-full"
        dangerouslySetInnerHTML={{ __html: svg }}
      />
    );
  } catch {
    return (
      <CodeBlock title="Mermaid">
        <Pre>{chart}</Pre>
      </CodeBlock>
    );
  }
}
