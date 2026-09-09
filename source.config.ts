import { createRequire } from 'node:module';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { defineConfig, type MDXPresetOptions } from 'fumadocs-mdx/config';
import type { Plugin } from 'unified';
import { rehypeStyleToObject } from './lib/rehype-style-object';

async function importFromProject(specifier: string): Promise<Plugin> {
  const require = createRequire(join(process.cwd(), 'package.json'));
  const href = pathToFileURL(require.resolve(specifier)).href;
  const mod = (await import(href)) as { default: Plugin };
  return mod.default;
}

export default defineConfig({
  plugins: [
    {
      name: 'md-autolinks',
      doc: {
        vfile(file) {
          file.value = String(file.value).replace(
            /<(https?:\/\/[^>\s]+)>/g,
            (_, url: string) => `[${url}](${url})`,
          );
          return file;
        },
      },
    },
  ],
  mdxOptions: async (): Promise<MDXPresetOptions> => {
    const [rehypeKatex, remarkMath] = await Promise.all([
      importFromProject('rehype-katex'),
      importFromProject('remark-math'),
    ]);

    return {
      remarkPlugins: [remarkMath],
      rehypePlugins: (v) => [
        rehypeStyleToObject,
        [rehypeKatex, { throwOnError: false, strict: false }],
        ...v,
      ],
    };
  },
});
