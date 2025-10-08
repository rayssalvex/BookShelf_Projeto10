// components/shared/BookCarousel.tsx
"use client";

import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Prisma } from "@prisma/client";

type BookWithGenre = Prisma.BookGetPayload<{ include: { genre: true } }>;

// O Carrossel agora recebe os livros como propriedade
export function BookCarousel({ books }: { books: BookWithGenre[] }) {
  
  if (books.length === 0) {
    return (
      <div className="w-full max-w-6xl mx-auto text-center py-12">
        <p className="text-gray-400">Nenhum livro encontrado.</p>
      </div>
    );
  }

  return (
    <Carousel opts={{ align: "start", loop: true }} className="w-full max-w-6xl mx-auto">
      <CarouselContent className="-ml-4">
        {books.map((book) => (
          <CarouselItem key={book.id} className="pl-4 md:basis-1/3 lg:basis-1/4">
            <div className="p-1">
              <Link href={`/livro/${book.id}`} className="group">
                <Card className="overflow-hidden">
                  <CardContent className="flex aspect-[2/3] items-center justify-center p-0">
                      <Image
                        src={book.coverUrl}
                        alt={`Capa do livro ${book.title}`}
                        width={300}
                        height={450}
                        className="object-cover w-full h-full"
                      />
                  </CardContent>
                </Card>
              </Link>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  )
}