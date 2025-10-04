"use client";

import { mockBooks } from "@/data/mockBooks";
import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";
import { useState, useEffect } from "react";
import BookCounter from "./BookCounter";
import { highlightSearchTerm } from "./EnhancedSearchBar";
import { FilterOptions, SortOptions } from "./FilterSortControls";

type BookStatus = { [key: string]: "lido" | "lendo" | "quero ler" | null };

type EnhancedCardBookProps = {
  searchTerm: string;
  filters: FilterOptions;
  sort: SortOptions;
};

function Card({
  book,
  status,
  onStatusChange,
  searchTerm,
}: {
  book: (typeof mockBooks)[0];
  status: "lido" | "lendo" | "quero ler" | null;
  onStatusChange: (
    bookId: string,
    newStatus: "lido" | "lendo" | "quero ler" | null
  ) => void;
  searchTerm: string;
}) {
  const [imgError, setImgError] = useState(false);

  return (
    <div
      className={`rounded-2xl border flex flex-col transition-all duration-300 hover:shadow-lg hover:scale-105
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
          className={`relative w-full h-70 flex items-center justify-center hover:opacity-50 transition-opacity
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
        <h2 className="font-bold text-lg text-white">
          {highlightSearchTerm(book.title, searchTerm)}
        </h2>
        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-300">
            {highlightSearchTerm(book.author, searchTerm)}
          </p>
          <p className="text-xs text-gray-400">
            Ano: {highlightSearchTerm(book.year?.toString() || "", searchTerm)}
          </p>
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
            <span className="text-xs text-gray-400 ml-1">
              ({book.rating || "N/A"})
            </span>
          </div>
          <p className="text-xs text-gray-400">
            Págs.: {highlightSearchTerm(book.pages?.toString() || "", searchTerm)}
          </p>
        </div>

        <span className="inline-block w-fit px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-full">
          {highlightSearchTerm(
            typeof book.genre === "object" && book.genre !== null ? book.genre.name : (book.genre || ""),
            searchTerm
          )}
        </span>

        {/* Status Badge */}
        {status && (
          <div className="flex justify-center">
            <span
              className={`px-2 py-1 text-xs font-medium rounded-full ${
                status === "lido"
                  ? "bg-blue-100 text-blue-700"
                  : status === "lendo"
                  ? "bg-green-100 text-green-700"
                  : "bg-yellow-100 text-yellow-700"
              }`}
            >
              {status === "lido" ? "✓ Lido" : status === "lendo" ? "📖 Lendo" : "📚 Quero ler"}
            </span>
          </div>
        )}
      </div>

      <section className="flex justify-around border-t border-gray-700 p-2">
        <div className="flex flex-col items-center gap-2">
          <div className="flex gap-2">
            <button
              onClick={() =>
                onStatusChange(book.id, status === "lido" ? null : "lido")
              }
              className={`text-xs px-3 py-1 rounded-md transition-colors ${
                status === "lido"
                  ? "bg-blue-700 text-white"
                  : "bg-blue-600 text-white hover:bg-blue-800"
              }`}
            >
              Lido
            </button>
            <button
              onClick={() =>
                onStatusChange(book.id, status === "lendo" ? null : "lendo")
              }
              className={`text-xs px-3 py-1 rounded-md transition-colors ${
                status === "lendo"
                  ? "bg-green-700 text-white"
                  : "bg-green-600 text-white hover:bg-green-800"
              }`}
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
              className={`text-xs px-3 py-1 rounded-md transition-colors ${
                status === "quero ler"
                  ? "bg-yellow-700 text-white"
                  : "bg-yellow-600 text-white hover:bg-yellow-800"
              }`}
            >
              Quero ler
            </button>
          </div>
          <div className="flex gap-2">
            <Link
              href={`/livro/${book.id}`}
              className="text-xs px-3 py-1 rounded-md bg-gray-600 text-white hover:bg-gray-700 transition-colors"
              title="Visualizar"
            >
               Ver
            </Link>

            <button className="text-xs px-3 py-1 rounded-md bg-purple-600 text-white hover:bg-purple-800 transition-colors">
               Editar
            </button>
            <button className="text-xs px-3 py-1 rounded-md bg-red-600 text-white hover:bg-red-700 transition-colors">
               Excluir
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default function EnhancedCardBook({ searchTerm, filters, sort }: EnhancedCardBookProps) {
  const [books, setBooks] = useState<any[]>([]);
  const [bookStatus, setBookStatus] = useState<BookStatus>({});

  useEffect(() => {
    async function fetchBooks() {
      try {
        const res = await fetch("/api/books");
        const data = await res.json();
        setBooks(data);
      } catch (e) {
        console.error("Erro ao buscar livros da API", e);
      }
    }
    fetchBooks();
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
    bookId: string,
    newStatus: "lido" | "lendo" | "quero ler" | null
  ) => {
    setBookStatus((prevStatus) => ({
      ...prevStatus,
      [bookId]: newStatus,
    }));
  };

  // Filtrar livros
  const filteredBooks = books.filter((book) => {
    // Filtro de busca
    const term = searchTerm.toLowerCase();
    const matchesSearch = !term || (
      book.title.toLowerCase().includes(term) ||
      book.author.toLowerCase().includes(term) ||
      book.genre?.toLowerCase().includes(term) ||
      book.year?.toString().includes(term) ||
      book.pages?.toString().includes(term) ||
      book.synopsis?.toLowerCase().includes(term)
    );

    // Filtro por gênero
    const matchesGenre = !filters.genre || book.genre === filters.genre;

    // Filtro por status
    const bookStatusValue = bookStatus[book.id];
    const matchesStatus = !filters.status || 
      (filters.status === "sem status" && !bookStatusValue) ||
      bookStatusValue === filters.status;

    // Filtro por avaliação
    const matchesRating = !filters.rating || 
      (book.rating && book.rating >= parseInt(filters.rating));

    return matchesSearch && matchesGenre && matchesStatus && matchesRating;
  });

  // Ordenar livros
  const sortedBooks = [...filteredBooks].sort((a, b) => {
    let aValue: any = a[sort.field];
    let bValue: any = b[sort.field];

    // Tratar valores undefined/null
    if (aValue === undefined || aValue === null) aValue = '';
    if (bValue === undefined || bValue === null) bValue = '';

    // Converter para string para comparação
    if (typeof aValue === 'string') aValue = aValue.toLowerCase();
    if (typeof bValue === 'string') bValue = bValue.toLowerCase();

    let comparison = 0;
    if (aValue < bValue) comparison = -1;
    if (aValue > bValue) comparison = 1;

    return sort.direction === 'desc' ? -comparison : comparison;
  });

  const counts = {
    total: books.length,
    lido: books.filter((book) => bookStatus[book.id] === "lido").length,
    lendo: books.filter((book) => bookStatus[book.id] === "lendo").length,
    queroLer: books.filter((book) => bookStatus[book.id] === "quero ler").length,
  };

  return (
    <div>
      <BookCounter counts={counts} />
      
      {/* Resultados da busca */}
      {searchTerm && (
        <div className="mb-4 text-sm text-gray-400">
          {filteredBooks.length} resultado(s) encontrado(s) para &quot;{searchTerm}&quot;
        </div>
      )}

      {sortedBooks.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {sortedBooks.map((book) => (
            <Card
              key={book.id}
              book={book}
              status={bookStatus[book.id] || null}
              onStatusChange={handleStatusChange}
              searchTerm={searchTerm}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-center text-white">
          <div className="text-6xl mb-4">📚</div>
          <p className="text-xl font-semibold mb-2">Nenhum livro encontrado</p>
          <p className="text-gray-400">
            {searchTerm 
              ? "Tente buscar por outro termo ou ajustar os filtros."
              : "Tente ajustar os filtros aplicados."
            }
          </p>
        </div>
      )}
    </div>
  );
}

