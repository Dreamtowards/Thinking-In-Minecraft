const colors: Record<string, string> = {
  prelude: '#91c6df',
  history: '#f2b77b',
  design: '#8abaf5',
  impl: '#69c9be',
  rewrite: '#c9a7f2',
  extras: '#f09caa',
  appendix: '#d6cd7e',
  toc: '#b8b8b8',
};

export function topicColor(id: string) {
  return colors[id] ?? '#b8b8b8';
}

export const mapVolumes = [
  { id: 'history', label: '历史与商业' },
  { id: 'design', label: '游戏设计' },
  { id: 'impl', label: '技术实现' },
  { id: 'rewrite', label: '重新发明' },
];
