// components/shared/Navbar.tsx
import Link from "next/link";

export function Navbar() {
  return (
    <header className="w-full bg-[--card-bg] bg-opacity-80 backdrop-blur-sm shadow-lg sticky top-0 z-50 border-b border-[--border]">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex-shrink-0">
            <div className="text-3xl font-bold text-white hover:text-[--primary] transition-colors duration-300">
              BookShelf
            </div>
          </div>

          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-6">
              <Link
                href="/"
                className="text-[--primary] hover:text-[--primary-hover] hover:underline px-3 py-2 rounded-md text-sm font-semibold tracking-wider transition-colors duration-300"
              >
                Home
              </Link>
              <Link
                href="/biblioteca"
                className="text-[--foreground] hover:text-[--primary-hover] hover:underline px-3 py-2 rounded-md text-sm font-semibold tracking-wider transition-colors duration-300"
              >
                Minha Biblioteca
              </Link>
              <Link
                href="/adicionar"
                className="text-[--foreground] hover:text-[--primary-hover] hover:underline px-3 py-2 rounded-md text-sm font-semibold tracking-wider transition-colors duration-300"
              >
                Adicionar Livro
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
