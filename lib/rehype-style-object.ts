type HastNode = {
  type?: string;
  properties?: Record<string, unknown>;
  children?: HastNode[];
};

function parseStyle(style: string): Record<string, string> {
  const out: Record<string, string> = {};

  for (const decl of style.split(';')) {
    const idx = decl.indexOf(':');
    if (idx === -1) continue;
    const prop = decl.slice(0, idx).trim();
    const value = decl.slice(idx + 1).trim();
    if (!prop || !value) continue;
    const key = prop.replace(/-([a-z])/g, (_, c: string) => c.toUpperCase());
    out[key] = value;
  }

  return out;
}

function walk(node: HastNode) {
  if (node.type === 'element' && typeof node.properties?.style === 'string') {
    node.properties.style = parseStyle(node.properties.style);
  }

  node.children?.forEach(walk);
}

/** Convert HTML `style="a: b"` strings into React-friendly style objects. */
export function rehypeStyleToObject() {
  return (tree: HastNode) => {
    walk(tree);
  };
}
