import Link from 'next/link';
import { appDescription, appName } from '@/lib/shared';

const volumes = [
  {
    href: '/history',
    kicker: 'Vol.I · Minecraft History',
    title: 'Minecraft 歷史、起源與發展',
    details:
      '从2009年前的伏笔到2014年的辉煌，背后的历史、事件与人物，Minecraft 是如何造就流量黑洞，成为史上最具影响力的游戏',
  },
  {
    href: '/design',
    kicker: 'Vol.II · Minecraft Designs',
    title: 'Minecraft 設計哲思',
    details:
      '通过简单却深邃的游戏机制，Minecraft 赋予了玩家极大的自由。除了创造与生存，最感人的方面是它让玩家以独特且充满意义的方式表达自己。',
  },
  {
    href: '/tech',
    kicker: 'Vol.III · Minecraft Algorithms',
    title: 'Minecraft 演算法與技術分析',
    details:
      '刨析Minecraft的引擎架构与工具链、体素系统与相关算法、程序化世界生成、红石系统、多人网络、主流Mod系统。优缺点及其他方案。',
  },
];

const covers = [
  'https://elytra.dev/thinking-in-minecraft/assets/cover/tim-1.jpg',
  'https://elytra.dev/thinking-in-minecraft/assets/cover/tim-1-1.jpg',
  'https://elytra.dev/thinking-in-minecraft/assets/cover/tim-2.jpg',
  'https://elytra.dev/thinking-in-minecraft/assets/cover/tim-3.jpg',
  'https://elytra.dev/thinking-in-minecraft/assets/cover/tim-3-1.jpg',
  'https://elytra.dev/thinking-in-minecraft/assets/cover/tim-3-2.jpg',
];

export default function HomePage() {
  return (
    <div className="flex flex-col flex-1 px-4 py-16 md:py-24">
      <section className="mx-auto w-full max-w-5xl text-center">
        <p className="text-sm text-fd-muted-foreground mb-3">Thinking in Minecraft</p>
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4">{appName}</h1>
        <p className="text-lg text-fd-muted-foreground mb-8">{appDescription}</p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/prelude"
            className="inline-flex items-center justify-center rounded-lg bg-fd-primary px-6 py-3 text-sm font-medium text-fd-primary-foreground hover:opacity-90 transition-opacity"
          >
            序
          </Link>
          <span className="inline-flex items-center justify-center rounded-lg border px-6 py-3 text-sm text-fd-muted-foreground">
            PDF档
          </span>
          <span className="inline-flex items-center justify-center rounded-lg border px-6 py-3 text-sm text-fd-muted-foreground">
            購買實體版
          </span>
        </div>
      </section>

      <section className="mx-auto mt-16 grid w-full max-w-5xl gap-4 md:grid-cols-3">
        {volumes.map((volume) => (
          <Link
            key={volume.href}
            href={volume.href}
            className="rounded-2xl border bg-fd-card p-5 text-left transition-colors hover:bg-fd-accent"
          >
            <h2 className="text-lg font-semibold mb-2">{volume.title}</h2>
            <p className="text-sm text-fd-muted-foreground mb-4">{volume.details}</p>
            <p className="text-sm font-medium">{volume.kicker}</p>
          </Link>
        ))}
      </section>

      <section className="mx-auto mt-16 w-full max-w-5xl text-fd-muted-foreground leading-7">
        <p>
          Minecraft 无疑是史上最具影响力的游戏之一，它引发了大规模的独立游戏运动，也是有史以来最畅销的游戏。游戏通过视频平台和其他社交媒体在互联网上像野火一样传播，任何游戏都不太可能再次达到这样成功的水平。从2011年中期到2014年，这个游戏连续近3年无与伦比的发展，有段时间你会进入视频平台并且看到很多Minecraft频道实况主，你甚至无法避免他们。Minecraft是很多实况主们的第一个主要浪潮，可以大胆的说
          在YouTube的历史上，大多数创作者实际上只制作Minecraft的内容。
          但如今 Minecraft的光辉岁月已经过去了，Minecraft社区已经有了他们的问题
        </p>
        <p className="mt-6">
          本书作者为Minecraft资深玩家、沙盒游戏《以太效应 · AetherEffect》开发者
          Aether，意志再次创造Minecraft的辉煌，特此分析MC的历史、设计与技术实现。
        </p>
      </section>

      <section className="mx-auto mt-12 flex w-full max-w-5xl flex-wrap gap-2">
        {covers.map((src) => (
          <img
            key={src}
            src={src}
            alt=""
            className="h-auto w-[calc(100%/6.4)] min-w-16 rounded-sm"
          />
        ))}
      </section>
    </div>
  );
}
