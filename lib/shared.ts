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
  prelude: '序',
  history: '第一卷 · 历史',
  design: '第二卷 · 设计',
  foundations: '地基与凑合',
  tech: '第三卷 · 算法',
};

export const folderOrder = ['prelude', 'history', 'design', 'foundations', 'tech'] as const;
