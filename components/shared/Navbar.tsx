// components/shared/Navbar.tsx
"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import ThemeToggle from "./ThemeToggle";

export function Navbar() {
  return (
    <motion.header 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm shadow-lg sticky top-0 z-50 border-b border-gray-200 dark:border-gray-700"
    >
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <motion.div 
            className="flex-shrink-0"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <Link href="/" className="text-3xl font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors duration-300">
              BookShelf
            </Link>
          </motion.div>

          <div className="hidden md:flex items-center space-x-6">
            <div className="flex items-baseline space-x-6">
              <Link
                href="/"
                className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:underline px-3 py-2 rounded-md text-sm font-semibold tracking-wider transition-colors duration-300"
              >
                Home
              </Link>
              <Link
                href="/biblioteca"
                className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:underline px-3 py-2 rounded-md text-sm font-semibold tracking-wider transition-colors duration-300"
              >
                Minha Biblioteca
              </Link>
              <Link
                href="/adicionar"
                className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:underline px-3 py-2 rounded-md text-sm font-semibold tracking-wider transition-colors duration-300"
              >
                Adicionar Livro
              </Link>
            </div>
            
            {/* Theme Toggle */}
            <div className="ml-4">
              <ThemeToggle />
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <ThemeToggle size="sm" />
            <button className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 p-2">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </nav>
    </motion.header>
  );
}
