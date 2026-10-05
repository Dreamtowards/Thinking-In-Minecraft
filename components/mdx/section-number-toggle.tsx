'use client';

import { ListOrdered } from 'lucide-react';
import { useEffect, useState } from 'react';

const storageKey = 'book-section-numbers';
const className = 'show-book-section-numbers';

export function SectionNumberToggle() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey) === 'true';
      setEnabled(saved);
      document.documentElement.classList.toggle(className, saved);
    } catch {
      // Reading preferences can be blocked; the switch still works for this page.
    }

    return () => document.documentElement.classList.remove(className);
  }, []);

  function toggle() {
    const next = !enabled;
    setEnabled(next);
    document.documentElement.classList.toggle(className, next);
    try {
      localStorage.setItem(storageKey, String(next));
    } catch {
      // Keep the current page usable even when storage is unavailable.
    }
  }

  return (
    <button
      type="button"
      aria-pressed={enabled}
      aria-label="显示小节序号"
      title="显示小节序号"
      onClick={toggle}
      className="inline-flex h-8 items-center gap-1.5 rounded-md border px-2.5 text-xs text-fd-muted-foreground transition-colors hover:bg-fd-accent hover:text-fd-foreground aria-pressed:border-fd-primary/40 aria-pressed:bg-fd-primary/10 aria-pressed:text-fd-primary"
    >
      <ListOrdered aria-hidden="true" className="size-3.5" />
    </button>
  );
}
