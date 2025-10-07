import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const genres = await prisma.genre.findMany({
      orderBy: {
        name: 'asc',
      },
    });
    return NextResponse.json(genres);
  } catch (error) {
    return NextResponse.json(
      { message: 'Ocorreu um erro ao buscar os gêneros.' },
      { status: 500 }
    );
  }
}