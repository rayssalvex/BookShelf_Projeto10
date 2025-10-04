
// lib/types.ts
export interface Book {
  id: string;
  title: string; // Obrigatório
  author: string; // Obrigatório
  coverUrl: string; // URL da capa
  genre?: string | { id: string; name: string };
  year?: number;
  pages?: number;
  rating?: number; // 1-5
  synopsis?: string;
  // Adicione outros campos do PDF conforme necessário
}