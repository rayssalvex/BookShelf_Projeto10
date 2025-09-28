import { NextResponse } from 'next/server';
import { mockBooks } from '@/data/mockBooks';

// --- GET (Obter um livro específico) ---
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const bookId = params.id;
    const book = mockBooks.find((b) => b.id === bookId);

    if (!book) {
      return NextResponse.json({ message: 'Livro não encontrado.' }, { status: 404 });
    }

    return NextResponse.json(book);
  } catch (error) {
    return NextResponse.json(
      { message: 'Ocorreu um erro ao buscar o livro.' },
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
    const bookId = params.id;
    const bookIndex = mockBooks.findIndex((b) => b.id === bookId);

    if (bookIndex === -1) {
      return NextResponse.json({ message: 'Livro não encontrado.' }, { status: 404 });
    }

    const updatedData = await request.json();
    mockBooks[bookIndex] = { ...mockBooks[bookIndex], ...updatedData };

    return NextResponse.json({ 
      message: 'Livro atualizado com sucesso!', 
      book: mockBooks[bookIndex] 
    });
  } catch (error) {
    return NextResponse.json(
      { message: 'Erro ao atualizar o livro. Verifique os dados enviados.' },
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
    const bookId = params.id;
    const bookIndex = mockBooks.findIndex((b) => b.id === bookId);

    if (bookIndex === -1) {
      return NextResponse.json({ message: 'Livro não encontrado.' }, { status: 404 });
    }

    // Remove o livro da lista
    const [deletedBook] = mockBooks.splice(bookIndex, 1);

    return NextResponse.json({ 
      message: 'Livro removido com sucesso!',
      book: deletedBook
    });
  } catch (error) {
    return NextResponse.json(
      { message: 'Ocorreu um erro ao remover o livro.' },
      { status: 500 }
    );
  }
}