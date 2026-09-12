'use client';

import LiquidGlass from '@nkzw/liquid-glass';
import Link from 'next/link';
import type { ReactNode } from 'react';
import { useElementSize } from './use-element-size';

export function GlassLink({
  href,
  children,
  solid,
}: {
  href: string;
  children: ReactNode;
  solid?: boolean;
}) {
  const { ref, size } = useElementSize();

  return (
    <div ref={ref} className="relative">
      <div
        aria-hidden
        className="pointer-events-none invisible inline-flex h-14 select-none items-center px-10 text-base font-medium"
      >
        {children}
      </div>
      {size.width > 0 && size.height > 0 ? (
        <LiquidGlass
          mode="standard"
          aberrationIntensity={5}
          elasticity={0.1}
          borderRadius={999}
          padding="0"
          style={{ position: 'absolute', left: '50%', top: '50%' }}
        >
          <Link
            href={href}
            className={
              solid
                ? 'inline-flex items-center justify-center bg-white/80 text-base font-medium text-[#14080c]'
                : 'inline-flex items-center justify-center bg-white/[0.08] text-base font-medium text-white'
            }
            style={{ width: size.width, height: size.height }}
          >
            {children}
          </Link>
        </LiquidGlass>
      ) : null}
    </div>
  );
}
