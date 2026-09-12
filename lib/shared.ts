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
  history: '卷一 · 历史与商业',
  design: '卷二 · 游戏设计',
  impl: '卷三 · 技术实现',
  rewrite: '卷四 · 重写',
  extras: '番外',
  appendix: '附录',
};

export const folderOrder = ['prelude', 'history', 'design', 'impl', 'rewrite', 'extras', 'appendix'] as const;
