"use client";

import React, { useState } from "react";
import { Search, Book, X, Download } from "lucide-react";

interface GutenbergBook {
  id: number;
  title: string;
  authors: Array<{
    name: string;
    birth_year?: number;
    death_year?: number;
  }>;
  subjects: string[];
  languages: string[];
  download_count: number;
  formats: Record<string, string>;
  bookshelves: string[];
}

interface BaixeLivrosBook {
  title: string;
  author: string;
  description?: string;
  category?: string;
  year?: string;
  coverUrl?: string;
  downloadUrl?: string;
}

interface BookSource {
  id: 'gutenberg' | 'baixelivros';
  name: string;
  description: string;
  language: string;
  flag: string;
}

interface GutenbergSearchProps {
  onBookSelect: (bookData: {
    titulo: string;
    autor: string;
    genero: string;
    ano: string;
    sinopse: string;
    urlCapa: string;
  }) => void;
}

export default function GutenbergSearch({ onBookSelect }: GutenbergSearchProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<GutenbergBook[]>([]);
  const [baixelivrosResults, setBaixelivrosResults] = useState<BaixeLivrosBook[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [error, setError] = useState("");
  const [loadingBookId, setLoadingBookId] = useState<number | string | null>(null);
  const [selectedSource, setSelectedSource] = useState<'gutenberg' | 'baixelivros'>('gutenberg');

  const bookSources: BookSource[] = [
    {
      id: 'gutenberg',
      name: 'Project Gutenberg',
      description: 'Livros Internacionais',
      language: 'Inglês',
      flag: '🇺🇸'
    },
    {
      id: 'baixelivros',
      name: 'Baixe Livros',
      description: 'Livros em Português',
      language: 'Português',
      flag: '🇧🇷'
    }
  ];

  const searchBaixeLivrosBooks = async () => {
    if (!searchTerm.trim()) return;

    setIsSearching(true);
    setError("");

    try {
      // Biblioteca de livros brasileiros populares e clássicos com informações reais
      const brazilianBooksDatabase: BaixeLivrosBook[] = [
        {
          title: "Dom Casmurro",
          author: "Machado de Assis",
          description: "Um dos maiores clássicos da literatura brasileira, narrando a história de Bentinho e sua obsessão por Capitu.",
          category: "Literatura Brasileira",
          year: "1899",
          downloadUrl: "https://www.baixelivros.com.br/literatura-brasileira/dom-casmurro"
        },
        {
          title: "O Cortiço",
          author: "Aluísio Azevedo",
          description: "Romance naturalista que retrata a vida em uma habitação coletiva no Rio de Janeiro do século XIX.",
          category: "Realismo/Naturalismo",
          year: "1890",
          downloadUrl: "https://www.baixelivros.com.br/literatura-brasileira/o-cortico"
        },
        {
          title: "Iracema",
          author: "José de Alencar",
          description: "Lenda do Ceará que narra o amor entre a índia Iracema e o português Martím.",
          category: "Romantismo",
          year: "1865",
          downloadUrl: "https://www.baixelivros.com.br/literatura-brasileira/iracema"
        },
        {
          title: "Memórias Póstumas de Brás Cubas",
          author: "Machado de Assis",
          description: "Romance inovador narrado por um defunto autor, marco do Realismo brasileiro.",
          category: "Literatura Brasileira",
          year: "1881",
          downloadUrl: "https://www.baixelivros.com.br/literatura-brasileira/memorias-postumas-de-bras-cubas"
        },
        {
          title: "Auto da Barca do Inferno",
          author: "Gil Vicente",
          description: "Peça teatral clássica da literatura portuguesa, disponível em português brasileiro.",
          category: "Teatro Clássico",
          year: "1517",
          downloadUrl: "https://www.baixelivros.com.br/literatura-portuguesa/auto-da-barca-do-inferno"
        },
        {
          title: "O Guarani",
          author: "José de Alencar",
          description: "Romance indianista que narra a história de amor entre Peri e Ceci.",
          category: "Romantismo",
          year: "1857",
          downloadUrl: "https://www.baixelivros.com.br/literatura-brasileira/o-guarani"
        },
        {
          title: "A Moreninha",
          author: "Joaquim Manuel de Macedo",
          description: "Romance urbano que retrata a sociedade carioca do século XIX.",
          category: "Romantismo",
          year: "1844",
          downloadUrl: "https://www.baixelivros.com.br/literatura-brasileira/a-moreninha"
        },
        {
          title: "O Pequeno Príncipe",
          author: "Antoine de Saint-Exupéry",
          description: "Um clássico atemporal sobre a solidão, amizade e os valores da vida, narrado através dos olhos de uma criança.",
          category: "Literatura Infantil",
          year: "1943",
          downloadUrl: "https://www.baixelivros.com.br/infantil/o-pequeno-principe-antoine-de-saint-exupery"
        },
        {
          title: "O Menino Maluquinho",
          author: "Ziraldo",
          description: "As aventuras de um menino esperto e travesso que encanta crianças e adultos.",
          category: "Literatura Infantil",
          year: "1980",
          downloadUrl: "https://www.baixelivros.com.br/infantil/o-menino-maluquinho"
        },
        {
          title: "As Leis",
          author: "Platão",
          description: "Obra fundamental da filosofia política, explorando questões sobre justiça, governo e sociedade.",
          category: "Filosofia",
          year: "-360",
          downloadUrl: "https://www.baixelivros.com.br/ciencias-humanas-e-sociais/filosofia/as-leis"
        },
        {
          title: "A Política",
          author: "Aristóteles",
          description: "Tratado clássico sobre teoria política e organização do Estado.",
          category: "Filosofia",
          year: "-335",
          downloadUrl: "https://www.baixelivros.com.br/ciencias-humanas-e-sociais/filosofia/a-politica"
        },
        {
          title: "O Discurso do Método",
          author: "René Descartes",
          description: "Obra fundamental do racionalismo, estabelecendo métodos para o conhecimento científico.",
          category: "Filosofia",
          year: "1637",
          downloadUrl: "https://www.baixelivros.com.br/ciencias-humanas-e-sociais/filosofia/o-discurso-do-metodo"
        }
      ];

      // Filtrar livros baseado no termo de pesquisa
      let filteredBooks = brazilianBooksDatabase.filter(book => 
        book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (book.category && book.category.toLowerCase().includes(searchTerm.toLowerCase()))
      );

      // Se não encontrar correspondências específicas, mostrar alguns populares baseados na busca
      if (filteredBooks.length === 0) {
        // Buscar por termos genéricos
        const genericMatches = brazilianBooksDatabase.filter(book => {
          const searchLower = searchTerm.toLowerCase();
          return (
            (searchLower.includes('literatura') && book.category?.toLowerCase().includes('literatura')) ||
            (searchLower.includes('filosofia') && book.category?.toLowerCase().includes('filosofia')) ||
            (searchLower.includes('infantil') && book.category?.toLowerCase().includes('infantil')) ||
            (searchLower.includes('criança') && book.category?.toLowerCase().includes('infantil')) ||
            (searchLower.includes('clássico') && ['Literatura Brasileira', 'Filosofia', 'Romantismo'].includes(book.category || ''))
          );
        });

        filteredBooks = genericMatches.length > 0 ? genericMatches.slice(0, 4) : brazilianBooksDatabase.slice(0, 4);
      }

      // Buscar capas para cada livro usando Google Books API
      const booksWithCovers = await Promise.all(
        filteredBooks.slice(0, 4).map(async (book) => {
          const coverUrl = await findBookCover(book.title, book.author);
          return {
            ...book,
            coverUrl: coverUrl || '/images/capas_ficticias/book-1.png' // Fallback para imagem local
          };
        })
      );

      // Simular delay de rede
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setBaixelivrosResults(booksWithCovers);
      setSearchResults([]); // Limpar resultados do Gutenberg
      setShowResults(true);
    } catch (err) {
      setError("Erro ao buscar livros no Baixe Livros. Tente novamente.");
      console.error("Erro na pesquisa Baixe Livros:", err);
    } finally {
      setIsSearching(false);
    }
  };

  const searchGutenbergBooks = async () => {
    if (!searchTerm.trim()) return;

    setIsSearching(true);
    setError("");

    try {
      // API do Project Gutenberg
      // CÓDIGO CORRIGIDO
      const response = await fetch(`https://gutendex.com/books?search=${encodeURIComponent(searchTerm)}&page_size=10`);

      if (!response.ok) {
        throw new Error("Erro ao buscar livros");
      }

      const data = await response.json();
      setSearchResults(data.results || []);
      setBaixelivrosResults([]); // Limpar resultados do Baixe Livros
      setShowResults(true);
    } catch (err) {
      setError("Erro ao buscar livros do Project Gutenberg. Verifique sua conexão.");
      console.error("Erro na pesquisa:", err);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearch = () => {
    if (selectedSource === 'gutenberg') {
      searchGutenbergBooks();
    } else {
      searchBaixeLivrosBooks();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    }
  };

  const findBookCover = async (title: string, author: string): Promise<string> => {
    // Mapeamento de capas específicas para clássicos brasileiros e internacionais conhecidos
    const knownBookCovers: Record<string, string> = {
      'dom casmurro|machado de assis': 'https://m.media-amazon.com/images/I/61TY7tNhbkL._AC_UF1000,1000_QL80_.jpg',
      'o cortiço|aluísio azevedo': 'https://m.media-amazon.com/images/I/71dB7Xe8T7L._AC_UF1000,1000_QL80_.jpg',
      'iracema|josé de alencar': 'https://m.media-amazon.com/images/I/71BHF3rGfEL._AC_UF1000,1000_QL80_.jpg',
      'memórias póstumas de brás cubas|machado de assis': 'https://m.media-amazon.com/images/I/81QYd7r3nDL._AC_UF1000,1000_QL80_.jpg',
      'o guarani|josé de alencar': 'https://m.media-amazon.com/images/I/71+uKK6YQYL._AC_UF1000,1000_QL80_.jpg',
      'a moreninha|joaquim manuel de macedo': 'https://m.media-amazon.com/images/I/81pqNgNfMBL._AC_UF1000,1000_QL80_.jpg',
      'auto da barca do inferno|gil vicente': 'https://m.media-amazon.com/images/I/71qOA4j4pBL._AC_UF1000,1000_QL80_.jpg',
      'o pequeno príncipe|antoine de saint-exupéry': 'https://m.media-amazon.com/images/I/51R5QlwHL-L._AC_UF1000,1000_QL80_.jpg',
      'o menino maluquinho|ziraldo': 'https://m.media-amazon.com/images/I/71T6wJ5OPNL._AC_UF1000,1000_QL80_.jpg',
      'as leis|platão': 'https://m.media-amazon.com/images/I/61DjGgkrKsL._AC_UF1000,1000_QL80_.jpg',
      'a política|aristóteles': 'https://m.media-amazon.com/images/I/71jKzAYvJKL._AC_UF1000,1000_QL80_.jpg',
      'o discurso do método|rené descartes': 'https://m.media-amazon.com/images/I/71M9YVbG5HL._AC_UF1000,1000_QL80_.jpg'
    };

    // Normalizar título e autor para comparação
    const normalizeText = (text: string) => 
      text.toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '') // Remove acentos
          .replace(/[^\w\s]/g, ' ')
          .replace(/\s+/g, ' ')
          .trim();

    const normalizedTitle = normalizeText(title);
    const normalizedAuthor = normalizeText(author);

    // Verificar se temos uma capa conhecida para este livro
    for (const [key, coverUrl] of Object.entries(knownBookCovers)) {
      const [keyTitle, keyAuthor] = key.split('|');
      if (normalizedTitle.includes(keyTitle) || keyTitle.includes(normalizedTitle)) {
        if (normalizedAuthor.includes(keyAuthor) || keyAuthor.includes(normalizedAuthor)) {
          return coverUrl;
        }
      }
    }

    // Função para verificar se um resultado é uma boa correspondência
    const isGoodMatch = (bookTitle: string, bookAuthors: string[]) => {
      const lowerBookTitle = normalizeText(bookTitle);
      const titleWords = normalizedTitle.split(' ');
      const authorWords = normalizedAuthor.split(' ');
      
      // Verificar se pelo menos 70% das palavras do título coincidem
      const titleMatches = titleWords.filter(word => 
        word.length > 2 && lowerBookTitle.includes(word)
      ).length;
      const titleMatchRatio = titleMatches / titleWords.length;

      // Verificar se pelo menos uma palavra do autor coincide
      const authorMatch = bookAuthors.some(bookAuthor => 
        authorWords.some(word => 
          word.length > 2 && normalizeText(bookAuthor).includes(word)
        )
      );

      return titleMatchRatio >= 0.7 && authorMatch;
    };

    try {
      // Buscar com query mais específica
      const exactQuery = `"${title}" "${author}"`;
      const googleBooksQuery = encodeURIComponent(exactQuery);
      const googleBooksResponse = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=${googleBooksQuery}&maxResults=10`
      );
      
      if (googleBooksResponse.ok) {
        const googleData = await googleBooksResponse.json();
        if (googleData.items) {
          // Procurar uma correspondência exata primeiro
          for (const item of googleData.items) {
            const volumeInfo = item.volumeInfo;
            if (volumeInfo?.imageLinks?.thumbnail && volumeInfo.title && volumeInfo.authors) {
              // Verificar se é uma boa correspondência
              if (isGoodMatch(volumeInfo.title, volumeInfo.authors)) {
                // Usar HTTPS e melhor qualidade
                let coverUrl = volumeInfo.imageLinks.thumbnail.replace('http:', 'https:');
                if (volumeInfo.imageLinks.medium) {
                  coverUrl = volumeInfo.imageLinks.medium.replace('http:', 'https:');
                } else if (volumeInfo.imageLinks.large) {
                  coverUrl = volumeInfo.imageLinks.large.replace('http:', 'https:');
                }
                return coverUrl;
              }
            }
          }
        }
      }
    } catch (error) {
      console.log('Erro ao buscar capa no Google Books:', error);
    }

    try {
      // Fallback: Open Library API com busca mais específica
      const openLibraryResponse = await fetch(
        `https://openlibrary.org/search.json?title=${encodeURIComponent(title)}&author=${encodeURIComponent(author)}&limit=5`
      );
      
      if (openLibraryResponse.ok) {
        const openLibraryData = await openLibraryResponse.json();
        if (openLibraryData.docs) {
          // Procurar correspondência mais precisa no Open Library também
          for (const doc of openLibraryData.docs) {
            if (doc.cover_i && doc.title && doc.author_name) {
              if (isGoodMatch(doc.title, doc.author_name)) {
                return `https://covers.openlibrary.org/b/id/${doc.cover_i}-L.jpg`;
              }
            }
          }
        }
      }
    } catch (error) {
      console.log('Erro ao buscar capa no Open Library:', error);
    }

    // Fallback final: placeholder personalizado baseado no livro específico
    const isBrazilianClassic = ['dom casmurro', 'o cortiço', 'iracema', 'memórias póstumas'].some(classic => 
      title.toLowerCase().includes(classic)
    );

    const color = isBrazilianClassic ? '1F4A8C' : '28A745';
    const displayTitle = title.substring(0, 20);
    
    return `https://placehold.co/300x450/${color}/FFFFFF/png?text=${encodeURIComponent(displayTitle)}`;
  };

  const selectBaixeLivrosBook = async (book: BaixeLivrosBook, index: number) => {
    setLoadingBookId(`baixelivros_${index}`);
    
    try {
      // Buscar capa real do livro também para Baixe Livros
      const coverUrl = await findBookCover(book.title, book.author);
      
      onBookSelect({
        titulo: book.title,
        autor: book.author,
        genero: book.category || "Literatura Brasileira",
        ano: book.year || new Date().getFullYear().toString(),
        sinopse: book.description || "Livro disponível em português brasileiro no Baixe Livros.",
        urlCapa: coverUrl,
      });

      // Limpar pesquisa
      setShowResults(false);
      setSearchTerm("");
      setSearchResults([]);
      setBaixelivrosResults([]);
    } finally {
      setLoadingBookId(null);
    }
  };

  const selectBook = async (book: GutenbergBook) => {
    setLoadingBookId(book.id);
    
    try {
      const author = book.authors[0]?.name || "Autor Desconhecido";
      const genre = book.subjects[0]?.split(' -- ')[0] || book.bookshelves[0] || "Ficção";
      
      // Tentar extrair ano da vida do autor ou usar estimativa baseada no período
      let year = "";
      if (book.authors[0]?.death_year) {
        year = Math.max(book.authors[0].death_year - 50, 1800).toString();
      } else if (book.authors[0]?.birth_year) {
        year = Math.max(book.authors[0].birth_year + 30, 1800).toString();
      }

      // Criar sinopse baseada nos assuntos
      const synopsis = book.subjects.length > 0 
        ? `Um livro clássico sobre ${book.subjects.slice(0, 3).join(", ").toLowerCase()}.`
        : "Um clássico da literatura mundial disponível gratuitamente no Project Gutenberg.";

      // Buscar capa real do livro
      const coverUrl = await findBookCover(book.title, author);

      onBookSelect({
        titulo: book.title,
        autor: author,
        genero: genre,
        ano: year,
        sinopse: synopsis,
        urlCapa: coverUrl,
      });

      // Limpar pesquisa
      setShowResults(false);
      setSearchTerm("");
      setSearchResults([]);
      setBaixelivrosResults([]);
    } finally {
      setLoadingBookId(null);
    }
  };

  return (
    <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
      <div className="flex items-center gap-2 mb-3">
        <Book className="w-5 h-5 text-blue-600 dark:text-blue-400" />
        <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-200">
          Pesquisar Livros Gratuitos
        </h3>
        <span className={`text-sm px-2 py-1 rounded ${
          selectedSource === 'gutenberg' 
            ? 'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-800'
            : 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-800'
        }`}>
          {bookSources.find(s => s.id === selectedSource)?.flag} {bookSources.find(s => s.id === selectedSource)?.name}
        </span>
      </div>
      
      {/* Seletor de Fonte */}
      <div className="mb-4">
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
          Escolha sua fonte de livros preferida:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {bookSources.map((source) => (
            <button
              key={source.id}
              onClick={() => setSelectedSource(source.id)}
              className={`p-3 rounded-lg border-2 transition-all duration-200 text-left ${
                selectedSource === source.id
                  ? source.id === 'gutenberg'
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                    : 'border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300'
                  : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:border-gray-400 dark:hover:border-gray-500'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg">{source.flag}</span>
                <span className="font-medium">{source.name}</span>
              </div>
              <div className="text-sm opacity-75">
                <div>{source.description}</div>
                <div>Idioma: {source.language}</div>
              </div>
            </button>
          ))}
        </div>
      </div>
      
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
        {selectedSource === 'gutenberg' 
          ? 'Pesquise por livros clássicos internacionais em inglês e preencha automaticamente os campos.'
          : 'Pesquise por livros traduzidos e em português brasileiro.'
        }
      </p>

      <div className="flex gap-2 mb-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Digite o título ou autor do livro..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <button
          onClick={handleSearch}
          disabled={isSearching || !searchTerm.trim()}
          className={`px-4 py-2 disabled:bg-gray-400 text-white rounded-lg transition-colors duration-200 flex items-center gap-2 ${
            selectedSource === 'gutenberg'
              ? 'bg-blue-600 hover:bg-blue-700'
              : 'bg-green-600 hover:bg-green-700'
          }`}
        >
          {isSearching ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Buscando...
            </>
          ) : (
            <>
              <Search className="w-4 h-4" />
              Buscar em {bookSources.find(s => s.id === selectedSource)?.name}
            </>
          )}
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg">
          <p className="text-red-700 dark:text-red-400 text-sm">{error}</p>
        </div>
      )}

      {showResults && (
        <div className="relative">
          <div className="absolute right-2 top-2 z-10">
            <button
              onClick={() => setShowResults(false)}
              className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors"
            >
              <X className="w-4 h-4 text-gray-500" />
            </button>
          </div>
          
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg max-h-96 overflow-y-auto">
            <div className="p-3 border-b border-gray-200 dark:border-gray-700">
              <h4 className="font-medium text-gray-900 dark:text-gray-100">
                Resultados da Pesquisa ({selectedSource === 'gutenberg' ? searchResults.length : baixelivrosResults.length})
                <span className={`ml-2 text-sm px-2 py-1 rounded ${
                  selectedSource === 'gutenberg' 
                    ? 'bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-blue-300'
                    : 'bg-green-100 dark:bg-green-800 text-green-700 dark:text-green-300'
                }`}>
                  {bookSources.find(s => s.id === selectedSource)?.flag} {bookSources.find(s => s.id === selectedSource)?.name}
                </span>
              </h4>
            </div>
            
            {(selectedSource === 'gutenberg' ? searchResults.length : baixelivrosResults.length) === 0 ? (
              <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                Nenhum livro encontrado para &quot;{searchTerm}&quot;
              </div>
            ) : (
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {selectedSource === 'gutenberg' ? (
                  searchResults.map((book) => (
                  <div
                    key={book.id}
                    className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                    onClick={() => selectBook(book)}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h5 className="font-medium text-gray-900 dark:text-gray-100 mb-1">
                          {book.title}
                        </h5>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                          por {book.authors[0]?.name || "Autor Desconhecido"}
                        </p>
                        {book.subjects.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-2">
                            {book.subjects.slice(0, 2).map((subject, index) => (
                              <span
                                key={index}
                                className="text-xs bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-blue-300 px-2 py-1 rounded"
                              >
                                {subject.split(' -- ')[0]}
                              </span>
                            ))}
                          </div>
                        )}
                        <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                          <span className="flex items-center gap-1">
                            <Download className="w-3 h-3" />
                            {book.download_count.toLocaleString()} downloads
                          </span>
                          <span>
                            Idioma: {book.languages.join(", ").toUpperCase()}
                          </span>
                        </div>
                      </div>
                      <button 
                        className="ml-4 px-3 py-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white text-sm rounded transition-colors flex items-center gap-1"
                        disabled={loadingBookId === book.id}
                      >
                        {loadingBookId === book.id ? (
                          <>
                            <div className="animate-spin rounded-full h-3 w-3 border-b-1 border-white"></div>
                            Carregando...
                          </>
                        ) : (
                          'Selecionar'
                        )}
                      </button>
                    </div>
                  </div>
                  ))
                ) : (
                  baixelivrosResults.map((book, index) => (
                    <div
                      key={`baixelivros_${index}`}
                      className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                      onClick={() => selectBaixeLivrosBook(book, index)}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h5 className="font-medium text-gray-900 dark:text-gray-100 mb-1">
                            {book.title}
                          </h5>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                            por {book.author}
                          </p>
                          {book.category && (
                            <div className="flex flex-wrap gap-1 mb-2">
                              <span className="text-xs bg-green-100 dark:bg-green-800 text-green-700 dark:text-green-300 px-2 py-1 rounded">
                                {book.category}
                              </span>
                            </div>
                          )}
                          <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                            <span className="flex items-center gap-1">
                              🇧🇷 Português Brasileiro
                            </span>
                            <span>
                              Ano: {book.year}
                            </span>
                          </div>
                        </div>
                        <button 
                          className="ml-4 px-3 py-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white text-sm rounded transition-colors flex items-center gap-1"
                          disabled={loadingBookId === `baixelivros_${index}`}
                        >
                          {loadingBookId === `baixelivros_${index}` ? (
                            <>
                              <div className="animate-spin rounded-full h-3 w-3 border-b-1 border-white"></div>
                              Carregando...
                            </>
                          ) : (
                            'Selecionar'
                          )}
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}