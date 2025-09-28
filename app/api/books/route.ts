import { NextResponse } from 'next/server';
import { mockBooks } from '@/data/mockBooks';

export async function GET() {
  try {
    const books = mockBooks;

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

    mockBooks.push({ ...newBook, id: (mockBooks.length + 1).toString() });
    
    return NextResponse.json(
      { message: 'Livro adicionado com sucesso!', book: newBook },
      { status: 201 } // 201 significa "Created" (Criado)
    );
  } catch (error) {
    return NextResponse.json(
      { message: 'Erro ao adicionar o livro. Verifique os dados enviados.' },
      { status: 400 } // 400 significa "Bad Request" (Requisição Inválida)
    );
  }
}