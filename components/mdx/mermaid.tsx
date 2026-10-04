import { CodeBlock, Pre } from 'fumadocs-ui/components/codeblock';
import { renderMermaidSVG } from 'beautiful-mermaid';
import { MermaidViewer } from './mermaid-viewer';

function normalizeChart(chart: string) {
  // The renderer handles escaped newlines inside labels after parsing the graph.
  return chart.trim();
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

    const dimensions = svg.match(/<svg\b[^>]*\bwidth="([\d.]+)"[^>]*\bheight="([\d.]+)"/);
    if (!dimensions || Number(dimensions[1]) <= 0 || Number(dimensions[2]) <= 0) {
      throw new Error('Mermaid SVG has no dimensions');
    }

    return <MermaidViewer svg={svg} width={Number(dimensions[1])} />;
  } catch {
    return (
      <CodeBlock title="Mermaid">
        <Pre>{chart}</Pre>
      </CodeBlock>
    );
  }
}
