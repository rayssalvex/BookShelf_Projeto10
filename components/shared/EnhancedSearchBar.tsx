"use client";

import { Dispatch, SetStateAction } from "react";
import { Search, X } from "lucide-react";

type EnhancedSearchBarProps = {
  searchTerm: string;
  setSearchTerm: Dispatch<SetStateAction<string>>;
  placeholder?: string;
};

export default function EnhancedSearchBar({
  searchTerm,
  setSearchTerm,
  placeholder = "Buscar por título, autor, gênero, ano...",
}: EnhancedSearchBarProps) {
  const clearSearch = () => {
    setSearchTerm("");
  };

  return (
    <div className="relative w-full md:w-80">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <input
          type="text"
          placeholder={placeholder}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-10 py-3 bg-white border border-gray-300 rounded-lg text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm hover:shadow-md"
        />
        {searchTerm && (
          <button
            onClick={clearSearch}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Limpar busca"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
      {searchTerm && (
        <div className="absolute top-full left-0 right-0 mt-1 text-xs text-gray-500 bg-white px-3 py-1 rounded-md shadow-sm border">
          Buscando por: <span className="font-medium text-blue-600">"{searchTerm}"</span>
        </div>
      )}
    </div>
  );
}

// Função utilitária para destacar termos de busca
export function highlightSearchTerm(text: string, searchTerm: string): JSX.Element {
  if (!searchTerm.trim()) {
    return <span>{text}</span>;
  }

  const regex = new RegExp(`(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  const parts = text.split(regex);

  return (
    <span>
      {parts.map((part, index) => 
        regex.test(part) ? (
          <mark key={index} className="bg-yellow-200 text-yellow-800 px-1 rounded">
            {part}
          </mark>
        ) : (
          <span key={index}>{part}</span>
        )
      )}
    </span>
  );
}

