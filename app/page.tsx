// app/page.tsx
import { BookCarousel } from "@/components/shared/BookCarousel";

export default function Home() {
  return (
    <section className="w-full">
      <div className="mb-10 text-center">
        <h1 className="text-5xl font-bold tracking-tight text-white sm:text-6xl">
          Livros em Destaque
        </h1>
        <p className="mt-4 text-lg leading-8 text-[--secondary-text]">
          Explore os títulos mais recentes e populares da sua coleção.
        </p>
      </div>

      <BookCarousel />
    </section>
  );
}
