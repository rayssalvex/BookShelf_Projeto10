import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const books = await prisma.book.findMany({ include: { genre: true } });
    return NextResponse.json(books);
  } catch (error) {
    return NextResponse.json(
      { message: 'Ocorreu um erro ao buscar os livros.' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const newBook = await request.json();
    console.log('Novo livro recebido:', newBook);

    // Busca ou cria o gênero
    let genre = await prisma.genre.findUnique({ where: { name: newBook.genre } });
    if (!genre) {
      genre = await prisma.genre.create({
        data: { name: newBook.genre, id: (globalThis.crypto?.randomUUID?.() || require('crypto').randomUUID()) }
      });
    }

    // Cria o livro com o genreId
    const createdBook = await prisma.book.create({
      data: {
        id: (globalThis.crypto?.randomUUID?.() || require('crypto').randomUUID()),
        title: newBook.title,
        author: newBook.author,
        genreId: genre.id,
        year: Number(newBook.year),
        pages: Number(newBook.pages),
        rating: Number(newBook.rating),
        synopsis: newBook.synopsis,
        coverUrl: newBook.coverUrl,
        status: (newBook.status || 'QUERO_LER').toUpperCase().replace(/\s/g, '_'),
        currentPage: Number(newBook.currentPage) || 0,
        createdAt: new Date(),
        updatedAt: new Date(),
        isbn: newBook.isbn ?? null,
        notes: newBook.notes ?? null,
      },
    });
    return NextResponse.json(createdBook, { status: 201 });
  } catch (error) {
    console.error("Erro Prisma:", error);
    return NextResponse.json(
      { message: 'Ocorreu um erro ao adicionar o livro.', error: String(error) },
      { status: 500 }
  );
}