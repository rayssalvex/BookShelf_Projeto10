import { NextResponse } from 'next/server';
import { mockGenres } from '@/data/mockGenres';

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ genre: string }> }
) {
  try {
    const resolvedParams = await params;
    const genreToDelete = resolvedParams.genre;

    const genreIndex = mockGenres.findIndex(
      (g) => g.toLowerCase() === genreToDelete.toLowerCase()
    );

    if (genreIndex === -1) {
      return NextResponse.json(
        { message: 'Gênero não encontrado.' },
        { status: 404 }
      );
    }

    // Remove o gênero da lista em memória
    const [deletedGenre] = mockGenres.splice(genreIndex, 1);

    return NextResponse.json({
      message: 'Gênero removido com sucesso!',
      genre: deletedGenre,
    });
  } catch {
    return NextResponse.json(
      { message: 'Ocorreu um erro ao remover o gênero.' },
      { status: 500 }
    );
  }
}