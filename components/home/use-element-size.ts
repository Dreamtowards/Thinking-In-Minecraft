'use client';

import { useEffect, useRef, useState } from 'react';

export function useElementSize() {
  const ref = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const cell = ref.current;
    if (!cell) return;
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setSize({ width: Math.round(width), height: Math.round(height) });
    });
    observer.observe(cell);
    return () => observer.disconnect();
  }, []);

  return { ref, size };
}
