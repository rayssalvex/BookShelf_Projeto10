// app/livro/[id]/page.tsx

import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import EnhancedBookDetails from '@/components/shared/EnhancedBookDetails';

// 1. A PÁGINA AGORA É UM SERVER COMPONENT 'ASYNC'
export default async function BookDetailsPage({ params }: { params: { id: string } }) {
  
  // 2. BUSCA O LIVRO DIRETAMENTE DO BANCO USANDO PRISMA
  const book = await prisma.book.findUnique({
    where: {
      id: params.id,
    },
    include: {
      genre: true, // Inclui os dados do gênero para exibir na página
    },
  });

  // 3. SE O LIVRO NÃO EXISTIR NO BANCO, MOSTRA A PÁGINA 404
  if (!book) {
    notFound();
  }

  // 4. SE ENCONTRAR, RENDERIZA O COMPONENTE DE DETALHES PASSANDO O LIVRO
  return <EnhancedBookDetails book={book} />;
}