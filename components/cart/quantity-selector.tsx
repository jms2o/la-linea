"use client";

import { Minus, Plus } from "lucide-react";

type QuantitySelectorProps = {
  value: number;
  min?: number;
  max?: number;
  onChange: (value: number) => void;
};

export function QuantitySelector({
  value,
  min = 1,
  max = 999,
  onChange
}: QuantitySelectorProps) {
  return (
    <div className="grid w-32 grid-cols-3 overflow-hidden rounded-lg border border-[var(--border)] bg-white">
      <button
        type="button"
        aria-label="Disminuir cantidad"
        className="grid h-11 place-items-center text-[var(--muted)] transition hover:bg-[#F3F4F6]"
        onClick={() => onChange(Math.max(min, value - 1))}
      >
        <Minus size={16} />
      </button>
      <span className="grid h-11 place-items-center border-x border-[var(--border)] text-sm font-semibold">
        {value}
      </span>
      <button
        type="button"
        aria-label="Aumentar cantidad"
        className="grid h-11 place-items-center text-[var(--muted)] transition hover:bg-[#F3F4F6]"
        onClick={() => onChange(Math.min(max, value + 1))}
      >
        <Plus size={16} />
      </button>
    </div>
  );
}
