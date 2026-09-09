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
      { text: 'Home', link: '/' },
    ],

    sidebar: [
      {
        text: 'Prelude · 序',
        items: [
          { text: '前言', link: '/prelude' },
          { text: '本书的命题', link: '/prelude/thesis' },
        ]
      },
      {
        text: 'Minecraft History',  //  · 历史
        items: [
          { text: '起源与发展', link: '/history/' },
          { text: '版本更新与变迁', link: '/history/versions' },
          { text: '成功的因素分析', link: '/history/success-analysis' },
          { text: 'Notch、Jeb、Mojang 的故事', link: '/history/mojang' },
          { text: '商业与治理：链条为何断裂', link: '/history/business' },
        ]
      },
      {
        text: 'Minecraft Designs',  //  · 设计
        base: "/design/",
        items: [
          { text: '为什么沙盒? 优势与代价', link: 'why-sandbox' },
          { text: '核心玩法循环', link: 'core-gameplay' },
          { text: '视觉风格与简单性追求', link: 'style' },
          { text: '音乐、C418 与 Volume Alpha', link: 'music' },  //  α β
          { text: '怀旧之情', link: 'nostalgia' },
        ]
      },
      {
        text: 'Minecraft Algorithms',  // 演算法 & 技术分析
        base: "/impl/",
        items: [
          { text: '引擎、架构与工具链', link: 'engine' },
          { text: '程序化世界生成', link: 'pcg' },
          { 
            text: '体素系统', 
            base: 'voxel/',
            link: ' ', 
            items: [
              { text: '区块系统', link: 'chunks' },
              { text: '存储、压缩与格式', link: 'storage' },
              { text: '光线传播', link: 'light' },
              { text: '流体模拟', link: 'liquid' },
              { text: '火焰传播', link: 'fire' },
              { text: '物理与碰撞检测', link: 'phys' },
              { text: '爆炸与连通性检测', link: 'explosion' },
            ]
          },
          { text: '性能优化', link: '/perf' },
          { 
            text: '渲染', 
            link: '/rendering',
            base: 'rendering/',
            items: [
              { text: '体素全局光照', link: 'gi' },
            ]
          },
          { text: '红石系统', link: '/redstone' },
          { text: '多人网络', link: '/network' },
          { text: '生物与AI', link: '/mobs' },
          { text: '实体与物品系统', link: '/items' },
        ]
      },
      {
        text: 'Appendix · 附录',
        link: '/appendix'
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/Dreamtowards/Thinking-In-Minecraft' }
    ]
  }
})
