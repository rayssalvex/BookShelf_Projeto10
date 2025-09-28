"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark" | "system";

interface ThemeContextType {
  theme: Theme; // light | dark | system
  resolvedTheme: "light" | "dark"; // tema efetivo
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("system");
  const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">("light");
  const [mounted, setMounted] = useState(false);

  // Detecta e aplica o tema efetivo
  useEffect(() => {
    let savedTheme: Theme = "system";
    try {
      const local = localStorage.getItem("bookshelf-theme") as Theme;
      if (local === "light" || local === "dark" || local === "system") {
        savedTheme = local;
      }
    } catch {}
    setTheme(savedTheme);
    setMounted(true);
  }, []);

  // Atualiza resolvedTheme e <html> ao mudar theme ou sistema
  useEffect(() => {
    if (!mounted) return;
    const root = document.documentElement;
    let effective: "light" | "dark" = "light";
    if (theme === "system") {
      effective = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    } else {
      effective = theme;
    }
    setResolvedTheme(effective);
    root.classList.remove("light", "dark");
    root.classList.add(effective);
    try {
      localStorage.setItem("bookshelf-theme", theme);
    } catch {}

    // Listener para mudanças do SO
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => {
      if (theme === "system") {
        const sys = mq.matches ? "dark" : "light";
        setResolvedTheme(sys);
        root.classList.remove("light", "dark");
        root.classList.add(sys);
      }
    };
    mq.addEventListener("change", handleChange);
    return () => mq.removeEventListener("change", handleChange);
  }, [theme, mounted]);

  const contextValue: ThemeContextType = {
    theme,
    resolvedTheme,
    setTheme,
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      <div style={!mounted ? { visibility: "hidden" } : undefined}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme deve ser usado dentro de um ThemeProvider");
  }
  return context;
}
