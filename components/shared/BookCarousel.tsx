// components/shared/BookCarousel.tsx
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { mockBooks } from '@/data/mockBooks';

export function BookCarousel() {
  return (
    <Carousel
      opts={{
        align: "start",
        loop: true,
      }}
      className="w-full max-w-6xl mx-auto"
    >
      <CarouselContent className="-ml-4">
        {mockBooks.map((book) => (
          <CarouselItem key={book.id} className="pl-4 md:basis-1/3 lg:basis-1/4">
            <div className="p-1">
              <Link href={`/livro/${book.id}`} className="group">
                <Card className="overflow-hidden bg-[--card-bg] border-2 border-transparent group-hover:border-[--primary] transition-all duration-300 shadow-lg">
                  <CardContent className="flex aspect-[2/3] items-center justify-center p-0">
                     <Image
                        src={book.coverUrl}
                        alt={`Capa do livro ${book.title}`}
                        width={300}
                        height={450}
                        className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                      />
                  </CardContent>
                </Card>
              </Link>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="hidden sm:flex bg-[--card-bg] text-[--primary] hover:bg-[--border] hover:text-white border-[--border]" />
      <CarouselNext className="hidden sm:flex bg-[--card-bg] text-[--primary] hover:bg-[--border] hover:text-white border-[--border]" />
    </Carousel>
  )
}