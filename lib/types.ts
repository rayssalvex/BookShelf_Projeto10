import { Genre } from "@prisma/client";

// lib/types.ts
export interface Book {
  id: string;
  title: string; // Obrigatório
  author: string; // Obrigatório
  coverUrl: string; // URL da capa
  year?: number;
  pages?: number;
  rating?: number; // 1-5
  synopsis?: string;
  status: string;
  genre: Genre; // "LIDO", "LENDO", "QUERO_LER", "PAUSADO", "ABANDONADO"
  userId?: string; // ID do usuário proprietário
  // Adicione outros campos do PDF conforme necessário
}

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string; // Opcional para não expor na interface
  createdAt: Date;
  books: Book[];
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateUserBooks: (books: Book[]) => void;
  loading: boolean;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  name: string;
  email: string;
  password: string;
}