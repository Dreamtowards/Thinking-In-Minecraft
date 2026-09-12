'use client';

import { useEffect } from 'react';
import { GlassCard } from './glass-card';
import { GlassLink } from './glass-link';
import { SunsetBackground } from './sunset-background';
import './home-page.css';

const covers = [
  {
    src: 'https://elytra.dev/thinking-in-minecraft/assets/cover/tim-1.jpg',
    alt: '卷一封面',
    rotate: '-rotate-6',
  },
  {
    src: 'https://elytra.dev/thinking-in-minecraft/assets/cover/tim-2.jpg',
    alt: '卷二封面',
    rotate: 'rotate-0 translate-y-1',
  },
  {
    src: 'https://elytra.dev/thinking-in-minecraft/assets/cover/tim-3.jpg',
    alt: '卷三封面',
    rotate: 'rotate-6',
  },
];

const cards = [
  {
    href: '/history/infiniminer',
    kicker: 'Vol. I',
    title: '历史与商业',
    detail: '规则如何变成媒介',
    tint: 'rgba(251, 146, 60, 0.18)',
  },
  {
    href: '/design/voxel-primitive',
    kicker: 'Vol. II',
    title: '游戏设计',
    detail: '规则为何有效 · 中轴',
    tint: 'rgba(96, 165, 250, 0.18)',
  },
  {
    href: '/impl/data-model',
    kicker: 'Vol. III',
    title: '技术实现',
    detail: '如何被拖进规模',
    tint: 'rgba(52, 211, 153, 0.16)',
  },
  {
    href: '/toc',
    kicker: 'Vol. IV',
    title: '重写',
    detail: '考试，不是开工令',
    tint: 'rgba(192, 132, 252, 0.18)',
  },
];

function CardCopy({
  kicker,
  title,
  detail,
}: {
  kicker: string;
  title: string;
  detail: string;
}) {
  return (
    <>
      <p className="text-xs tracking-[0.22em] text-white/45 uppercase">{kicker}</p>
      <h2 className="mt-2 text-lg font-semibold">{title}</h2>
      <p className="mt-1 text-sm text-white/55">{detail}</p>
    </>
  );
}

export function HomePage() {
  useEffect(() => {
    const root = document.documentElement;
    root.classList.add('home-page');
    return () => root.classList.remove('home-page');
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden font-sans text-white">
      <SunsetBackground />

      <section className="relative flex min-h-[min(86svh,52rem)] flex-col items-center justify-center px-6 pb-16 pt-20 text-center">
        <h1 className="home-text-glow bg-gradient-to-r from-white via-white to-white/55 bg-clip-text text-5xl font-extrabold tracking-tight text-transparent sm:text-6xl md:text-7xl">
          Minecraft 设计思想
        </h1>
        <p className="mt-4 text-xl font-light tracking-wide text-white/80 md:text-2xl">
          历史、设计与算法
        </p>
        <p className="mt-2 text-sm text-white/45 md:text-base">
          Thinking in Minecraft: History, Designs and Algorithms
        </p>

        <div className="mt-10 flex items-end justify-center gap-3 sm:gap-4">
          {covers.map((cover) => (
            <img
              key={cover.src}
              src={cover.src}
              alt={cover.alt}
              width={90}
              height={128}
              className={`h-28 w-auto rounded-sm shadow-lg shadow-black/40 sm:h-32 ${cover.rotate}`}
            />
          ))}
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <GlassLink href="/prelude" solid>
            序
          </GlassLink>
          <GlassLink href="/toc">全书目录</GlassLink>
          <GlassLink href="/prelude/thesis">命题</GlassLink>
        </div>
      </section>

      <section className="relative mx-auto w-full max-w-5xl px-6 pb-10">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {cards.map((card) => (
            <GlassCard key={card.title} href={card.href} tint={card.tint}>
              <CardCopy kicker={card.kicker} title={card.title} detail={card.detail} />
            </GlassCard>
          ))}
        </div>
      </section>

      <footer className="relative mx-auto w-full max-w-5xl px-6 pb-16">
        <p className="border-t border-white/10 pt-6 text-sm leading-relaxed text-white/55">
          Minecraft 不是被消费的关卡，而是一套允许被居住、误用、再开发的规则。这本书写它的历史、设计与实现。
        </p>
        <p className="mt-3 text-xs text-white/35">Aether · 沙盒游戏《以太效应》开发者</p>
      </footer>
    </div>
  );
}
