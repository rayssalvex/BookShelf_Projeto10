"use client";

import { Dispatch, SetStateAction } from "react";

type SearchBarProps = {
  searchTerm: string;
  setSearchTerm: Dispatch<SetStateAction<string>>;
};

export default function SearchBar({
  searchTerm,
  setSearchTerm,
}: SearchBarProps) {
  return (
    <input
      type="text"
      placeholder="🔎 Buscar por título, autor, gênero, ano..."
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      className="w-full md:w-2xs p-2 bg-white border rounded-md text-zinc-600 text-sm"
    />
  );
}
