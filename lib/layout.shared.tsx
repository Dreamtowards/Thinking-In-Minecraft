import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import { appName, gitConfig } from './shared';

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: appName,
      transparentMode: 'none',
    },
    githubUrl: `https://github.com/${gitConfig.user}/${gitConfig.repo}`,
    links: [
      { text: '开始阅读', url: '/prelude', active: 'nested-url' },
      {
        type: 'menu',
        text: '卷册目录',
        items: [
          { text: '序 · 为什么写这本书', description: '从全书命题与作者视角开始', url: '/prelude', active: 'nested-url' },
          { text: '第一卷 · 历史', description: '它如何成为一种创造基础设施', url: '/history', active: 'nested-url' },
          { text: '第二卷 · 设计', description: '拆解 Minecraft 的设计约束', url: '/design', active: 'nested-url' },
          { text: '地基与凑合', description: '辨认必须保留与可以重做的部分', url: '/foundations', active: 'nested-url' },
        ],
      },
    ],
  };
}
