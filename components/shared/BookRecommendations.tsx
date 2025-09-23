"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Star, ArrowRight, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { mockBooks } from "@/data/mockBooks";
import { Book } from "@/lib/types";

interface BookRecommendationsProps {
  currentBook: Book;
  className?: string;
}

export default function BookRecommendations({ 
  currentBook, 
  className = "" 
}: BookRecommendationsProps) {
  const [recommendations, setRecommendations] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simular carregamento de recomendações
    const timer = setTimeout(() => {
      const recs = generateRecommendations(currentBook);
      setRecommendations(recs);
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [currentBook]);

  const generateRecommendations = (book: Book): Book[] => {
    // Algoritmo simples de recomendação baseado em:
    // 1. Mesmo gênero
    // 2. Mesmo autor
    // 3. Avaliação similar
    // 4. Ano de publicação próximo

    const otherBooks = mockBooks.filter(b => b.id !== book.id);
    
    const scored = otherBooks.map(otherBook => {
      let score = 0;
      
      // Mesmo gênero (+3 pontos)
      if (otherBook.genre === book.genre) {
        score += 3;
      }
      
      // Mesmo autor (+5 pontos)
      if (otherBook.author === book.author) {
        score += 5;
      }
      
      // Avaliação similar (+2 pontos se diferença <= 1)
      if (book.rating && otherBook.rating) {
        const ratingDiff = Math.abs(book.rating - otherBook.rating);
        if (ratingDiff <= 1) {
          score += 2;
        }
      }
      
      // Ano próximo (+1 ponto se diferença <= 10 anos)
      if (book.year && otherBook.year) {
        const yearDiff = Math.abs(book.year - otherBook.year);
        if (yearDiff <= 10) {
          score += 1;
        }
      }
      
      // Livros com avaliação alta (+1 ponto)
      if (otherBook.rating && otherBook.rating >= 4) {
        score += 1;
      }

      return { book: otherBook, score };
    });

    // Ordenar por score e pegar os top 4
    return scored
      .sort((a, b) => b.score - a.score)
      .slice(0, 4)
      .map(item => item.book);
  };

  const getRecommendationReason = (recommendedBook: Book): string => {
    const reasons = [];
    
    if (recommendedBook.genre === currentBook.genre) {
      reasons.push(`Mesmo gênero: ${recommendedBook.genre}`);
    }
    
    if (recommendedBook.author === currentBook.author) {
      reasons.push(`Mesmo autor`);
    }
    
    if (recommendedBook.rating && recommendedBook.rating >= 4) {
      reasons.push(`Bem avaliado (${recommendedBook.rating}★)`);
    }
    
    if (currentBook.year && recommendedBook.year) {
      const yearDiff = Math.abs(currentBook.year - recommendedBook.year);
      if (yearDiff <= 5) {
        reasons.push(`Época similar`);
      }
    }

    return reasons.length > 0 
      ? reasons.slice(0, 2).join(' • ') 
      : 'Recomendado para você';
  };

  if (isLoading) {
    return (
      <div className={`bg-gray-800 rounded-lg p-6 ${className}`}>
        <div className="flex items-center gap-2 mb-6">
          <Sparkles className="h-5 w-5 text-purple-400" />
          <h3 className="text-lg font-semibold text-white">Recomendações</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-700 rounded-lg h-32"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (recommendations.length === 0) {
    return (
      <div className={`bg-gray-800 rounded-lg p-6 ${className}`}>
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="h-5 w-5 text-purple-400" />
          <h3 className="text-lg font-semibold text-white">Recomendações</h3>
        </div>
        <p className="text-gray-400 text-center py-8">
          Não encontramos recomendações similares no momento.
        </p>
      </div>
    );
  }

  return (
    <div className={`bg-gray-800 rounded-lg p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-purple-400" />
          <h3 className="text-lg font-semibold text-white">
            Se você gostou deste, pode gostar de...
          </h3>
        </div>
        <Link 
          href="/biblioteca"
          className="text-sm text-purple-400 hover:text-purple-300 flex items-center gap-1 transition-colors"
        >
          Ver todos
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {recommendations.map((book, index) => (
          <motion.div
            key={book.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Link href={`/livro/${book.id}`}>
              <div className="bg-gray-700 rounded-lg p-4 hover:bg-gray-600 transition-colors group">
                <div className="flex gap-3">
                  <div className="relative w-16 h-24 flex-shrink-0">
                    <Image
                      src={book.coverUrl}
                      alt={`Capa de ${book.title}`}
                      fill
                      className="object-cover rounded"
                    />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-white text-sm line-clamp-2 group-hover:text-purple-300 transition-colors">
                      {book.title}
                    </h4>
                    <p className="text-gray-400 text-xs mt-1">
                      {book.author}
                    </p>
                    
                    {book.rating && (
                      <div className="flex items-center gap-1 mt-2">
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`h-3 w-3 ${
                                star <= book.rating!
                                  ? 'text-yellow-400 fill-yellow-400'
                                  : 'text-gray-500'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-xs text-gray-400">
                          ({book.rating})
                        </span>
                      </div>
                    )}
                    
                    <div className="mt-2">
                      <span className="text-xs text-purple-400 bg-purple-900/30 px-2 py-1 rounded">
                        {getRecommendationReason(book)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      <div className="mt-4 text-center">
        <p className="text-xs text-gray-500">
          Recomendações baseadas em gênero, autor, avaliação e período de publicação
        </p>
      </div>
    </div>
  );
}

