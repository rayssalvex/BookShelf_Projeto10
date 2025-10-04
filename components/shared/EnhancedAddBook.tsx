"use client";

import React, { useState, useEffect } from "react";
import { Star, Save, RotateCcw, CheckCircle, AlertCircle } from "lucide-react";
import ImageUpload from "./ImageUpload";
import GenreAutocomplete from "./GenreAutocomplete";
import { mockBooks } from "@/data/mockBooks";

type ReadingStatus = "" | "lido" | "lendo" | "quero ler" | "pausado" | "abandonado";

interface FormData {
  titulo: string;
  autor: string;
  paginas: string;
  paginaAtual: string;
  status: ReadingStatus;
  isbn: string;
  urlCapa: string;
  genero: string;
  estrelas: number;
  notas: string;
  ano: string;
  sinopse: string;
}

type FormErrors = Partial<Record<keyof FormData, string>>;

interface FieldValidation {
  isValid: boolean;
  message?: string;
}

export default function EnhancedAddBook() {
  const [formData, setFormData] = useState<FormData>({
    titulo: "",
    autor: "",
    paginas: "",
    paginaAtual: "",
    status: "",
    isbn: "",
    urlCapa: "",
    genero: "",
    estrelas: 0,
    notas: "",
    ano: "",
    sinopse: "",
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [mensagem, setMensagem] = useState<string>("");
  const [erros, setErros] = useState<FormErrors>({});
  const [fieldValidations, setFieldValidations] = useState<Record<keyof FormData, FieldValidation>>({} as any);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Gêneros existentes para auto-sugestão
  const existingGenres = Array.from(
    new Set(mockBooks.map(book => book.genre).filter(Boolean))
  ).sort();

  // Validação em tempo real
  useEffect(() => {
    const validations: Record<keyof FormData, FieldValidation> = {} as any;

    // Título
    validations.titulo = {
      isValid: formData.titulo.trim().length >= 2,
      message: formData.titulo.trim().length === 0 ? "Título é obrigatório" : 
               formData.titulo.trim().length < 2 ? "Título deve ter pelo menos 2 caracteres" : undefined
    };

    // Autor
    validations.autor = {
      isValid: formData.autor.trim().length >= 2,
      message: formData.autor.trim().length === 0 ? "Autor é obrigatório" : 
               formData.autor.trim().length < 2 ? "Nome do autor deve ter pelo menos 2 caracteres" : undefined
    };

    // Páginas
    const paginasNum = Number(formData.paginas);
    validations.paginas = {
      isValid: !formData.paginas || (paginasNum > 0 && paginasNum <= 10000),
      message: formData.paginas && (isNaN(paginasNum) || paginasNum <= 0) ? "Número de páginas inválido" :
               paginasNum > 10000 ? "Número de páginas muito alto" : undefined
    };

    // Página atual
    const paginaAtualNum = Number(formData.paginaAtual);
    validations.paginaAtual = {
      isValid: !formData.paginaAtual || (paginaAtualNum >= 0 && (!formData.paginas || paginaAtualNum <= paginasNum)),
      message: formData.paginaAtual && isNaN(paginaAtualNum) ? "Página atual inválida" :
               paginaAtualNum > paginasNum && formData.paginas ? "Página atual não pode ser maior que o total" : undefined
    };

    // Ano
    const anoNum = Number(formData.ano);
    const currentYear = new Date().getFullYear();
    validations.ano = {
      isValid: !formData.ano || (anoNum >= 1000 && anoNum <= currentYear),
      message: formData.ano && (isNaN(anoNum) || anoNum < 1000) ? "Ano inválido" :
               anoNum > currentYear ? "Ano não pode ser futuro" : undefined
    };

    // ISBN (validação básica)
    validations.isbn = {
      isValid: !formData.isbn || /^[\d\-X]{10,17}$/.test(formData.isbn.replace(/\s/g, '')),
      message: formData.isbn && !/^[\d\-X]{10,17}$/.test(formData.isbn.replace(/\s/g, '')) ? "Formato de ISBN inválido" : undefined
    };

    // URL da capa
    const isValidUrl = (s: string) => {
      try {
        new URL(s);
        return true;
      } catch {
        return false;
      }
    };

    validations.urlCapa = {
      isValid: !formData.urlCapa || isValidUrl(formData.urlCapa),
      message: formData.urlCapa && !isValidUrl(formData.urlCapa) ? "URL inválida" : undefined
    };

    // Outros campos sempre válidos
    validations.genero = { isValid: true };
    validations.estrelas = { isValid: true };
    validations.notas = { isValid: true };
    validations.sinopse = { isValid: true };
    validations.status = { isValid: true };

    setFieldValidations(validations);
  }, [formData]);

  // Barra de progresso dinâmica
  const calculateProgress = () => {
    const requiredFields = ['titulo', 'autor'];
    const optionalFields = ['paginas', 'genero', 'estrelas', 'urlCapa', 'status', 'ano'];
    
    let filledRequired = 0;
    let filledOptional = 0;

    requiredFields.forEach(field => {
      if (formData[field as keyof FormData] && fieldValidations[field as keyof FormData]?.isValid) {
        filledRequired++;
      }
    });

    optionalFields.forEach(field => {
      if (formData[field as keyof FormData] && fieldValidations[field as keyof FormData]?.isValid) {
        filledOptional++;
      }
    });

    const requiredProgress = (filledRequired / requiredFields.length) * 60; // 60% para campos obrigatórios
    const optionalProgress = (filledOptional / optionalFields.length) * 40; // 40% para campos opcionais

    return Math.round(requiredProgress + optionalProgress);
  };

  const progress = calculateProgress();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const name = e.target.name as keyof FormData;
    const rawValue = e.target.value;
    const value: FormData[typeof name] =
      name === "estrelas"
        ? (Number(rawValue) as unknown as FormData[typeof name])
        : (rawValue as unknown as FormData[typeof name]);

    setFormData((prev) => ({ ...prev, [name]: value } as FormData));
  };

  const handleImageSelect = (file: File | null, previewUrl: string) => {
    setSelectedFile(file);
    setFormData(prev => ({ ...prev, urlCapa: previewUrl }));
  };

  const handleStarClick = (rating: number) => {
    setFormData(prev => ({ ...prev, estrelas: rating }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Verificar se campos obrigatórios são válidos
    const requiredFieldsValid = fieldValidations.titulo?.isValid && fieldValidations.autor?.isValid;
    if (!requiredFieldsValid) {
      setMensagem("❌ Por favor, corrija os erros nos campos obrigatórios.");
      return;
    }
    setIsSubmitting(true);
    setMensagem("");
    try {
      let finalImageUrl = formData.urlCapa;
      if (selectedFile) {
        // Upload real de imagem (futuro)
        console.log("Arquivo para upload:", selectedFile);
      }
      // Monta payload para API
      const payload = {
        title: formData.titulo,
        author: formData.autor,
        year: formData.ano ? Number(formData.ano) : undefined,
        pages: formData.paginas ? Number(formData.paginas) : undefined,
        currentPage: formData.paginaAtual ? Number(formData.paginaAtual) : 0,
        status: formData.status || "QUERO_LER",
        isbn: formData.isbn || null,
        notes: formData.notas || null,
        coverUrl: finalImageUrl,
        genre: formData.genero,
        rating: formData.estrelas ? Number(formData.estrelas) : 0,
        synopsis: formData.sinopse || "",
      };
      // Chama API para salvar
      const res = await fetch("/api/books", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        setMensagem("✅ Livro adicionado com sucesso!");
        setTimeout(() => {
          handleReset();
        }, 2000);
      } else {
        setMensagem("❌ Erro ao adicionar livro.");
      }
    } catch (error) {
      setMensagem("❌ Erro ao adicionar livro. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData({
      titulo: "",
      autor: "",
      paginas: "",
      paginaAtual: "",
      status: "",
      isbn: "",
      urlCapa: "",
      genero: "",
      estrelas: 0,
      notas: "",
      ano: "",
      sinopse: "",
    });
    setSelectedFile(null);
    setMensagem("");
    setErros({});
  };

  const getFieldIcon = (fieldName: keyof FormData) => {
    const validation = fieldValidations[fieldName];
    if (!formData[fieldName]) return null;
    
    return validation?.isValid ? (
      <CheckCircle className="h-4 w-4 text-green-500" />
    ) : (
      <AlertCircle className="h-4 w-4 text-red-500" />
    );
  };

  return (
  <div className="max-w-4xl mx-auto p-6 bg-[var(--background)]">
      <div className="mb-8">
  <h1 className="text-3xl font-bold text-[var(--foreground)] mb-2">Adicionar Novo Livro</h1>
  <p className="text-[var(--secondary-text)]">Preencha as informações do livro para adicionar à sua biblioteca</p>
      </div>

      {/* Barra de Progresso */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-[var(--foreground)]">Progresso do formulário</span>
          <span className="text-sm text-[var(--secondary-text)]">{progress}%</span>
        </div>
        <div className="w-full bg-[var(--card-bg)] rounded-full h-2">
          <div
            className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-green-500 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Coluna da Esquerda - Upload de Imagem */}
          <div className="lg:col-span-1">
            <ImageUpload
              onImageSelect={handleImageSelect}
              currentImageUrl={formData.urlCapa}
            />
          </div>

          {/* Coluna da Direita - Formulário */}
          <div className="lg:col-span-2 space-y-6">
            {/* Informações Básicas */}
            <div className="bg-[var(--card-bg)] rounded-lg p-6">
              <h3 className="text-lg font-semibold text-[var(--foreground)] mb-4">Informações Básicas</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Título */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                    Título *
                  </label>
                  <div className="relative">
                    <input
                      name="titulo"
                      value={formData.titulo}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 pr-10 bg-[var(--card-bg)] border rounded-lg text-[var(--foreground)] placeholder-[var(--secondary-text)] focus:outline-none focus:ring-2 transition-colors ${
                          fieldValidations.titulo?.isValid === false
                            ? 'border-red-500 focus:ring-red-500'
                            : formData.titulo && fieldValidations.titulo?.isValid
                            ? 'border-green-500 focus:ring-green-500'
                            : 'border-[var(--border)] focus:ring-[var(--primary)]'
                        }`}
                      placeholder="Digite o título do livro"
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      {getFieldIcon('titulo')}
                    </div>
                  </div>
                  {fieldValidations.titulo?.message && (
                    <p className="text-red-400 text-sm mt-1">{fieldValidations.titulo.message}</p>
                  )}
                </div>

                {/* Autor */}
                <div>
                  <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                    Autor *
                  </label>
                  <div className="relative">
                    <input
                      name="autor"
                      value={formData.autor}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 pr-10 bg-[var(--card-bg)] border rounded-lg text-[var(--foreground)] placeholder-[var(--secondary-text)] focus:outline-none focus:ring-2 transition-colors ${
                          fieldValidations.autor?.isValid === false
                            ? 'border-red-500 focus:ring-red-500'
                            : formData.autor && fieldValidations.autor?.isValid
                            ? 'border-green-500 focus:ring-green-500'
                            : 'border-[var(--border)] focus:ring-[var(--primary)]'
                        }`}
                      placeholder="Nome do autor"
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      {getFieldIcon('autor')}
                    </div>
                  </div>
                  {fieldValidations.autor?.message && (
                    <p className="text-red-400 text-sm mt-1">{fieldValidations.autor.message}</p>
                  )}
                </div>

                {/* Ano */}
                <div>
                  <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                    Ano de Publicação
                  </label>
                  <div className="relative">
                    <input
                      name="ano"
                      value={formData.ano}
                      onChange={handleChange}
                      type="number"
                      min="1000"
                      max={new Date().getFullYear()}
                      className={`w-full px-3 py-2 pr-10 bg-[var(--card-bg)] border rounded-lg text-[var(--foreground)] placeholder-[var(--secondary-text)] focus:outline-none focus:ring-2 transition-colors ${
                        fieldValidations.ano?.isValid === false
                          ? 'border-red-500 focus:ring-red-500'
                          : formData.ano && fieldValidations.ano?.isValid
                          ? 'border-green-500 focus:ring-green-500'
                          : 'border-[var(--border)] focus:ring-[var(--primary)]'
                      }`}
                      placeholder="Ex: 2023"
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      {getFieldIcon('ano')}
                    </div>
                  </div>
                  {fieldValidations.ano?.message && (
                    <p className="text-red-400 text-sm mt-1">{fieldValidations.ano.message}</p>
                  )}
                </div>

                {/* Gênero */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                    Gênero
                  </label>
                  <GenreAutocomplete
                    value={formData.genero}
                    onChange={(value) => setFormData(prev => ({ ...prev, genero: value }))}
                    suggestions={existingGenres}
                  />
                </div>
              </div>
            </div>

            {/* Detalhes do Livro */}
            <div className="bg-[var(--card-bg)] rounded-lg p-6">
              <h3 className="text-lg font-semibold text-[var(--foreground)] mb-4">Detalhes do Livro</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Páginas */}
                <div>
                  <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                    Total de Páginas
                  </label>
                  <div className="relative">
                    <input
                      name="paginas"
                      value={formData.paginas}
                      onChange={handleChange}
                      type="number"
                      min="1"
                      max="10000"
                      className={`w-full px-3 py-2 pr-10 bg-[var(--card-bg)] border rounded-lg text-[var(--foreground)] placeholder-[var(--secondary-text)] focus:outline-none focus:ring-2 transition-colors ${
                        fieldValidations.paginas?.isValid === false
                          ? 'border-red-500 focus:ring-red-500'
                          : formData.paginas && fieldValidations.paginas?.isValid
                          ? 'border-green-500 focus:ring-green-500'
                          : 'border-[var(--border)] focus:ring-[var(--primary)]'
                      }`}
                      placeholder="Ex: 350"
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      {getFieldIcon('paginas')}
                    </div>
                  </div>
                  {fieldValidations.paginas?.message && (
                    <p className="text-red-400 text-sm mt-1">{fieldValidations.paginas.message}</p>
                  )}
                </div>

                {/* Página Atual */}
                <div>
                  <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                    Página Atual
                  </label>
                  <div className="relative">
                    <input
                      name="paginaAtual"
                      value={formData.paginaAtual}
                      onChange={handleChange}
                      type="number"
                      min="0"
                      className={`w-full px-3 py-2 pr-10 bg-[var(--card-bg)] border rounded-lg text-[var(--foreground)] placeholder-[var(--secondary-text)] focus:outline-none focus:ring-2 transition-colors ${
                        fieldValidations.paginaAtual?.isValid === false
                          ? 'border-red-500 focus:ring-red-500'
                          : formData.paginaAtual && fieldValidations.paginaAtual?.isValid
                          ? 'border-green-500 focus:ring-green-500'
                          : 'border-[var(--border)] focus:ring-[var(--primary)]'
                      }`}
                      placeholder="Ex: 150"
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      {getFieldIcon('paginaAtual')}
                    </div>
                  </div>
                  {fieldValidations.paginaAtual?.message && (
                    <p className="text-red-400 text-sm mt-1">{fieldValidations.paginaAtual.message}</p>
                  )}
                </div>

                {/* Status */}
                <div>
                  <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                    Status de Leitura
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-[var(--card-bg)] border border-[var(--border)] rounded-lg text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                  >
                    <option value="">Selecione um status</option>
                    <option value="quero ler">📚 Quero Ler</option>
                    <option value="lendo">📖 Lendo</option>
                    <option value="lido">✅ Lido</option>
                    <option value="pausado">⏸️ Pausado</option>
                    <option value="abandonado">❌ Abandonado</option>
                  </select>
                </div>

                {/* ISBN */}
                <div>
                  <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                    ISBN
                  </label>
                  <div className="relative">
                    <input
                      name="isbn"
                      value={formData.isbn}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 pr-10 bg-[var(--card-bg)] border rounded-lg text-[var(--foreground)] placeholder-[var(--secondary-text)] focus:outline-none focus:ring-2 transition-colors ${
                          fieldValidations.isbn?.isValid === false
                            ? 'border-red-500 focus:ring-red-500'
                            : formData.isbn && fieldValidations.isbn?.isValid
                            ? 'border-green-500 focus:ring-green-500'
                            : 'border-[var(--border)] focus:ring-[var(--primary)]'
                        }`}
                      placeholder="Ex: 978-3-16-148410-0"
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      {getFieldIcon('isbn')}
                    </div>
                  </div>
                  {fieldValidations.isbn?.message && (
                    <p className="text-red-400 text-sm mt-1">{fieldValidations.isbn.message}</p>
                  )}
                </div>

                {/* Avaliação */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                    Sua Avaliação
                  </label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <button
                        key={rating}
                        type="button"
                        onClick={() => handleStarClick(rating)}
                        className="transition-colors hover:scale-110 transform"
                      >
                        <Star
                          className={`h-8 w-8 ${
                            rating <= formData.estrelas
                              ? 'text-yellow-400 fill-yellow-400'
                              : 'text-gray-600 hover:text-yellow-300'
                          }`}
                        />
                      </button>
                    ))}
                    {formData.estrelas > 0 && (
                      <span className="ml-2 text-sm text-[var(--secondary-text)]">
                        {formData.estrelas} de 5 estrelas
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Sinopse e Notas */}
            <div className="bg-[var(--card-bg)] rounded-lg p-6">
              <h3 className="text-lg font-semibold text-[var(--foreground)] mb-4">Descrição</h3>
              <div className="space-y-4">
                {/* Sinopse */}
                <div>
                  <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                    Sinopse
                  </label>
                  <textarea
                    name="sinopse"
                    value={formData.sinopse}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-3 py-2 bg-[var(--card-bg)] border border-[var(--border)] rounded-lg text-[var(--foreground)] placeholder-[var(--secondary-text)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent resize-none"
                    placeholder="Descreva brevemente o enredo do livro..."
                  />
                </div>

                {/* Notas Pessoais */}
                <div>
                  <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                    Notas Pessoais
                  </label>
                  <textarea
                    name="notas"
                    value={formData.notas}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-3 py-2 bg-[var(--card-bg)] border border-[var(--border)] rounded-lg text-[var(--foreground)] placeholder-[var(--secondary-text)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent resize-none"
                    placeholder="Suas impressões, citações favoritas, etc..."
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mensagem de Status */}
        {mensagem && (
          <div className={`p-4 rounded-lg ${
            mensagem.startsWith("✅") 
              ? "bg-green-100 border border-green-500 text-green-800 dark:bg-green-900/50 dark:text-green-300" 
              : "bg-red-100 border border-red-500 text-red-800 dark:bg-red-900/50 dark:text-red-300"
          }`}>
            {mensagem}
          </div>
        )}

        {/* Botões de Ação */}
        <div className="flex flex-col sm:flex-row gap-4 pt-6">
          <button
            type="submit"
            disabled={isSubmitting || !fieldValidations.titulo?.isValid || !fieldValidations.autor?.isValid}
            className="flex-1 flex items-center justify-center gap-2 bg-[var(--primary)] hover:bg-[var(--primary-hover)] disabled:bg-[var(--card-bg)] disabled:text-[var(--secondary-text)] disabled:cursor-not-allowed text-white font-medium py-3 px-6 rounded-lg transition-colors"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Salvando...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Adicionar Livro
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleReset}
            disabled={isSubmitting}
            className="flex items-center justify-center gap-2 bg-[var(--card-bg)] hover:bg-[var(--primary-hover)] disabled:bg-[var(--card-bg)] disabled:cursor-not-allowed text-[var(--foreground)] font-medium py-3 px-6 rounded-lg transition-colors"
          >
            <RotateCcw className="h-4 w-4" />
            Limpar Formulário
          </button>
        </div>
      </form>
    </div>
  );
}

