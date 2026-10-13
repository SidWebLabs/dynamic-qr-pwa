"use client";

import type { KeyboardEvent } from "react";

interface Props {
  value: string;
  onChange: (value: string) => void;
  onError?: (error: string | null) => void;
  placeholder?: string;
  className?: string;
  focusClassName?: string;
}

/**
 * Whole-rupee amount field:
 * - no mouse-wheel / scroll value changes
 * - no decimal / point values (shows error while typing)
 */
export default function AmountInput({
  value,
  onChange,
  onError,
  placeholder = "e.g. 2001",
  className = "",
  focusClassName = "focus:border-blue-400",
}: Props) {
  const handleChange = (raw: string) => {
    if (raw === "") {
      onChange("");
      onError?.(null);
      return;
    }

    if (/[.,]/.test(raw)) {
      onError?.("Decimal / point values are not allowed. Enter whole rupees only.");
      onChange(raw.replace(/[^\d]/g, ""));
      return;
    }

    if (!/^\d+$/.test(raw)) {
      onError?.("Only whole numbers are allowed.");
      onChange(raw.replace(/[^\d]/g, ""));
      return;
    }

    // Prevent leading zeros like 0001 → keep as typed but strip leading-only mess optionally
    onChange(raw.replace(/^0+(?=\d)/, "") || raw);
    onError?.(null);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    // Block decimal separators and scientific notation
    if ([".", ",", "e", "E", "+", "-"].includes(e.key)) {
      e.preventDefault();
      onError?.("Decimal / point values are not allowed. Enter whole rupees only.");
    }
  };

  return (
    <div className="relative">
      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-semibold text-sm pointer-events-none">
        ₹
      </span>
      <input
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        placeholder={placeholder}
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        onKeyDown={handleKeyDown}
        onWheel={(e) => e.currentTarget.blur()}
        onPaste={(e) => {
          const pasted = e.clipboardData.getData("text");
          if (/[.,]/.test(pasted) || !/^\d+$/.test(pasted.trim())) {
            e.preventDefault();
            onError?.("Decimal / point values are not allowed. Enter whole rupees only.");
          }
        }}
        className={`w-full pl-8 pr-4 py-3 rounded-xl border border-slate-200 text-slate-800 text-sm bg-slate-50 ${focusClassName} focus:bg-white transition-colors outline-none font-semibold ${className}`}
      />
    </div>
  );
}
