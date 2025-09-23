"use client";

import { motion } from "framer-motion";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

interface ThemeToggleProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export default function ThemeToggle({ className = "", size = "md" }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();

  const sizeClasses = {
    sm: "w-12 h-6",
    md: "w-14 h-7",
    lg: "w-16 h-8"
  };

  const iconSizes = {
    sm: 12,
    md: 14,
    lg: 16
  };

  return (
    <button
      onClick={toggleTheme}
      className={`
        relative inline-flex items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900
        ${theme === "dark" 
          ? "bg-gray-700 hover:bg-gray-600" 
          : "bg-gray-300 hover:bg-gray-400"
        }
        ${sizeClasses[size]}
        ${className}
      `}
      title={`Alternar para modo ${theme === "dark" ? "claro" : "escuro"}`}
    >
      {/* Track */}
      <span className="sr-only">Alternar tema</span>
      
      {/* Thumb */}
      <motion.span
        className={`
          inline-block rounded-full shadow-lg transform transition-transform duration-200 ease-in-out
          ${theme === "dark" 
            ? "bg-gray-900 text-yellow-400" 
            : "bg-white text-gray-600"
          }
          ${size === "sm" ? "w-5 h-5" : size === "md" ? "w-6 h-6" : "w-7 h-7"}
        `}
        animate={{
          x: theme === "dark" 
            ? size === "sm" ? 24 : size === "md" ? 28 : 32
            : 2
        }}
        transition={{
          type: "spring",
          stiffness: 500,
          damping: 30
        }}
      >
        <div className="flex items-center justify-center w-full h-full">
          {theme === "dark" ? (
            <Moon size={iconSizes[size]} />
          ) : (
            <Sun size={iconSizes[size]} />
          )}
        </div>
      </motion.span>
    </button>
  );
}

