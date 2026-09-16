'use client';

import { useEffect, useState } from 'react';
import { BackgroundPicker } from './background-picker';
import { GlassCard } from './glass-card';
import { GlassLink } from './glass-link';
import { BG_EFFECTS, HomeBackground, type BgEffectId } from './home-background';
import './home-page.css';

const covers = [
  {
    src: 'https://elytra.dev/thinking-in-minecraft/assets/cover/tim-1.jpg',
    alt: '卷一封面',
    tilt: '-6',
  },
  {
    src: 'https://elytra.dev/thinking-in-minecraft/assets/cover/tim-2.jpg',
    alt: '卷二封面',
    tilt: '0',
  },
  {
    src: 'https://elytra.dev/thinking-in-minecraft/assets/cover/tim-3.jpg',
    alt: '卷三封面',
    tilt: '6',
  },
];

const cards = [
  {
    href: '/history/infiniminer',
    kicker: '卷一',
    title: '历史与商业',
    detail: '从一个人的原型，长成模组与服务器，最终席卷全球的文化现象',
    tint: 'rgba(251, 146, 60, 0.18)',
  },
  {
    href: '/design/voxel-primitive',
    kicker: '卷二',
    title: '游戏设计',
    detail: '全书中轴。深度来自极少数规则在体素世界上的组合。',
    tint: 'rgba(96, 165, 250, 0.18)',
  },
  {
    href: '/impl/data-model',
    kicker: '卷三',
    title: '技术实现',
    detail: '刨析引擎与算法、体素系统、PCG、Mod系统、渲染、多人网络与优化',
    tint: 'rgba(52, 211, 153, 0.16)',
  },
  {
    href: '/toc',
    kicker: '卷四',
    title: '重写',
    detail: '以更现代的方式实现，把偶然从本质里剥开',
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
      <p className="text-xs tracking-widest text-white/45">{kicker}</p>
      <h2 className="mt-2 text-lg font-semibold">{title}</h2>
      <p className="mt-1 text-sm text-white/55">{detail}</p>
    </>
  );
}

const FX_QUERY = 'fx';
const FX_STORAGE = 'tim-home-bg';

function isEffectId(value: string | null | undefined): value is BgEffectId {
  return BG_EFFECTS.some((item) => item.id === value);
}

function parseFxParam(raw: string | null): BgEffectId | 'rnd' | null {
  if (!raw) return null;
  const key = raw.trim().toLowerCase();
  if (key === 'rnd') return 'rnd';
  return isEffectId(key) ? key : null;
}

function randomEffect(): BgEffectId {
  return BG_EFFECTS[Math.floor(Math.random() * BG_EFFECTS.length)].id;
}

function writeFxQuery(id: string) {
  const url = new URL(window.location.href);
  if (url.searchParams.get(FX_QUERY) === id) return;
  url.searchParams.set(FX_QUERY, id);
  window.history.replaceState(window.history.state, '', url);
}

export function HomePage() {
  const [effect, setEffect] = useState<BgEffectId>('sunset');
  const activeEffect = isEffectId(effect) ? effect : 'sunset';

  useEffect(() => {
    const root = document.documentElement;
    root.classList.add('home-page');
    const parsed = parseFxParam(new URLSearchParams(window.location.search).get(FX_QUERY));
    if (parsed === 'rnd') {
      const id = randomEffect();
      setEffect(id);
      window.localStorage.setItem(FX_STORAGE, id);
    } else if (parsed) {
      setEffect(parsed);
      window.localStorage.setItem(FX_STORAGE, parsed);
    } else {
      const saved = window.localStorage.getItem(FX_STORAGE);
      if (isEffectId(saved)) setEffect(saved);
    }
    return () => root.classList.remove('home-page');
  }, []);

  const onEffectChange = (id: BgEffectId) => {
    setEffect(id);
    window.localStorage.setItem(FX_STORAGE, id);
    writeFxQuery(id);
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden font-sans text-white">
      <HomeBackground key={activeEffect} effect={activeEffect} />

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

        <div className="home-covers mt-10 flex items-end justify-center gap-3 sm:gap-4">
          {covers.map((cover) => (
            <button
              key={cover.src}
              type="button"
              className="home-cover"
              data-tilt={cover.tilt}
              aria-label={`放大${cover.alt}`}
            >
              <img
                src={cover.src}
                alt={cover.alt}
                width={90}
                height={128}
                className="h-28 w-auto rounded-sm shadow-lg shadow-black/40 sm:h-32"
              />
            </button>
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
          Minecraft 不是通关即弃的内容，而是一套能住进去、能玩出设计之外、还能被再开发的系统。这本书写它的历史、设计与实现。
        </p>
        <p className="mt-3 text-xs text-white/35">Aether · 沙盒游戏《以太效应》开发者</p>
      </footer>

      <BackgroundPicker value={activeEffect} onChange={onEffectChange} />
    </div>
  );
}
