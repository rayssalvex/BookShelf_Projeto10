// app/page.tsx
import { BookCarousel } from "@/components/shared/BookCarousel";
import { Dashboard } from "@/components/shared/Dashboard";
import { prisma } from "@/lib/prisma"; // Importa o Prisma

// Esta página agora é um Server Component que busca dados
export default async function Home() {
  
  // Busca os livros diretamente do banco de dados no servidor
  const books = await prisma.book.findMany({
    include: {
      genre: true, // Inclui o gênero para os cálculos do Dashboard
    },
    orderBy: {
      createdAt: 'desc',
    }
  });

  return (
    <section className="w-full space-y-12">
      {/* Dashboard com Estatísticas */}
      <div className="mb-10">
        <h1 className="text-4xl font-bold tracking-tight text-[var(--foreground)] sm:text-5xl mb-2">
          Dashboard da Biblioteca
        </h1>
        <p className="text-lg leading-8 text-[var(--secondary-text)] mb-8">
          Acompanhe suas estatísticas de leitura e descubra insights sobre sua coleção.
        </p>
        {/* Passa os livros buscados como uma propriedade para o Dashboard */}
        <Dashboard books={books} />
      </div>

      {/* Livros em Destaque */}
      <div className="mb-10 text-center">
        <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Livros em Destaque
        </h2>
        <p className="mt-4 text-lg leading-8 text-[var(--secondary-text)]">
          Explore os títulos mais recentes e populares da sua coleção.
        </p>
      </div>

      {/* Passa os livros buscados como uma propriedade para o Carrossel */}
      <BookCarousel books={books} />
    </section>
  );
}