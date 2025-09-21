"use client";

import { mockBooks } from "@/data/mockBooks";
import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";
import { useState } from "react";

type CardBookProps = {
  searchTerm: string;
};

export default function CardBook({ searchTerm }: CardBookProps) {
  const filteredBooks = mockBooks.filter((book) => {
    const term = searchTerm.toLowerCase();
    return (
      book.title.toLowerCase().includes(term) ||
      book.author.toLowerCase().includes(term) ||
      book.genre.toLowerCase().includes(term) ||
      book.year.toString().includes(term) ||
      book.pages?.toString().includes(term) ||
      book.synopsis?.toLowerCase().includes(term)
    );
  });

  return (
    <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {filteredBooks.map((book) => (
        <Card key={book.id} book={book} />
      ))}
    </div>
  );
}

function Card({ book }: { book: (typeof mockBooks)[0] }) {
  const [imgError, setImgError] = useState(false);

  return (
    <Link
      href={`/livro/${book.id}`}
      className="rounded-2xl shadow-md border overflow-hidden flex flex-col hover:shadow-lg transition"
    >
      <div className="relative w-full h-52 flex items-center justify-center">
        <Image
          src={
            imgError || !book.coverUrl ? "/fallback-book.jpg" : book.coverUrl
          }
          alt={`Capa do livro ${book.title}`}
          fill
          className="object-contain p-2"
          onError={() => setImgError(true)}
        />
      </div>

      <div className="p-4 flex flex-col gap-2 flex-1">
        <h2 className="font-bold text-lg">{book.title}</h2>
        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-600">{book.author}</p>
          <p className="text-xs text-gray-500">Ano: {book.year}</p>
        </div>

        <div className="flex justify-between items-center">
          <div className="flex gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                size={18}
                className={
                  i < (book.rating ?? 0)
                    ? "text-yellow-500 fill-yellow-500"
                    : "text-gray-300"
                }
              />
            ))}
          </div>
          <p className="text-xs text-gray-500">Pags.: {book.pages}</p>
        </div>

        <span className="inline-block w-fit px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-full">
          {book.genre}
        </span>
      </div>

      <div
        className="flex justify-around border-t p-2"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="text-xs px-3 py-1 rounded-md bg-blue-600 text-white hover:bg-blue-800 cursor-default">
          Lido
        </button>
        <button className="text-xs px-3 py-1 rounded-md bg-green-600 text-white hover:bg-green-800 cursor-default">
          Lendo
        </button>
        <button className="text-xs px-3 py-1 rounded-md bg-yellow-600 text-white hover:bg-yellow-700 cursor-default">
          Editar
        </button>
        <button className="text-xs px-3 py-1 rounded-md bg-red-600 text-white hover:bg-red-700 cursor-default">
          Excluir
        </button>
      </div>
    </Link>
  );
}
