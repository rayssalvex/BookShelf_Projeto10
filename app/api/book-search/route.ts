// app/api/book-search/route.ts
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');
  const source = searchParams.get('source'); // 'gutenberg' ou 'google'

  if (!query) {
    return NextResponse.json({ message: 'Termo de busca é obrigatório' }, { status: 400 });
  }

  let apiUrl = '';
  if (source === 'gutenberg') {
    apiUrl = `https://gutendex.com/books?search=${encodeURIComponent(query)}&page_size=10`;
  } else {
    // Usaremos a API do Google como padrão para buscar capas ou informações gerais
    apiUrl = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=10`;
  }

  try {
    const response = await fetch(apiUrl, {
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Falha na chamada à API externa: ${response.statusText}`);
    }

    const data = await response.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error(`Erro na API de busca (${source}):`, error);
    return NextResponse.json({ message: 'Erro interno ao buscar livros' }, { status: 500 });
  }
}