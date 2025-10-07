// components/shared/BibliotecaView.tsx
"use client";

import { useState } from "react";
import EnhancedSearchBar from "./EnhancedSearchBar";
import EnhancedCardBook from "./EnhancedCardBook";
import FilterSortControls, { FilterOptions, SortOptions } from "./FilterSortControls";
import { Prisma, Genre } from '@prisma/client';

type BookWithGenre = Prisma.BookGetPayload<{ include: { genre: true } }>;

// 1. RECEBE OS DADOS INICIAIS COMO PROPRIEDADES
interface BibliotecaViewProps {
  initialBooks: BookWithGenre[];
  availableGenres: Genre[];
}

export function BibliotecaView({ initialBooks, availableGenres }: BibliotecaViewProps) {
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
          // Usa os nomes dos gêneros vindos da propriedade
          availableGenres={availableGenres.map(g => g.name)}
          onReset={resetFilters}
        />
      </div>

      <EnhancedCardBook 
        searchTerm={searchTerm}
        filters={filters}
        sort={sort}
        books={initialBooks} // 2. PASSA OS LIVROS DO BANCO PARA O COMPONENTE DE CARD
      />
    </section>
  );
}