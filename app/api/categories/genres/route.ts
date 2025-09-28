import { NextResponse } from 'next/server';
import { mockGenres } from '@/data/mockGenres';

export async function POST(request: Request) {
  try {
    const { genre } = await request.json();

    if (!genre || typeof genre !== 'string') {
      return NextResponse.json(
        { message: 'Gênero inválido ou não fornecido.' },
        { status: 400 }
      );
    }

    if (mockGenres.includes(genre)) {
      return NextResponse.json(
        { message: 'Este gênero já existe.' },
        { status: 409 } // 409 Conflict
      );
    }

    // Adiciona o novo gênero à lista em memória
    mockGenres.push(genre);

    return NextResponse.json(
      { message: 'Gênero adicionado com sucesso!', genre: genre },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: 'Ocorreu um erro ao adicionar o gênero.' },
      { status: 500 }
    );
  }
}