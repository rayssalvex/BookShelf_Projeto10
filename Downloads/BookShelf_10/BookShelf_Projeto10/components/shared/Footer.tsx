// components/shared/Footer.tsx
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="w-full text-white bg-[--card-bg] shadow-inner mt-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0 text-center md:text-left">
            <h2 className="text-xl font-bold text-white">BookShelf</h2>
            <p className="text-sm text-[--secondary-text]">Sua estante de livros digital.</p>
          </div>
          <div className="flex space-x-6">
            <Link href="/sobre" className="text-[--foreground] hover:text-[--primary] transition-colors">Sobre</Link>
            <Link href="/privacidade" className="text-[--foreground] hover:text-[--primary] transition-colors">Privacidade</Link>
            <Link href="/contato" className="text-[--foreground] hover:text-[--primary] transition-colors">Contato</Link>
          </div>
        </div>
        <div className="text-center text-[--secondary-text] text-sm mt-6 border-t border-[--border] pt-4">
          <p>&copy; {new Date().getFullYear()} BookShelf. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}