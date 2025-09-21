import { mockBooks } from "@/data/mockBooks";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Star } from "lucide-react";

export async function generateStaticParams() {
  return mockBooks.map((book) => ({
    id: book.id,
  }));
}

export default function BookDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const book = mockBooks.find((b) => b.id === params.id);

  if (!book) {
    notFound();
  }

  return (
    <div className="flex flex-col md:flex-row gap-8 p-6">
      <div className="md:w-1/3">
        <Image
          src={book.coverUrl}
          alt={`Capa de ${book.title}`}
          width={400}
          height={600}
          className="rounded-lg shadow-lg w-full object-contain"
        />
      </div>

      <div className="md:w-2/3 flex flex-col gap-4">
        <h1 className="text-4xl font-bold">{book.title}</h1>
        <h2 className="text-2xl text-gray-300">{book.author}</h2>

        <div className="flex gap-4 text-sm text-gray-500">
          <span>
            <strong>Ano:</strong> {book.year}
          </span>
          <span>
            <strong>Gênero:</strong> {book.genre}
          </span>
          <span>
            <strong>Páginas:</strong> {book.pages}
          </span>
        </div>

        <div className="flex gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              size={20}
              className={
                i < (book.rating ?? 0)
                  ? "text-yellow-500 fill-yellow-500"
                  : "text-gray-300"
              }
            />
          ))}
        </div>

        <div className="prose max-w-none text-white">
          <h3 className="text-lg font-semibold mt-4">Sinopse</h3>
          <p>{book.synopsis}</p>
        </div>

        <div className="flex gap-3">
          <button className="text-sm px-3 py-1 rounded-md bg-blue-600 text-white hover:bg-blue-800 cursor-default">
            Lido
          </button>
          <button className="text-sm px-3 py-1 rounded-md bg-green-600 text-white hover:bg-green-800 cursor-default">
            Lendo
          </button>
          <button className="text-sm px-3 py-1 rounded-md bg-yellow-600 text-white hover:bg-yellow-700 cursor-default">
            Editar
          </button>
          <button className="text-sm px-3 py-1 rounded-md bg-red-600 text-white hover:bg-red-700 cursor-default">
            Excluir
          </button>
        </div>
      </div>
    </div>
  );
}
