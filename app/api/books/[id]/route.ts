// app/api/books/[id]/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// --- GET (Obter um livro específico) ---
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const book = await prisma.book.findUnique({
      where: { id: params.id },
      include: { genre: true }, // Inclui os dados do gênero relacionado
    });

    if (!book) {
      return NextResponse.json({ message: 'Livro não encontrado.' }, { status: 404 });
    }

    return NextResponse.json(book);
  } catch (error) {
    return NextResponse.json({ message: 'Ocorreu um erro ao buscar o livro.' }, { status: 500 });
  }
}

// --- PUT (Atualizar um livro existente) ---
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json();
    const { genreId, ...bookData } = data;

    // Garante que o campo 'genre' não seja passado diretamente
    if ('genre' in bookData) {
      delete (bookData as any).genre;
    }

    const updatedBook = await prisma.book.update({
      where: { id: params.id },
      data: {
        ...bookData,
        // Conecta o livro ao gênero usando o ID fornecido
        ...(genreId && {
          genre: {
            connect: {
              id: genreId,
            },
          },
        }),
      },
      include: {
        genre: true, // Retorna o livro atualizado com os dados do gênero
      }
    });

    return NextResponse.json(updatedBook);
  } catch (error) {
    console.error("Erro ao atualizar o livro:", error);
    return NextResponse.json(
      { message: "Erro ao atualizar o livro. Verifique os dados enviados." },
      { status: 400 }
    );
  }
}

// --- DELETE (Remover um livro) ---
// ESTA É A FUNÇÃO CORRIGIDA
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Procura o livro pelo ID para garantir que ele existe antes de deletar
    const bookExists = await prisma.book.findUnique({
      where: { id: params.id },
    });

    if (!bookExists) {
      return NextResponse.json({ message: 'Livro não encontrado.' }, { status: 404 });
    }

    // Usa o Prisma para deletar o livro do banco de dados
    await prisma.book.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: 'Livro removido com sucesso!' });
  } catch (error) {
    console.error("Erro ao remover o livro:", error);
    return NextResponse.json({ message: 'Ocorreu um erro ao remover o livro.' }, { status: 500 });
  }
}