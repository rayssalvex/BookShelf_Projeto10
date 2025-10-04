import { prisma } from './prisma';
import { ReadingStatus } from '@prisma/client';

export interface CreateBookInput {
  title: string;
  author: string;
  genreId: string;
  year: number;
  pages: number;
  rating: number;
  synopsis: string;
  coverUrl: string;
  status: ReadingStatus;
  currentPage?: number;
  isbn?: string;
  notes?: string;
}

export type UpdateBookInput = Partial<CreateBookInput>;

// Funções de Livros
export async function getBooks() {
  try {
    return await prisma.book.findMany({ orderBy: { createdAt: 'desc' }, include: { genre: true } });
  } catch (error) {
    console.error('Erro ao listar livros:', error);
    throw new Error('Erro ao listar livros');
  }
}

export async function getBook(id: string) {
  try {
    return await prisma.book.findUnique({ where: { id }, include: { genre: true } });
  } catch (error) {
    console.error('Erro ao buscar livro:', error);
    throw new Error('Erro ao buscar livro');
  }
}

export async function createBook(data: CreateBookInput) {
  try {
  return await prisma.book.create({ data: data as CreateBookInput });
  } catch (error) {
    console.error('Erro ao criar livro:', error);
    throw new Error('Erro ao criar livro');
  }
}

export async function updateBook(id: string, data: UpdateBookInput) {
  try {
    return await prisma.book.update({ where: { id }, data });
  } catch (error) {
    console.error('Erro ao atualizar livro:', error);
    throw new Error('Erro ao atualizar livro');
  }
}

export async function deleteBook(id: string) {
  try {
    return await prisma.book.delete({ where: { id } });
  } catch (error) {
    console.error('Erro ao remover livro:', error);
    throw new Error('Erro ao remover livro');
  }
}

// Funções de Gêneros
export async function getGenres() {
  try {
    return await prisma.genre.findMany({ orderBy: { name: 'asc' } });
  } catch (error) {
    console.error('Erro ao listar gêneros:', error);
    throw new Error('Erro ao listar gêneros');
  }
}

export async function createGenre(name: string) {
  try {
  return await prisma.genre.create({ data: { name } as { name: string } });
  } catch (error) {
    console.error('Erro ao criar gênero:', error);
    throw new Error('Erro ao criar gênero');
  }
}

// Função de Status
export function getReadingStatusOptions(): ReadingStatus[] {
  return Object.values(ReadingStatus);
}
