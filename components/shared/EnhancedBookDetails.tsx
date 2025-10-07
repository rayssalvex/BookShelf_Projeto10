"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Edit, Trash2, Share2, Bookmark, BookOpen, Calendar, FileText } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Prisma } from '@prisma/client';
import { useAuth } from "@/contexts/AuthContext";
import InteractiveRating from "./InteractiveRating";
import ReadingTimeline from "./ReadingTimeline";
import BookRecommendations from "./BookRecommendations";
import { Console } from "console";

type BookWithGenre = Prisma.BookGetPayload<{ include: { genre: true } }>;
type Genre = { id: string; name: string; };

interface EnhancedBookDetailsProps {
  book: BookWithGenre;
}

export default function EnhancedBookDetails({ book }: EnhancedBookDetailsProps) {
  const { user, updateUserBooks } = useAuth();

  const [currentRating, setCurrentRating] = useState(book.rating || 0);
  const [readingStatus, setReadingStatus] = useState(book.status);
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  
  const [allGenres, setAllGenres] = useState<Genre[]>([]);
  
  // Estaado para guardar a lista de todos sos gêneros
  const [editedBook, setEditedBook] = useState({
    title : book.title,
    author : book.author,
    genreId : book.genre.id,
    year : book.year || 0,
    pages : book.pages || 0,
    synopsis : book.synopsis || ''
  });

  // useEffect para buscar os gênros da API quando o modal da edição abre
  useEffect(() => {
    // Apenas executa se o modal estiver abrindo
    if (isEditing) {
      // Reinicia o estado do formulário com os dados mais recentes do livro
      setEditedBook({
        title: book.title,
        author: book.author,
        genreId: book.genre.id,
        year: book.year || 0,
        pages: book.pages || 0,
        synopsis: book.synopsis || ''
      });

      // Busca a lista de gêneros
      async function fetchGenres() {
        try {
          const response = await fetch('/api/categories');
          if (response.ok) {
            const data = await response.json();
            setAllGenres(data);

            console.log("Gêneros recebidos da API:", data);
          }
        } catch (error) {
          console.error("Failed to fetch genres:", error);
        }
      }
      fetchGenres();

      console.log("ID do Gênero no estado do formulário", book.genre.id);
    }
  }, [isEditing, book]); // Roda sempre que 'isEditing' ou o 'book' mudar


  const handleRatingChange = (newRating: number) => {
    setCurrentRating(newRating);
    // Lógica futura para salvar a avaliação
  };

  const handleStatusChange = (newStatus: any) => {
    setReadingStatus(newStatus);
    // Lógica futura para salvar o status com Server Action
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
  // função para salvar o livro
  const handleSaveEdit = async () => {
  if (!user) return;
  setSaveLoading(true);

  try {
    // 1. GARANTE QUE TODOS OS CAMPOS, INCLUINDO genreId, ESTÃO NO PAYLOAD
    // E QUE OS TIPOS NUMÉRICOS ESTÃO CORRETOS
    const payload = {
      title: editedBook.title,
      author: editedBook.author,
      synopsis: editedBook.synopsis,
      genreId: editedBook.genreId, // <-- Adicionado o genreId ao payload
      year: parseInt(String(editedBook.year), 10),
      pages: parseInt(String(editedBook.pages), 10),
    };

    // 2. CORREÇÃO DA SINTAXE DA URL com crase (`)
    const response = await fetch(`/api/books/${book.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      setIsEditing(false);
      window.location.reload();
    } else {
      const errorData = await response.json().catch(() => ({ message: "A API retornou um erro sem corpo JSON." }));
      console.error("API Error:", errorData);
      throw new Error(errorData.message || 'API error on update');
    }
  } catch (error) {
    console.error('Erro ao atualizar livro:', error);
    alert('Erro ao atualizar livro. Tente novamente.');
  } finally {
    setSaveLoading(false);
  }
};

  const handleCancelEdit = () => {
    setEditedBook({
      title: book.title,
      author: book.author,
      genreId: book.genre.id,
      year: book.year || 0,
      pages: book.pages || 0,
      synopsis: book.synopsis || ''
    });
    setIsEditing(false);
  };

  const handleInputChange = (field: string, value: string | number) => {
    setEditedBook(prev => ({ ...prev, [field]: value }));
  };

  const handleDeleteBook = async () => {
    if (!user) return;
    
    setDeleteLoading(true);
    
    try {
      // Chamar API para deletar o livro
      const response = await fetch(`/api/books/${book.id}?userId=${user.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Sucesso na API - atualizar estado
        const updatedBooks = user.books.filter(b => b.id !== book.id);
        const updatedUser = { ...user, books: updatedBooks };
        
        // Atualizar localStorage
        localStorage.setItem('bookshelf-user-v2', JSON.stringify(updatedUser));
        
        // Atualizar o contexto de autenticação
        if (updateUserBooks) {
          updateUserBooks(updatedBooks);
        }
        
        setShowDeleteConfirm(false);
        
        // Aguardar um momento para o contexto ser atualizado e usar navegação forçada
        setTimeout(() => {
          window.location.href = '/biblioteca';
        }, 100);
      } else if (response.status === 404) {
        // Livro não encontrado na API, mas existe no localStorage
        // Isto pode acontecer com livros adicionados recentemente
        // Vamos fazer a exclusão apenas no localStorage
        console.warn('Livro não encontrado na API, removendo apenas do localStorage');
        
        const updatedBooks = user.books.filter(b => b.id !== book.id);
        const updatedUser = { ...user, books: updatedBooks };
        
        // Atualizar localStorage
        localStorage.setItem('bookshelf-user-v2', JSON.stringify(updatedUser));
        
        // Atualizar o contexto de autenticação
        if (updateUserBooks) {
          updateUserBooks(updatedBooks);
        }
        
        setShowDeleteConfirm(false);
        
        // Aguardar um momento para o contexto ser atualizado e usar navegação forçada
        setTimeout(() => {
          window.location.href = '/biblioteca';
        }, 100);
      } else {
        const errorData = await response.json().catch(() => ({ message: 'Erro desconhecido' }));
        console.error('Erro da API:', errorData);
        throw new Error(errorData.message || 'Erro na API');
      }
      
    } catch (error) {
      console.error('Erro ao excluir livro:', error);
      alert('Erro ao excluir livro. Tente novamente.');
    } finally {
      setDeleteLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
  case "lido": return "bg-[var(--primary)] hover:bg-blue-700";
  case "lendo": return "bg-green-600 hover:bg-green-700";
  case "quero ler": return "bg-yellow-600 hover:bg-yellow-700";
  case "pausado": return "bg-orange-600 hover:bg-orange-700";
  case "abandonado": return "bg-red-600 hover:bg-red-700";
  default: return "bg-[var(--card-bg)] hover:bg-[var(--border)]";
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
    <div className="min-h-screen bg-[var(--background)]">
        {/* Header com navegação */}
        <div className="bg-[var(--card-bg)] border-b border-[var(--border)]">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <Link 
                href="/biblioteca"
                className="flex items-center gap-2 text-[var(--secondary-text)] hover:text-[var(--foreground)] transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                Voltar à biblioteca
              </Link>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={handleShare}
                  className="p-2 text-[var(--secondary-text)] hover:text-[var(--foreground)] transition-colors"
                  title="Compartilhar"
                >
                  <Share2 className="h-4 w-4" />
                </button>
                
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 px-3 py-2 bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-[var(--foreground)] rounded-lg transition-colors"
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
                <div className="bg-[var(--card-bg)] rounded-lg p-4 mb-6">
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
                    bookId={book.id}
                    initialRating={currentRating}
                    onRatingChange={handleRatingChange}
                    size="md"
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
                      <span className="text-sm">{book.genre.name}</span>
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
                    <h3 className="text-lg font-semibold text-[var(--foreground)] mb-3 flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Sinopse
                    </h3>
                    <p className="text-[var(--secondary-text)] leading-relaxed">{book.synopsis}</p>
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
                <BookRecommendations currentBookId={book.id} />
              </motion.div>
            </div>
          </div>
        </div>

        {/* Modal de Edição */}
        {isEditing && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={handleCancelEdit}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-[var(--background)] rounded-2xl shadow-xl max-w-2xl w-full" onClick={(e) => e.stopPropagation()}>
              <div className="p-6 border-b border-[var(--border)]"><h3 className="text-2xl font-bold">Editar Livro</h3></div>
              <div className="p-6 overflow-y-auto max-h-[70vh]">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Título */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Título *</label>
                    <input type="text" value={editedBook.title} onChange={(e) => handleInputChange('title', e.target.value)} className="w-full px-4 py-3 bg-[var(--card-bg)] border border-[var(--border)] rounded-lg" required />
                  </div>

                  {/* Autor */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Autor *</label>
                    <input type="text" value={editedBook.author} onChange={(e) => handleInputChange('author', e.target.value)} className="w-full px-4 py-3 bg-[var(--card-bg)] border border-[var(--border)] rounded-lg" required />
                  </div>

                  {/* GÊNERO (CORRIGIDO PARA DROPDOWN) */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Gênero</label>
                    <select
                      value={editedBook.genreId}
                      onChange={(e) => handleInputChange('genreId', e.target.value)}
                      className="w-full px-4 py-3 bg-[var(--card-bg)] border border-[var(--border)] rounded-lg"
                    >
                      <option value="">Selecione um gênero</option>
                      {allGenres.map((genre) => (
                        <option key={genre.id} value={genre.id}>
                          {genre.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Ano */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Ano</label>
                    <input type="number" value={editedBook.year} onChange={(e) => handleInputChange('year', parseInt(e.target.value))} className="w-full px-4 py-3 bg-[var(--card-bg)] border border-[var(--border)] rounded-lg" />
                  </div>

                  {/* Páginas */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Páginas</label>
                    <input type="number" value={editedBook.pages} onChange={(e) => handleInputChange('pages', parseInt(e.target.value))} className="w-full px-4 py-3 bg-[var(--card-bg)] border border-[var(--border)] rounded-lg" />
                  </div>
                  
                  {/* Sinopse */}
                  <div className="md:col-span-2">
                      <label className="block text-sm font-medium mb-2">Sinopse</label>
                      <textarea value={editedBook.synopsis} onChange={(e) => handleInputChange('synopsis', e.target.value)} rows={4} className="w-full px-4 py-3 bg-[var(--card-bg)] border border-[var(--border)] rounded-lg resize-none" />
                  </div>

                </div>
              </div>
              
              <div className="p-6 border-t border-[var(--border)] flex gap-3 justify-end">
                <button onClick={handleCancelEdit} className="px-6 py-3 bg-[var(--card-bg)] rounded-lg hover:bg-[var(--border)] font-medium border border-[var(--border)]">Cancelar</button>
                <button onClick={handleSaveEdit} disabled={saveLoading} className="px-6 py-3 bg-[var(--primary)] rounded-lg hover:bg-[var(--primary-hover)] font-medium disabled:opacity-50">
                  {saveLoading ? 'Salvando...' : 'Salvar Alterações'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
    </div>
  );
}