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
  history: '卷一 · 历史',
  design: '卷二 · 设计',
  tech: '卷三 · 算法',
  aether: '卷四 · 以太效应',
};

export const folderOrder = ['prelude', 'history', 'design', 'tech', 'aether'] as const;
