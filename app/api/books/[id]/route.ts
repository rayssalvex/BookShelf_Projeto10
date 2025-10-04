import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// --- GET (Obter um livro específico) ---
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const url = new URL(request.url);
    const bookId = url.pathname.split('/').pop();
    console.log('GET bookId:', bookId);
    if (!bookId) {
      return NextResponse.json({ message: 'ID do livro inválido.' }, { status: 400 });
    }
    const book = await prisma.book.findUnique({
      where: { id: bookId },
      include: { genre: true },
    });
    if (!book) {
      return NextResponse.json({ message: 'Livro não encontrado.' }, { status: 404 });
    }
    return NextResponse.json(book);
  } catch (error) {
    return NextResponse.json(
      { message: 'Ocorreu um erro ao buscar o livro.', error: String(error) },
      { status: 500 }
    );
  }
}

// --- PUT (Atualizar um livro existente) ---
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const url = new URL(request.url);
    const bookId = url.pathname.split('/').pop();
    console.log('PUT bookId:', bookId);
    if (!bookId) {
      return NextResponse.json({ message: 'ID do livro inválido.' }, { status: 400 });
    }
  const updatedData = await request.json();
  console.log('PUT updatedData:', updatedData);
    const { genre, ...rest } = updatedData;
    let data = rest;
    if (genre) {
      data = {
        ...rest,
        genre: { connect: { name: genre } }
      };
    }
    const updatedBook = await prisma.book.update({
      where: { id: bookId },
      data,
    });
    return NextResponse.json({ 
      message: 'Livro atualizado com sucesso!', 
      book: updatedBook 
    });
  } catch (error) {
    return NextResponse.json(
      { message: 'Erro ao atualizar o livro.', error: String(error) },
      { status: 400 }
    );
  }
}

// --- DELETE (Remover um livro) ---
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const url = new URL(request.url);
    const bookId = url.pathname.split('/').pop();
    console.log('DELETE bookId:', bookId);
    if (!bookId) {
      return NextResponse.json({ message: 'ID do livro inválido.' }, { status: 400 });
    }
    const deletedBook = await prisma.book.delete({
      where: { id: bookId },
    });
    return NextResponse.json({ 
      message: 'Livro removido com sucesso!',
      book: deletedBook
    });
  } catch (error) {
    return NextResponse.json(
      { message: 'Ocorreu um erro ao remover o livro.', error: String(error) },
      { status: 500 }
    );
  }
}