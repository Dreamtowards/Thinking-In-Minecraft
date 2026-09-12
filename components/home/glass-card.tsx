'use client';

import LiquidGlass from '@nkzw/liquid-glass';
import Link from 'next/link';
import type { ReactNode } from 'react';
import { useElementSize } from './use-element-size';

export function GlassCard({
  href,
  tint,
  children,
}: {
  href: string;
  tint: string;
  children: ReactNode;
}) {
  const { ref, size } = useElementSize();

  return (
    <div ref={ref} className="relative">
      <div aria-hidden className="pointer-events-none invisible select-none p-5">
        {children}
      </div>
      {size.width > 0 && size.height > 0 ? (
        <LiquidGlass
          mode="standard"
          aberrationIntensity={5}
          elasticity={0.03}
          borderRadius={20}
          padding="0"
          style={{ position: 'absolute', left: '50%', top: '50%' }}
        >
          <Link
            href={href}
            className="group relative flex flex-col overflow-hidden text-left text-white"
            style={{ width: size.width, height: size.height }}
          >
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-80 transition-opacity duration-300 group-hover:opacity-100"
              style={{
                backgroundImage: `radial-gradient(120% 90% at 85% 0%, ${tint}, transparent 60%)`,
              }}
            />
            <div className="relative p-5">{children}</div>
          </Link>
        </LiquidGlass>
      ) : null}
    </div>
  );
}
