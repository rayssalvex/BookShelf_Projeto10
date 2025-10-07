"use client";

import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import BookCounter from "./BookCounter";
import { Prisma } from '@prisma/client';


// 1. TIPOS VINDOS DO PRISMA
type BookWithGenre = Prisma.BookGetPayload<{ include: { genre: true } }>;
type BookStatus = { [key: string]: "lido" | "lendo" | "quero ler" | null };

// 2. PROPRIEDADES ATUALIZADAS
interface CardBookProps {
  initialBooks: BookWithGenre[];
  searchTerm: string;
}

// COMPONENTE DO CARD (INTERNO)
function Card({ book, status, onStatusChange }: { book: BookWithGenre; status: "lido" | "lendo" | "quero ler" | null; onStatusChange: (bookId: string, newStatus: any) => void; }) {
  const [imgError, setImgError] = useState(false);
  return (
    <div className={`rounded-2xl border flex flex-col transition-all duration-300 hover:shadow-lg hover:scale-105 ${status === "lendo" ? "border-green-500 bg-[#8adf3b18]" : "border-slate-800"} ${status === "lido" ? "bg-[#ffffff25]" : ""} ${status === "quero ler" ? "border-orange-500 bg-[#f1dc1c1f]" : ""}`}>
      <Link href={`/livro/${book.id}`}>
        <div className={`relative w-full h-72 flex items-center justify-center hover:opacity-50 transition-opacity ${status === "lido" ? "opacity-50" : ""}`}>
          <Image src={imgError || !book.coverUrl ? "/fallback-book.jpg" : book.coverUrl} alt={`Capa do livro ${book.title}`} fill className="object-contain p-2" onError={() => setImgError(true)} />
        </div>
      </Link>
      <div className="p-4 flex flex-col gap-2 flex-1">
        <h2 className="font-bold text-lg text-white">{book.title}</h2>
        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-300">{book.author}</p>
          <p className="text-xs text-gray-400">Ano: {book.year}</p>
        </div>
        <div className="flex justify-between items-center">
          <div className="flex gap-1">
            {Array.from({ length: 5 }).map((_, i) => (<Star key={i} size={18} className={i < book.rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"} />))}
          </div>
          <p className="text-xs text-gray-400">Págs.: {book.pages}</p>
        </div>
        <span className="inline-block w-fit px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-full">{book.genre.name}</span>
      </div>
      <section className="flex justify-around border-t border-gray-700 p-2">
        <div className="flex flex-col items-center gap-2">
          <div className="flex gap-2">
              <button onClick={() => onStatusChange(book.id, status === "lido" ? null : "lido")} className={`text-xs px-3 py-1 rounded-md ${status === "lido" ? "bg-blue-700" : "bg-blue-600 hover:bg-blue-800"} text-white`}>Lido</button>
              <button onClick={() => onStatusChange(book.id, status === "lendo" ? null : "lendo")} className={`text-xs px-3 py-1 rounded-md ${status === "lendo" ? "bg-green-700" : "bg-green-600 hover:bg-green-800"} text-white`}>Lendo</button>
              <button onClick={() => onStatusChange(book.id, status === "quero ler" ? null : "quero ler")} className={`text-xs px-3 py-1 rounded-md ${status === "quero ler" ? "bg-yellow-700" : "bg-yellow-600 hover:bg-yellow-800"} text-white`}>Quero ler</button>
          </div>
          <div className="flex gap-2">
              <Link href={`/livro/${book.id}`} className="text-xs px-3 py-1 rounded-md bg-gray-600 text-white hover:bg-gray-700">Ver</Link>
              <button className="text-xs px-3 py-1 rounded-md bg-purple-600 text-white hover:bg-purple-800">Editar</button>
              <button className="text-xs px-3 py-1 rounded-md bg-red-600 text-white hover:bg-red-700">Excluir</button>
          </div>
        </div>
      </section>
    </div>
  );
}

// 3. O NOME DO COMPONENTE FOI MANTIDO, MAS AGORA ELE RECEBE 'initialBooks'
export default function CardBook({ initialBooks, searchTerm }: CardBookProps & { initialBooks: BookWithGenre[] }) {
  const [bookStatus, setBookStatus] = useState<BookStatus>({});

  // ... (sua lógica de localStorage para status, que pode ser mantida por enquanto)
  useEffect(() => {
    const savedStatus = localStorage.getItem("bookStatus");
    if (savedStatus) setBookStatus(JSON.parse(savedStatus));
  }, []);
  useEffect(() => {
    localStorage.setItem("bookStatus", JSON.stringify(bookStatus));
  }, [bookStatus]);

  const handleStatusChange = (bookId: string, newStatus: "lido" | "lendo" | "quero ler" | null) => {
    setBookStatus((prevStatus) => ({ ...prevStatus, [bookId]: newStatus }));
  };

  // 4. FILTRO E COUNTER AGORA USAM 'initialBooks' (OS DADOS DO BANCO)
  const filteredBooks = useMemo(() => {
    if (!searchTerm) return initialBooks;
    const term = searchTerm.toLowerCase();
    return initialBooks.filter(book =>
      book.title.toLowerCase().includes(term) ||
      book.author.toLowerCase().includes(term) ||
      book.genre.name.toLowerCase().includes(term)
    );
  }, [initialBooks, searchTerm]);

  const counterData = {
  total: initialBooks.length, // ou 'books.length', dependendo do nome da sua variável
  completed: initialBooks.filter(b => b.status === "LIDO").length,
  reading: initialBooks.filter(b => b.status === "LENDO").length,
  wantToRead: initialBooks.filter(b => b.status === "QUERO_LER").length,
};

  return (
    <div>
      <BookCounter data={counterData} />
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
        <div className="text-center py-12 text-white">
          <p className="text-xl font-semibold">Nenhum livro encontrado.</p>
        </div>
      )}
    </div>
  );
}