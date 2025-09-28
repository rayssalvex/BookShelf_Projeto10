// components/shared/Footer.tsx
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="w-full bg-[var(--card-bg)] shadow-inner mt-12 text-[var(--foreground)]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0 text-center md:text-left">
            <h2 className="text-xl font-bold text-[var(--foreground)]">BookShelf</h2>
            <p className="text-sm text-[var(--secondary-text)]">Sua estante de livros digital.</p>
          </div>
          <div className="flex space-x-6">
            <Link href="/sobre" className="text-[var(--foreground)] hover:text-[var(--primary)] transition-colors">Sobre</Link>
            <Link href="/privacidade" className="text-[var(--foreground)] hover:text-[var(--primary)] transition-colors">Privacidade</Link>
            <Link href="/contato" className="text-[var(--foreground)] hover:text-[var(--primary)] transition-colors">Contato</Link>
          </div>
        </div>
        <div className="text-center text-[var(--secondary-text)] text-sm mt-6 border-t border-[var(--border)] pt-4">
          <p>&copy; {new Date().getFullYear()} BookShelf. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}