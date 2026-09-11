import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Minecraft 設计思想",
  description: "Desc",
  lang: 'en-US',
  // base: "/thinking-in-minecraft/",
  cleanUrls: true,
  // 各卷章节骨架尚未生成，正文里指向后续章节的前向引用暂时是死链。
  // TODO: 章节文件补齐后移除此项，恢复死链检查。
  ignoreDeadLinks: true,
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
      { text: '序', link: '/prelude' },
      { text: '历史', link: '/history/business' },
      { text: '设计', link: '/design/constraint' },
    ],

    sidebar: [
      {
        text: '序',
        items: [
          { text: '前言', link: '/prelude' },
          { text: '本书的命题', link: '/prelude/thesis' },
        ]
      },
      {
        text: '卷一 · 历史',
        items: [
          { text: '商业与治理：链条为何断裂', link: '/history/business' },
        ]
      },
      {
        text: '卷二 · 设计',
        items: [
          { text: '约束生成自由', link: '/design/constraint' },
          { text: '地基与凑合', link: '/design/foundations' },
        ]
      },
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/Dreamtowards/Thinking-In-Minecraft' }
    ]
  }
})
