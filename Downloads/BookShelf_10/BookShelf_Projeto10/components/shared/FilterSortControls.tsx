"use client";

import { useState } from "react";
import { ChevronDown, Filter, SortAsc, SortDesc } from "lucide-react";

export type FilterOptions = {
  genre: string;
  status: string;
  rating: string;
};

export type SortOptions = {
  field: 'title' | 'author' | 'year' | 'rating' | 'pages';
  direction: 'asc' | 'desc';
};

type FilterSortControlsProps = {
  filters: FilterOptions;
  setFilters: (filters: FilterOptions) => void;
  sort: SortOptions;
  setSort: (sort: SortOptions) => void;
  availableGenres: string[];
  onReset: () => void;
};

export default function FilterSortControls({
  filters,
  setFilters,
  sort,
  setSort,
  availableGenres,
  onReset,
}: FilterSortControlsProps) {
  const [showFilters, setShowFilters] = useState(false);

  const sortOptions = [
    { value: 'title', label: 'Título' },
    { value: 'author', label: 'Autor' },
    { value: 'year', label: 'Ano' },
    { value: 'rating', label: 'Avaliação' },
    { value: 'pages', label: 'Páginas' },
  ];

  const statusOptions = [
    { value: '', label: 'Todos os status' },
    { value: 'lido', label: 'Lido' },
    { value: 'lendo', label: 'Lendo' },
    { value: 'quero ler', label: 'Quero ler' },
    { value: 'sem status', label: 'Sem status' },
  ];

  const ratingOptions = [
    { value: '', label: 'Todas as avaliações' },
    { value: '5', label: '5 estrelas' },
    { value: '4', label: '4+ estrelas' },
    { value: '3', label: '3+ estrelas' },
    { value: '2', label: '2+ estrelas' },
    { value: '1', label: '1+ estrelas' },
  ];

  const hasActiveFilters = filters.genre || filters.status || filters.rating;

  return (
    <div className="bg-gray-800 rounded-lg p-4 mb-6 border border-gray-700">
      <div className="flex flex-wrap items-center gap-4 justify-between">
        {/* Botão de Filtros */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
            showFilters || hasActiveFilters
              ? 'bg-blue-600 text-white'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          <Filter className="h-4 w-4" />
          Filtros
          {hasActiveFilters && (
            <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
              {[filters.genre, filters.status, filters.rating].filter(Boolean).length}
            </span>
          )}
          <ChevronDown className={`h-4 w-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
        </button>

        {/* Controles de Ordenação */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-400">Ordenar por:</span>
          <select
            value={sort.field}
            onChange={(e) => setSort({ ...sort, field: e.target.value as SortOptions['field'] })}
            className="bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {sortOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <button
            onClick={() => setSort({ ...sort, direction: sort.direction === 'asc' ? 'desc' : 'asc' })}
            className="p-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors"
            title={sort.direction === 'asc' ? 'Crescente' : 'Decrescente'}
          >
            {sort.direction === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
          </button>
        </div>

        {/* Botão Reset */}
        {hasActiveFilters && (
          <button
            onClick={onReset}
            className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Limpar Filtros
          </button>
        )}
      </div>

      {/* Painel de Filtros Expandido */}
      {showFilters && (
        <div className="mt-4 pt-4 border-t border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Filtro por Gênero */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Gênero
              </label>
              <select
                value={filters.genre}
                onChange={(e) => setFilters({ ...filters, genre: e.target.value })}
                className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Todos os gêneros</option>
                {availableGenres.map(genre => (
                  <option key={genre} value={genre}>
                    {genre}
                  </option>
                ))}
              </select>
            </div>

            {/* Filtro por Status */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Status de Leitura
              </label>
              <select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {statusOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Filtro por Avaliação */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Avaliação Mínima
              </label>
              <select
                value={filters.rating}
                onChange={(e) => setFilters({ ...filters, rating: e.target.value })}
                className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {ratingOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

