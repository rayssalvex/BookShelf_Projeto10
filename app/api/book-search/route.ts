// app/api/book-search/route.ts
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');

  if (!query) {
    return NextResponse.json({ message: 'Termo de busca é obrigatório' }, { status: 400 });
  }

  try {
    // URL ATUALIZADA para a API do Google Books
    const apiUrl = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=10`;
    
    const response = await fetch(apiUrl);

    if (!response.ok) {
      console.error(`Google Books API failed with status: ${response.status} ${response.statusText}`);
      throw new Error('Falha ao buscar na API do Google Books');
    }

    const data = await response.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error("Erro na API de busca:", error);
    return NextResponse.json({ message: 'Erro interno ao buscar livros' }, { status: 500 });
  }
}