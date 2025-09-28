"use client";

import { Sun, Moon, Monitor } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { useState, useRef } from "react";

type ThemeToggleSize = "sm" | "md" | "lg";
interface ThemeToggleProps {
  className?: string;
  size?: ThemeToggleSize;
}

export default function ThemeToggle({ className = "", size = "md" }: ThemeToggleProps) {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);
  const _size: ThemeToggleSize = size;

  const iconSizes: Record<ThemeToggleSize, number> = {
    sm: 16,
    md: 20,
    lg: 24
  };

  const getOptions = (size: ThemeToggleSize) => ([
    {
      value: "light",
      label: "Claro",
      icon: <Sun size={iconSizes[size]} className="text-yellow-500" />
    },
    {
      value: "dark",
      label: "Escuro",
      icon: <Moon size={iconSizes[size]} className="text-blue-400" />
    },
    {
      value: "system",
      label: "Sistema",
      icon: <Monitor size={iconSizes[size]} className="text-gray-500" />
    }
  ]);

  const options = getOptions(_size);
  const current = options.find(o => o.value === theme) || options[2];
  const currentIcon =
    theme === "system"
      ? (resolvedTheme === "dark"
          ? <Moon size={iconSizes[_size]} className="text-blue-400" />
          : <Sun size={iconSizes[_size]} className="text-yellow-500" />)
      : current.icon;

  // Fecha dropdown ao perder foco
  const handleBlur = (e: React.FocusEvent<HTMLButtonElement | HTMLDivElement>) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setOpen(false);
    }
  };

  return (
    <div className={`relative inline-block text-left ${className}`}
      tabIndex={-1}
      onBlur={handleBlur}
    >
      <button
        ref={btnRef}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="Alternar tema"
        className={`flex items-center gap-2 rounded-md px-2 py-1 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500
          text-gray-900 dark:text-gray-100`}
        onClick={() => setOpen(o => !o)}
      >
        {theme === "system" ? <Monitor size={iconSizes[size]} /> : currentIcon}
        <span className="hidden sm:inline text-xs font-medium">
          {theme === "system" ? "Sistema" : current.label}
        </span>
        <span className="ml-1">▼</span>
      </button>
      {open && (
        <div
          className="absolute z-50 mt-2 w-36 rounded-md bg-[var(--card-bg)] text-[var(--foreground)] shadow-lg ring-1 ring-black/5 focus:outline-none animate-fade-in"
          role="listbox"
        >
          {options.map(opt => (
            <button
              key={opt.value}
              role="option"
              aria-selected={theme === opt.value}
              className={`flex items-center w-full gap-2 px-3 py-2 text-sm transition-colors
                hover:bg-[var(--primary-hover)] hover:text-[var(--foreground)]
                ${theme === opt.value ? "font-bold bg-[var(--primary-hover)]" : ""}`}
              onClick={() => {
                setTheme(opt.value as any);
                setOpen(false);
                btnRef.current?.focus();
              }}
            >
              {opt.icon}
              <span>{opt.label}</span>
              {theme === opt.value && <span className="ml-auto">✓</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

