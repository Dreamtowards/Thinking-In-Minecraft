'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { BackgroundPicker } from './background-picker';
import { GlassCard } from './glass-card';
import { GlassLink } from './glass-link';
import { BG_EFFECTS, HomeBackground, type BgEffectId } from './home-background';
import './home-page.css';

const covers = [
  {
    src: 'https://old.elytra.dev/thinking-in-minecraft/assets/cover/tim-1.jpg',
    alt: '《Minecraft 设计思想》卷一封面',
    href: '/history',
    label: '阅读卷一：历史与商业',
    tilt: '-6',
  },
  {
    src: 'https://old.elytra.dev/thinking-in-minecraft/assets/cover/tim-2.jpg',
    alt: '《Minecraft 设计思想》卷二封面',
    href: '/design',
    label: '阅读卷二：游戏设计',
    tilt: '0',
  },
  {
    src: 'https://old.elytra.dev/thinking-in-minecraft/assets/cover/tim-3.jpg',
    alt: '《Minecraft 设计思想》卷三封面',
    href: '/impl',
    label: '阅读卷三：技术实现',
    tilt: '6',
  },
];

const cards = [
  {
    href: '/history',
    kicker: '卷一',
    title: '历史与商业',
    detail: '一个独立游戏如何在开发者、玩家、社区与平台的共同作用下，逐渐长成一种文化与产业。',
    tint: 'rgba(251, 146, 60, 0.18)',
  },
  {
    href: '/design',
    kicker: '卷二',
    title: '游戏设计',
    detail: '为什么少数简单规则，能在方块世界里组合出如此丰富的目标、玩法与玩家创造。',
    tint: 'rgba(96, 165, 250, 0.18)',
  },
  {
    href: '/impl',
    kicker: '卷三',
    title: '技术实现',
    detail: '体素世界如何被表示、生成、模拟与渲染，又如何支持多人游戏与 Mod 扩展。',
    tint: 'rgba(52, 211, 153, 0.16)',
  },
  {
    href: '/rewrite',
    kicker: '卷四',
    title: '重新发明',
    detail: '当体素、物理、UGC、VR 与 AI 改变了沙盒的条件，Minecraft 留下的哪些思想仍然值得继承？',
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
      <p className="mt-1 text-sm leading-relaxed text-white/55">{detail}</p>
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
        <p className="text-sm tracking-[0.05em] text-white/45 sm:text-base">
          Thinking in Minecraft
          <span className="text-white/30">: History, Design, Technology and Reinvention</span>
        </p>
        <h1 className="home-text-glow mt-3 bg-gradient-to-r from-white via-white to-white/55 bg-clip-text text-5xl font-extrabold tracking-tight text-transparent sm:text-6xl md:text-7xl">
          Minecraft 设计思想
        </h1>
        <p className="mt-5 max-w-2xl text-lg font-light leading-relaxed text-white/78 md:text-xl">
          从历史、游戏设计与技术实现理解 Minecraft，<br/>
          并由此追问下一代沙盒世界可以如何被重新创造。
        </p>

        <div className="home-covers mt-10 flex items-end justify-center gap-3 sm:gap-4">
          {covers.map((cover) => (
            <Link
              key={cover.src}
              href={cover.href}
              className="home-cover"
              data-tilt={cover.tilt}
              aria-label={cover.label}
            >
              <img
                src={cover.src}
                alt={cover.alt}
                width={90}
                height={128}
                className="h-28 w-auto rounded-sm shadow-lg shadow-black/40 sm:h-32"
              />
            </Link>
          ))}
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <GlassLink href="/prelude" solid>
            开始阅读
          </GlassLink>
          <GlassLink href="/toc">全书目录</GlassLink>
          <GlassLink href="/tags">按标签探索</GlassLink>
          <GlassLink href="/prelude/thesis">这本书想回答什么</GlassLink>
        </div>
      </section>

      <section className="relative mx-auto w-full max-w-5xl px-6 pb-10">
        {/*<div className="mb-5 flex items-end justify-between gap-4">*/}
        {/*  <div>*/}
        {/*    <h2 className="mt-2 text-xl font-semibold text-white/90">从理解 Minecraft，到重新发明沙盒</h2>*/}
        {/*  </div>*/}
        {/*</div>*/}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {cards.map((card) => (
            <GlassCard key={card.title} href={card.href} tint={card.tint}>
              <CardCopy kicker={card.kicker} title={card.title} detail={card.detail} />
            </GlassCard>
          ))}
        </div>
      </section>

      <footer className="relative mx-auto w-full max-w-5xl px-6 pb-16">
        <div className="border-t border-white/10 pt-6">
          <p className="max-w-3xl text-sm leading-relaxed text-white/55">
            写给 Minecraft 的长期玩家，也写给正在做沙盒、体素、引擎、Mod 与 UGC 的开发者。
          </p>
          <p className="mt-3 text-xs text-white/35">Aether · 沙盒游戏《以太效应》开发者</p>
        </div>
      </footer>

      <BackgroundPicker value={activeEffect} onChange={onEffectChange} />
    </div>
  );
}
