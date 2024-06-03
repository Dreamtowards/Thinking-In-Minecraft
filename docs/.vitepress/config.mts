import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Minecraft 設计思想",
  description: "Desc",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    // logo: {
    //   light: '/assets/tess-b2.png',
    //   dark: '/assets/tess-b2.png'
    // },
    nav: [
      { text: 'Home', link: '/' },
    ],

    sidebar: [
      {
        text: 'Prelude · 序',
        items: [
          { text: '前言', link: '/prelude' },
        ]
      },
      {
        text: 'Minecraft History',
        items: [
          { text: '起源与发展', link: '/history' },
          { text: '版本更新与变迁', link: '/history/versions' },
          { text: '从Mojang到微软', link: '/history/from-mojang-to-microsoft' },
        ]
      },
      {
        text: 'Minecraft Philosophy',
        items: [
          { text: '成功因素分析', link: '/history/success-analysis' },
          { text: '开放性和可扩展性', link: '/api-examples' },
        ]
      },
      {
        text: 'Minecraft Algorithms',  // 演算法 & 技术分析
        items: [
          { text: '体素系统', link: '/tech/voxel' },
          { text: '程序化生成', link: '/tech/pcg' },
          { text: '红石系统', link: '/tech/redstone' },
          { text: '多人游戏', link: '/tech/network' },
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    ]
  }
})
