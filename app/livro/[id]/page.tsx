import { mockBooks } from "@/data/mockBooks";
import { notFound } from "next/navigation";
import EnhancedBookDetails from "@/components/shared/EnhancedBookDetails";

export async function generateStaticParams() {
  return mockBooks.map((book) => ({
    id: book.id,
  }));
}

export default function BookDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const book = mockBooks.find((b) => b.id === params.id);

  if (!book) {
    notFound();
  }

  return <EnhancedBookDetails book={book} />;
}
