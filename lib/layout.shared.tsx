import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import { appName, gitConfig } from './shared';

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: appName,
    },
    githubUrl: `https://github.com/${gitConfig.user}/${gitConfig.repo}`,
    links: [
      { text: '序', url: '/prelude' },
      { text: '历史', url: '/history' },
      { text: '设计', url: '/design' },
      { text: '算法', url: '/tech' },
    ],
  };
}
