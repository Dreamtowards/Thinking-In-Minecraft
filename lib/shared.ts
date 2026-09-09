export const appName = 'Minecraft 設計思想';
export const appDescription =
  '歷史、設計與演算法 · Thinking in Minecraft: History, Designs and Algorithms';
export const docsRoute = '/';
export const docsImageRoute = '/og/docs';
export const docsContentRoute = '/llms.mdx/docs';

export const gitConfig = {
  user: 'Dreamtowards',
  repo: 'Thinking-In-Minecraft',
  branch: 'main',
};

export const folderTitles: Record<string, string> = {
  prelude: 'Prelude · 序',
  history: 'Minecraft History',
  design: 'Minecraft Designs',
  foundations: '地基与凑合',
  tech: 'Minecraft Algorithms',
};

export const folderOrder = ['prelude', 'history', 'design', 'foundations', 'tech'] as const;
