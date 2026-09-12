'use client';

import { BG_EFFECTS, type BgEffectId } from './home-background';

export function BackgroundPicker({
  value,
  onChange,
}: {
  value: BgEffectId;
  onChange: (id: BgEffectId) => void;
}) {
  const current = BG_EFFECTS.find((item) => item.id === value) ?? BG_EFFECTS[0];

  return (
    <div className="home-bg-dock">
      <a
        className="home-bg-credit"
        href={current.credit}
        target="_blank"
        rel="noreferrer"
        aria-label={`${current.label} by XorDev`}
      >
        Xor
      </a>
      <label className="home-bg-picker">
        <select
          aria-label="背景"
          value={value}
          onChange={(event) => onChange(event.target.value as BgEffectId)}
        >
          {BG_EFFECTS.map((item) => (
            <option key={item.id} value={item.id}>
              {item.label}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}
