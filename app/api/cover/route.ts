import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get('title');
  const author = searchParams.get('author');

  if (!title || !author) {
    return NextResponse.json({ message: 'Título e autor são obrigatórios' }, { status: 400 });
  }

  try {
    const query = encodeURIComponent(`"${title}" "${author}"`);
    const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${query}&maxResults=1`);
    
    if (!response.ok) {
      throw new Error('Falha ao buscar na API do Google Books');
    }

    const data = await response.json();
    const coverUrl = data.items?.[0]?.volumeInfo?.imageLinks?.thumbnail || null;

    if (!coverUrl) {
      return NextResponse.json({ message: 'Capa não encontrada' }, { status: 404 });
    }

    // Retorna a URL da capa encontrada
    return NextResponse.json({ coverUrl: coverUrl.replace('http:', 'https:') });

  } catch (error) {
    console.error("Erro na API de capas:", error);
    return NextResponse.json({ message: 'Erro interno ao buscar capa' }, { status: 500 });
  }
}