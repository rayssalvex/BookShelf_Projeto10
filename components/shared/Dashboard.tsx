"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";
import { Prisma } from "@prisma/client";

// Define o tipo para um livro com seu gênero, vindo do Prisma
type BookWithGenre = Prisma.BookGetPayload<{ include: { genre: true } }>;

// Define a estrutura dos dados que vamos calcular
interface DashboardStats {
  totalBooks: number;
  totalPages: number;
  averageRating: number;
  genreDistribution: { name: string; value: number; color: string }[];
  ratingDistribution: { rating: number; count: number }[];
  yearlyData: { year: number; books: number; pages: number }[];
  readingTime: number; // em horas
  mostReadGenre: string;
}

const COLORS = [
  "#8884d8", "#82ca9d", "#ffc658", "#ff7300", "#8dd1e1", 
  "#d084d0", "#ffb347", "#87ceeb", "#dda0dd", "#98fb98"
];

// O Dashboard agora recebe os livros como uma propriedade
export function Dashboard({ books }: { books: BookWithGenre[] }) {
  const [stats, setStats] = useState<DashboardStats | null>(null);

  // Função para calcular todas as estatísticas com base nos livros recebidos
  const calculateStats = useCallback(() => {
    if (!books) return;

    const totalBooks = books.length;
    const totalPages = books.reduce((sum, book) => sum + (book.pages || 0), 0);
    const ratingsSum = books.reduce((sum, book) => sum + (book.rating || 0), 0);
    const averageRating = books.length > 0 ? ratingsSum / books.length : 0;
    
    // CORREÇÃO: Usa 'book.genre.name' para contar os gêneros
    const genreCount: { [key: string]: number } = {};
    books.forEach(book => {
      if (book.genre && book.genre.name) {
        genreCount[book.genre.name] = (genreCount[book.genre.name] || 0) + 1;
      }
    });
    
    const genreDistribution = Object.entries(genreCount)
      .map(([name, value], index) => ({
        name,
        value,
        color: COLORS[index % COLORS.length]
      }))
      .sort((a, b) => b.value - a.value);

    const ratingCount: { [key: number]: number } = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    books.forEach(book => {
      if (book.rating && book.rating >= 1 && book.rating <= 5) {
        ratingCount[book.rating] = (ratingCount[book.rating] || 0) + 1;
      }
    });
    
    const ratingDistribution = Object.entries(ratingCount)
      .map(([rating, count]) => ({ rating: parseInt(rating), count }))
      .sort((a, b) => a.rating - b.rating);

    const yearCount: { [key: number]: { books: number; pages: number } } = {};
    books.forEach(book => {
      if (book.year) {
        if (!yearCount[book.year]) {
          yearCount[book.year] = { books: 0, pages: 0 };
        }
        yearCount[book.year].books += 1;
        yearCount[book.year].pages += book.pages || 0;
      }
    });
    
    const yearlyData = Object.entries(yearCount)
      .map(([year, data]) => ({ year: parseInt(year), ...data }))
      .sort((a, b) => a.year - b.year);

    const readingTime = Math.round((totalPages * 250) / 200 / 60);
    const mostReadGenre = genreDistribution.length > 0 ? genreDistribution[0].name : "Nenhum";

    setStats({
      totalBooks,
      totalPages,
      averageRating,
      genreDistribution,
      ratingDistribution,
      yearlyData,
      readingTime,
      mostReadGenre
    });
  }, [books]);

  // Recalcula as estatísticas sempre que a lista de livros mudar
  useEffect(() => {
    calculateStats();
  }, [books, calculateStats]);

  if (!stats) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Estatísticas Gerais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-none">
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Total de Livros</CardTitle></CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalBooks}</div>
            <p className="text-xs text-blue-100">{stats.mostReadGenre} é o gênero favorito</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-none">
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Páginas Totais</CardTitle></CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalPages.toLocaleString()}</div>
            <p className="text-xs text-green-100">~{stats.readingTime}h de leitura</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white border-none">
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Avaliação Média</CardTitle></CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.averageRating.toFixed(1)}</div>
            <div className="flex text-yellow-100">
              {[...Array(5)].map((_, i) => (<span key={i}> {i < Math.round(stats.averageRating) ? '★' : '☆'} </span>))}
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-none">
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Tempo de Leitura</CardTitle></CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.readingTime}h</div>
            <p className="text-xs text-purple-100">Tempo estimado total</p>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-[var(--card-bg)] border-[var(--border)]">
          <CardHeader>
            <CardTitle className="text-[var(--foreground)]">Distribuição por Gênero</CardTitle>
          </CardHeader>
          <CardContent>
            {stats.genreDistribution.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={stats.genreDistribution} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                    {stats.genreDistribution.map((entry, index) => (<Cell key={`cell-${index}`} fill={entry.color} />))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : <p className="text-center text-[var(--secondary-text)] pt-20">Nenhum gênero para exibir</p>}
          </CardContent>
        </Card>
        <Card className="bg-[var(--card-bg)] border-[var(--border)]">
          <CardHeader>
            <CardTitle className="text-[var(--foreground)]">Distribuição por Avaliação</CardTitle>
          </CardHeader>
          <CardContent>
            {stats.ratingDistribution.some(r => r.count > 0) ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={stats.ratingDistribution}>
                  <XAxis dataKey="rating" stroke="#9CA3AF" tickFormatter={(value) => `${value} ★`} />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip />
                  <Bar dataKey="count" fill="#8884d8" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : <p className="text-center text-[var(--secondary-text)] pt-20">Nenhuma avaliação para exibir</p>}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}