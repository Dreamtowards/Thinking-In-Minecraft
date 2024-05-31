import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Minecraft 設计思想",
  description: "Desc",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
    ],

    sidebar: [
      {
        text: '前言',
        items: [
          { text: '前言', link: '/intro' },
          { text: '作者简介', link: '/markdown-examples' },
          { text: '写作目的', link: '/api-examples' }
        ]
      },
      {
        text: 'Minecraft 历史',
        items: [
          { text: '起源与早期发展', link: '/markdown-examples' },
          { text: '关键版本和更新', link: '/api-examples' },
          { text: 'Mojang到微软', link: '/api-examples' }
        ]
      },
      {
        text: '成功的因素',
        items: [
          { text: 'Innovation', link: '/markdown-examples' },
          { text: '社区驱动', link: '/api-examples' },
          { text: '开放性和可扩展性', link: '/api-examples' },
        ]
      },
      {
        text: '商业市场分析',
        items: [
          { text: '市场定位', link: '/markdown-examples' },
          { text: '用户群体', link: '/api-examples' },
          { text: '商业模式', link: '/api-examples' },
        ]
      },
      {
        text: '游戏设计分析',
        items: [
          { text: '沙盒概念', link: '/markdown-examples' },
          { text: '玩法多样性', link: '/api-examples' },
          { text: '美学设计', link: '/api-examples' },
        ]
      },
      {
        text: '算法和技术分析',
        items: [
          { text: '体素系统', link: '/markdown-examples' },
          { text: '生成算法', link: '/api-examples' },
          { text: '性能优化', link: '/api-examples' },
          { text: '多人游戏架构', link: '/api-examples' },
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    ]
  }
})
