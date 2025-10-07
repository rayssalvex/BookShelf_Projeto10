// app/biblioteca/page.tsx

import { prisma } from '@/lib/prisma';
import { BibliotecaView } from '@/components/shared/BibliotecaView'; // Vamos usar um componente de visão

// 1. A PÁGINA SE TORNA UM SERVER COMPONENT (ASSIM COMO O PROJETO PEDE)
// Sua única função é buscar os dados do banco de dados.
export default async function BibliotecaPage() {
  
  const books = await prisma.book.findMany({
    include: { genre: true },
    orderBy: { createdAt: 'desc' },
  });

  const genres = await prisma.genre.findMany({
    orderBy: { name: 'asc' },
  });

  // 2. PASSA OS DADOS PARA UM COMPONENTE DE CLIENTE
  // Isso separa a busca de dados (servidor) da interatividade (cliente).
  return <BibliotecaView initialBooks={books} availableGenres={genres} />;
}