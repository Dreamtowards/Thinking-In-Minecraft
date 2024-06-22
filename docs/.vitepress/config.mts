import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Minecraft 設计思想",
  description: "Desc",
  lang: 'en-US',
  base: "/thinking-in-minecraft/",
  head: [
    ['link', { rel: 'icon', href: '/assets/logo-bl.png' }],
  ],
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
        text: 'Minecraft Origin',
        items: [
          { text: '起源与发展', link: '/origin/' },
          { text: '版本更新与变迁', link: '/origin/versions' },
          { text: '从Mojang到微软', link: '/origin/from-mojang-to-microsoft' },
        ]
      },
      {
        text: 'Minecraft Ideology',
        items: [
          { text: '设计哲思', link: '/ideology/' },
          { text: '成功因素分析', link: '/ideology/success-analysis' },
          { text: '开放性和可扩展性', link: '/ideology/' },
        ]
      },
      {
        text: 'Minecraft Algorithms',  // 演算法 & 技术分析
        items: [
          { text: '算法与技术', link: '/impl/' },
          { text: '体素系统', link: '/impl/voxel' },
          { text: '程序化生成', link: '/impl/pcg' },
          { text: '红石系统', link: '/impl/redstone' },
          { text: '多人游戏', link: '/impl/network' },
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/Dreamtowards/Thinking-In-Minecraft' }
    ]
  }
})
