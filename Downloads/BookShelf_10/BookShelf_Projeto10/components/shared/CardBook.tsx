"use client";

import { mockBooks } from "@/data/mockBooks";
import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";
import { useState, useEffect } from "react";
import BookCounter from "./BookCounter";

type BookStatus = { [key: number]: "lido" | "lendo" | "quero ler" | null };

type CardBookProps = {
  searchTerm: string;
};

function Card({
  book,
  status,
  onStatusChange,
}: {
  book: (typeof mockBooks)[0];
  status: "lido" | "lendo" | "quero ler" | null;
  onStatusChange: (
    bookId: number,
    newStatus: "lido" | "lendo" | "quero ler" | null
  ) => void;
}) {
  const [imgError, setImgError] = useState(false);

  return (
    <div
      className={`rounded-2xl border flex flex-col transition
        ${status === "lendo" ? "border bg-[#8adf3b18] border-green-500" : ""}
        ${status === "lido" ? "bg-[#ffffff25]" : ""}
        ${
          status === "quero ler"
            ? "border bg-[#f1dc1c1f] border-orange-500"
            : ""
        }`}
    >
      <Link href={`/livro/${book.id}`}>
        <div
          className={`relative w-full h-70 flex items-center justify-center hover:opacity-50 
            ${status === "lido" ? "opacity-50" : ""}`}
        >
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
      </Link>
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
          <p className="text-xs text-gray-500">Págs.: {book.pages}</p>
        </div>

        <span className="inline-block w-fit px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-full">
          {book.genre}
        </span>
      </div>

      <section className="flex justify-around border-t p-2">
        <div className="flex flex-col items-center gap-2">
          <div className="flex gap-2">
            <button
              onClick={() =>
                onStatusChange(book.id, status === "lido" ? null : "lido")
              }
              className="text-xs px-3 py-1 rounded-md bg-blue-600 text-white hover:bg-blue-800 cursor-pointer"
            >
              Lido
            </button>
            <button
              onClick={() =>
                onStatusChange(book.id, status === "lendo" ? null : "lendo")
              }
              className="text-xs px-3 py-1 rounded-md bg-green-600 text-white hover:bg-green-800 cursor-pointer"
            >
              Lendo
            </button>
            <button
              onClick={() =>
                onStatusChange(
                  book.id,
                  status === "quero ler" ? null : "quero ler"
                )
              }
              className="text-xs px-3 py-1 rounded-md bg-yellow-600 text-white hover:bg-yellow-800 cursor-pointer"
            >
              Quero ler
            </button>
          </div>
          <div className="flex gap-2">
            <Link
              href={`/livro/${book.id}`}
              className="text-xs px-3 py-1 rounded-md cursor-pointer"
              title="Visualizar"
            >
              ➕
            </Link>

            <button className="text-xs px-3 py-1 rounded-md bg-purple-600 text-white hover:bg-purple-800 cursor-pointer">
              Editar
            </button>
            <button className="text-xs px-3 py-1 rounded-md bg-red-600 text-white hover:bg-red-700 cursor-pointer">
              Excluir
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default function CardBook({ searchTerm }: CardBookProps) {
  const [bookStatus, setBookStatus] = useState<BookStatus>({});

  useEffect(() => {
    try {
      const savedStatus = localStorage.getItem("bookStatus");
      if (savedStatus) {
        setBookStatus(JSON.parse(savedStatus));
      }
    } catch (e) {
      console.error("Failed to load book status from localStorage", e);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("bookStatus", JSON.stringify(bookStatus));
    } catch (e) {
      console.error("Failed to save book status to localStorage", e);
    }
  }, [bookStatus]);

  const handleStatusChange = (
    bookId: number,
    newStatus: "lido" | "lendo" | "quero ler" | null
  ) => {
    setBookStatus((prevStatus) => ({
      ...prevStatus,
      [bookId]: newStatus,
    }));
  };

  const counts = {
    total: mockBooks.length,
    lido: mockBooks.filter((book) => bookStatus[book.id] === "lido").length,
    lendo: mockBooks.filter((book) => bookStatus[book.id] === "lendo").length,
    queroLer: mockBooks.filter((book) => bookStatus[book.id] === "quero ler")
      .length,
  };

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
    <div>
      <BookCounter counts={counts} />
      {filteredBooks.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {filteredBooks.map((book) => (
            <Card
              key={book.id}
              book={book}
              status={bookStatus[book.id] || null}
              onStatusChange={handleStatusChange}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-5 text-center text-white">
          <p className="text-xl font-semibold">Nenhum livro encontrado.</p>
          <p className="mt-2">
            Tente buscar por outro termo ou verifique a digitação.
          </p>
        </div>
      )}
    </div>
  );
}
