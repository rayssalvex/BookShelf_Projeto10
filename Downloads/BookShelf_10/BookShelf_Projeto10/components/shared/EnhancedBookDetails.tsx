"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Edit, Trash2, Share2, Bookmark, BookOpen, Calendar, User, Hash, FileText } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Book } from "@/lib/types";
import InteractiveRating from "./InteractiveRating";
import ReadingTimeline from "./ReadingTimeline";
import BookRecommendations from "./BookRecommendations";

interface EnhancedBookDetailsProps {
  book: Book;
}

export default function EnhancedBookDetails({ book }: EnhancedBookDetailsProps) {
  const [currentRating, setCurrentRating] = useState(book.rating || 0);
  const [readingStatus, setReadingStatus] = useState<string>("");
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    // Carregar status de leitura do localStorage
    try {
      const savedStatus = localStorage.getItem("bookStatus");
      if (savedStatus) {
        const statusData = JSON.parse(savedStatus);
        setReadingStatus(statusData[book.id] || "");
      }
    } catch (e) {
      console.error("Erro ao carregar status:", e);
    }
  }, [book.id]);

  const handleRatingChange = (newRating: number) => {
    setCurrentRating(newRating);
    
    console.log(`Nova avaliação para ${book.title}: ${newRating} estrelas`);
  };

  const handleStatusChange = (newStatus: string) => {
    setReadingStatus(newStatus);
    
    // Salvar no localStorage
    try {
      const savedStatus = localStorage.getItem("bookStatus");
      const statusData = savedStatus ? JSON.parse(savedStatus) : {};
      statusData[book.id] = newStatus;
      localStorage.setItem("bookStatus", JSON.stringify(statusData));
    } catch (e) {
      console.error("Erro ao salvar status:", e);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: book.title,
          text: `Confira este livro: ${book.title} por ${book.author}`,
          url: window.location.href,
        });
      } catch (err) {
        console.log("Erro ao compartilhar:", err);
      }
    } else {
      // Fallback: copiar URL para clipboard
      navigator.clipboard.writeText(window.location.href);
      alert("Link copiado para a área de transferência!");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "lido": return "bg-blue-600 hover:bg-blue-700";
      case "lendo": return "bg-green-600 hover:bg-green-700";
      case "quero ler": return "bg-yellow-600 hover:bg-yellow-700";
      case "pausado": return "bg-orange-600 hover:bg-orange-700";
      case "abandonado": return "bg-red-600 hover:bg-red-700";
      default: return "bg-gray-600 hover:bg-gray-700";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "lido": return "✅";
      case "lendo": return "📖";
      case "quero ler": return "📚";
      case "pausado": return "⏸️";
      case "abandonado": return "❌";
      default: return "📖";
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header com navegação */}
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link 
              href="/biblioteca"
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar à biblioteca
            </Link>
            
            <div className="flex items-center gap-2">
              <button
                onClick={handleShare}
                className="p-2 text-gray-400 hover:text-white transition-colors"
                title="Compartilhar"
              >
                <Share2 className="h-4 w-4" />
              </button>
              
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
              >
                <Edit className="h-4 w-4" />
                Editar
              </button>
              
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="p-2 text-red-400 hover:text-red-300 transition-colors"
                title="Excluir livro"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Coluna da Esquerda - Capa e Ações */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="sticky top-8"
            >
              {/* Capa do Livro */}
              <div className="relative mb-6">
                <div className="relative w-full aspect-[2/3] max-w-sm mx-auto">
                  <Image
                    src={book.coverUrl}
                    alt={`Capa de ${book.title}`}
                    fill
                    className="object-cover rounded-lg shadow-2xl"
                  />
                  {readingStatus && (
                    <div className={`absolute top-4 right-4 px-2 py-1 rounded-full text-xs font-medium text-white ${getStatusColor(readingStatus)}`}>
                      {getStatusIcon(readingStatus)} {readingStatus}
                    </div>
                  )}
                </div>
              </div>

              {/* Status de Leitura */}
              <div className="bg-gray-800 rounded-lg p-4 mb-6">
                <h3 className="text-sm font-medium text-gray-300 mb-3">Status de Leitura</h3>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { key: "quero ler", label: "Quero Ler" },
                    { key: "lendo", label: "Lendo" },
                    { key: "lido", label: "Lido" },
                    { key: "pausado", label: "Pausado" },
                  ].map((status) => (
                    <button
                      key={status.key}
                      onClick={() => handleStatusChange(status.key)}
                      className={`px-3 py-2 text-xs rounded-lg transition-colors ${
                        readingStatus === status.key
                          ? getStatusColor(status.key)
                          : "bg-gray-700 hover:bg-gray-600 text-gray-300"
                      }`}
                    >
                      {getStatusIcon(status.key)} {status.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Avaliação */}
              <div className="bg-gray-800 rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-300 mb-3">Sua Avaliação</h3>
                <InteractiveRating
                  initialRating={currentRating}
                  onRatingChange={handleRatingChange}
                  size={28}
                />
              </div>
            </motion.div>
          </div>

          {/* Coluna da Direita - Informações e Conteúdo */}
          <div className="lg:col-span-2 space-y-8">
            {/* Informações Principais */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="bg-gray-800 rounded-lg p-6"
            >
              <h1 className="text-3xl font-bold text-white mb-2">{book.title}</h1>
              <h2 className="text-xl text-gray-300 mb-4">{book.author}</h2>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {book.year && (
                  <div className="flex items-center gap-2 text-gray-400">
                    <Calendar className="h-4 w-4" />
                    <span className="text-sm">{book.year}</span>
                  </div>
                )}
                
                {book.genre && (
                  <div className="flex items-center gap-2 text-gray-400">
                    <Bookmark className="h-4 w-4" />
                    <span className="text-sm">{book.genre}</span>
                  </div>
                )}
                
                {book.pages && (
                  <div className="flex items-center gap-2 text-gray-400">
                    <BookOpen className="h-4 w-4" />
                    <span className="text-sm">{book.pages} páginas</span>
                  </div>
                )}
                
                {book.rating && (
                  <div className="flex items-center gap-2 text-gray-400">
                    <span className="text-sm">Avaliação: {book.rating}/5</span>
                  </div>
                )}
              </div>

              {/* Sinopse */}
              {book.synopsis && (
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Sinopse
                  </h3>
                  <p className="text-gray-300 leading-relaxed">{book.synopsis}</p>
                </div>
              )}
            </motion.div>

            {/* Timeline de Leitura */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <ReadingTimeline 
                bookId={book.id} 
                bookTitle={book.title}
              />
            </motion.div>

            {/* Recomendações */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
            >
              <BookRecommendations currentBook={book} />
            </motion.div>
          </div>
        </div>
      </div>

      {/* Modal de Confirmação de Exclusão */}
      {showDeleteConfirm && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowDeleteConfirm(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-gray-800 rounded-lg p-6 max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold text-white mb-4">
              Confirmar Exclusão
            </h3>
            <p className="text-gray-300 mb-6">
              Tem certeza que deseja excluir "{book.title}" da sua biblioteca? 
              Esta ação não pode ser desfeita.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  
                  console.log(`Excluindo livro: ${book.title}`);
                  setShowDeleteConfirm(false);
                }}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
              >
                Excluir
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}

