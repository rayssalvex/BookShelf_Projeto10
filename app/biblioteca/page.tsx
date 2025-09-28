"use client";

import { useState } from "react";
import EnhancedSearchBar from "../../components/shared/EnhancedSearchBar";
import EnhancedCardBook from "../../components/shared/EnhancedCardBook";
import FilterSortControls, { FilterOptions, SortOptions } from "../../components/shared/FilterSortControls";
import { mockBooks } from "@/data/mockBooks";

export default function Biblioteca() {
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

  // Obter gêneros únicos dos livros
  const availableGenres = Array.from(
    new Set(mockBooks.map(book => book.genre).filter(Boolean))
  ).sort();

  const resetFilters = () => {
    setFilters({
      genre: "",
      status: "",
      rating: "",
    });
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
        
        {/* Barra de Busca Aprimorada */}
        <div className="mb-6">
          <EnhancedSearchBar 
            searchTerm={searchTerm} 
            setSearchTerm={setSearchTerm}
            placeholder="Buscar por título, autor, gênero, ano, páginas..."
          />
        </div>

        {/* Controles de Filtro e Ordenação */}
        <FilterSortControls
          filters={filters}
          setFilters={setFilters}
          sort={sort}
          setSort={setSort}
          availableGenres={availableGenres}
          onReset={resetFilters}
        />
      </div>

      {/* Cards dos Livros */}
      <EnhancedCardBook 
        searchTerm={searchTerm}
        filters={filters}
        sort={sort}
      />
    </section>
  );
}
