"use client";

import clsx from "clsx";

interface FilterChipsProps<T extends string> {
  options: { value: T; label: string }[];
  value?: T;
  onChange: (value: T | undefined) => void;
  allLabel?: string;
}

export function FilterChips<T extends string>({
  options,
  value,
  onChange,
  allLabel = "전체",
}: FilterChipsProps<T>) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        onClick={() => onChange(undefined)}
        className={clsx(
          "rounded-lg px-3 py-1.5 text-sm transition",
          !value
            ? "bg-brand-500 text-white"
            : "bg-[var(--surface-elevated)] text-muted hover:text-foreground"
        )}
      >
        {allLabel}
      </button>
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className={clsx(
            "rounded-lg px-3 py-1.5 text-sm transition",
            value === option.value
              ? "bg-brand-500 text-white"
              : "bg-[var(--surface-elevated)] text-muted hover:text-foreground"
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
