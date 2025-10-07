// app/biblioteca/page.tsx
"use client";

import { useState } from "react";
import EnhancedSearchBar from "../../components/shared/EnhancedSearchBar";
import EnhancedCardBook from "../../components/shared/EnhancedCardBook";
import FilterSortControls, { FilterOptions, SortOptions } from "../../components/shared/FilterSortControls";
import { useAuth } from "@/contexts/AuthContext";
import { Prisma } from '@prisma/client'; // Importar tipos do Prisma

// Usar o tipo do Prisma para garantir consistência
type BookWithGenre = Prisma.BookGetPayload<{ include: { genre: true } }>;

export default function Biblioteca() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<FilterOptions>({
    genre: "",
    status: "",
    rating: "",
  });
  const [sort, setSort] = useState<SortOptions>({
    field: "title",
    direction: "asc",
  });

  const userBooks: BookWithGenre[] = user?.books || [];

  // CORREÇÃO 2: Obter gêneros únicos dos objetos de livro
  const availableGenres = Array.from(
    new Set(userBooks.map(book => book.genre.name).filter(Boolean))
  ).sort();

  const resetFilters = () => {
    setFilters({ genre: "", status: "", rating: "" });
  };

  return (
    <section className="w-full px-6">
      <div className="mb-6">
        <h1 className="text-4xl font-bold tracking-tight text-[var(--foreground)] sm:text-4xl mb-4">
          Minha Biblioteca
        </h1>
        <p className="text-lg text-gray-400 mb-6">
          Gerencie sua coleção de livros com busca avançada, filtros e ordenação.
        </p>
        
        <div className="mb-6">
          {/* CORREÇÃO 1: Passando a prop 'onSearch' em vez de 'setSearchTerm' */}
          <EnhancedSearchBar 
            onSearch={setSearchTerm}
            initialValue={searchTerm}
            placeholder="Buscar por título, autor, gênero..."
          />
        </div>

        <FilterSortControls
          filters={filters}
          setFilters={setFilters}
          sort={sort}
          setSort={setSort}
          availableGenres={availableGenres}
          onReset={resetFilters}
        />
      </div>

      <EnhancedCardBook 
        searchTerm={searchTerm}
        filters={filters}
        sort={sort}
        books={userBooks}
      />
    </section>
  );
}