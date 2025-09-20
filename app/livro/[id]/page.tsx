// app/livro/[id]/page.tsx
import { mockBooks } from "@/data/mockBooks";
import Image from "next/image";
import { notFound } from "next/navigation";

// Esta função ajuda o Next.js a gerar as páginas estaticamente no momento da build
export async function generateStaticParams() {
  return mockBooks.map((book) => ({
    id: book.id,
  }));
}

export default function BookDetailsPage({ params }: { params: { id: string } }) {
  // Encontra o livro com base no ID da URL
  const book = mockBooks.find((b) => b.id === params.id);

  // Se o livro não for encontrado, mostra uma página 404
  if (!book) {
    notFound();
  }

  return (
    <div className="flex flex-col md:flex-row gap-8">
      <div className="md:w-1/3">
        <Image 
          src={book.coverUrl}
          alt={`Capa de ${book.title}`}
          width={400}
          height={600}
          className="rounded-lg shadow-lg w-full"
        />
      </div>
      <div className="md:w-2/3">
        <h1 className="text-4xl font-bold mb-2">{book.title}</h1>
        <h2 className="text-2xl text-gray-600 mb-6">{book.author}</h2>
        
        <div className="prose max-w-none">
          <p>
            Aqui virá a sinopse e todo o conteúdo de leitura do livro... 
            Por enquanto, estamos exibindo os detalhes básicos do livro com ID: <strong>{params.id}</strong>
          </p>
          {/* Futuramente, mais detalhes serão adicionados aqui */}
        </div>
      </div>
    </div>
  );
}