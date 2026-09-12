'use client';

import { BG_EFFECTS, type BgEffectId } from './home-background';

export function BackgroundPicker({
  value,
  onChange,
}: {
  value: BgEffectId;
  onChange: (id: BgEffectId) => void;
}) {
  return (
    <label className="home-bg-picker">
      <span>背景</span>
      <select
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
  );
}
