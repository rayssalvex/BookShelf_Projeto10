import { PrismaClient } from '@prisma/client';
import fs from 'fs/promises'; // Adicione este import
import crypto from 'crypto';  // Adicione este import para gerar IDs

const prisma = new PrismaClient();

async function migrate() {
  // Lê o arquivo JSON
  const raw = await fs.readFile('data/mockBooks.json', 'utf-8');
  const books: any[] = JSON.parse(raw);

  // Migra gêneros únicos
  const genres = [...new Set(books.map((b: any) => b.genre))];
  const genreMap: Record<string, string> = {};
  for (const name of genres as string[]) {
    const genre = await prisma.genre.upsert({
      where: { name: name },
      update: {},
      create: { id: crypto.randomUUID(), name: name },
    });
    genreMap[name] = genre.id;
  }

  // Migra livros
  for (const book of books) {
    await prisma.book.create({
      data: {
        id: book.id ?? crypto.randomUUID(),
        title: book.title,
        author: book.author,
        genreId: genreMap[book.genre],
        year: book.year,
        pages: book.pages,
        rating: book.rating,
        synopsis: book.synopsis,
        coverUrl: book.coverUrl ?? "", // <-- Garante valor padrão
        status: 'QUERO_LER',
        currentPage: 0,
        isbn: book.isbn ?? null,
        notes: book.notes ?? null,
      },
    });
  }
  console.log('Migração concluída!');
}

migrate().finally(() => prisma.$disconnect());