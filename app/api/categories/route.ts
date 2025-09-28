import { NextResponse } from 'next/server';
import { mockGenres } from '@/data/mockGenres';

export async function GET() {
  try {
    const genres = mockGenres;
    return NextResponse.json(genres);
  } catch (error) {
    return NextResponse.json(
      { message: 'Ocorreu um erro ao buscar os gêneros.' },
      { status: 500 }
    );
  }
}