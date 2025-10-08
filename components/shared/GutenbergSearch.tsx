"use client";

import React, { useState, useEffect } from "react";
import { Search, Book } from "lucide-react";

// 1. ATUALIZADA: Interface para os resultados do Google Books
interface GoogleBookItem {
  id: string;
  volumeInfo: {
    title: string;
    authors?: string[];
    description?: string;
    publishedDate?: string;
    categories?: string[];
    imageLinks?: {
      thumbnail?: string;
    };
  };
}

interface BaixeLivrosBook {
  title: string;
  author: string;
  description?: string;
  category?: string;
  year?: string;
  coverUrl?: string;
}
interface SearchProps {
  onBookSelect: (bookData: {
    titulo: string;
    autor: string;
    genero: string;
    ano: string;
    sinopse: string;
    urlCapa: string;
  }) => void;
}

export default function GutenbergSearch({ onBookSelect }: SearchProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState("");
  
  // Estado unificado para os resultados
  const [results, setResults] = useState<any[]>([]);
  
  const [selectedSource, setSelectedSource] = useState<'google' | 'baixelivros'>('google');
  
  useEffect(() => {
    if (searchTerm.trim().length < 3) {
      setResults([]);
      return;
    }
    const debounceTimer = setTimeout(() => handleSearch(), 500);
    return () => clearTimeout(debounceTimer);
  }, [searchTerm, selectedSource]);

  const handleSearch = () => {
    selectedSource === 'google' ? searchGoogleBooks() : searchBaixeLivrosBooks();
  };
  
  const searchGoogleBooks = async () => {
    setIsSearching(true);
    setError("");
    try {
      const response = await fetch(`/api/book-search?q=${encodeURIComponent(searchTerm)}`);
      if (!response.ok) throw new Error("API Error");
      const data = await response.json();
      
      // 2. ATUALIZADO: A resposta do Google vem em 'data.items'
      setResults(data.items || []);
    } catch (err) {
      setError("Erro ao buscar livros. Tente novamente.");
    } finally {
      setIsSearching(false);
    }
  };
  
  const searchBaixeLivrosBooks = () => { /* Sua lógica para busca em PT */ };

  const selectBook = (item: any) => {
    const bookInfo = item.volumeInfo;
    
    // 3. ATUALIZADO: Extrai os dados do formato do Google Books
    onBookSelect({
      titulo: bookInfo.title || "Título desconhecido",
      autor: bookInfo.authors?.[0] || "Autor desconhecido",
      genero: bookInfo.categories?.[0] || "Gênero desconhecido",
      ano: bookInfo.publishedDate?.substring(0, 4) || "",
      sinopse: bookInfo.description || "",
      urlCapa: bookInfo.imageLinks?.thumbnail?.replace('http:', 'https:') || "",
    });

    setSearchTerm("");
    setResults([]);
  };

  return (
    <div className="mb-6 p-4 bg-slate-800/50 rounded-lg border border-slate-700">
      <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
        <Book size={20} /> Pesquisar Livros
      </h3>
      <div className="flex gap-2 mb-4">
        {/* Adapte os botões de fonte se desejar manter a busca em PT */}
        <button onClick={() => setSelectedSource('google')} className={`px-3 py-1 text-sm rounded-md ${selectedSource === 'google' ? 'bg-blue-600 text-white' : 'bg-slate-700'}`}>Google Books</button>
        {/* <button onClick={() => setSelectedSource('baixelivros')} ... >🇧🇷 Baixe Livros</button> */}
      </div>
      <div className="flex gap-2 relative">
        <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Digite o título ou autor (mín. 3 letras)..."
          className="w-full pl-10 pr-4 py-2 border border-slate-600 rounded-lg bg-slate-800 text-white"
        />
      </div>
      {error && <p className="text-red-500 mt-2 text-sm">{error}</p>}
      
      {results.length > 0 && (
        <div className="mt-4 max-h-60 overflow-y-auto bg-slate-900 rounded-md border border-slate-700">
          {results.map((item: GoogleBookItem) => (
            <div key={item.id} onClick={() => selectBook(item)} className="p-3 hover:bg-slate-800 cursor-pointer border-b border-slate-800">
              <p className="font-semibold text-white">{item.volumeInfo.title}</p>
              <p className="text-sm text-slate-400">por {item.volumeInfo.authors?.join(', ') || 'Autor desconhecido'}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}