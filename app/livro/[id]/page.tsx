import EnhancedBookDetails from "@/components/shared/EnhancedBookDetails";
import { notFound } from "next/navigation";

export default async function BookDetailsPage({ params }: { params: { id: string } }) {
  const baseUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : process.env.NEXT_PUBLIC_BASE_URL
    ? process.env.NEXT_PUBLIC_BASE_URL
    : 'http://localhost:3000';
  const res = await fetch(`${baseUrl}/api/books/${params.id}`, { cache: 'no-store' });
  if (!res.ok) {
    notFound();
  }
  const book = await res.json();
  if (!book || book.error) {
    notFound();
  }
  return <EnhancedBookDetails book={book} />;
}
