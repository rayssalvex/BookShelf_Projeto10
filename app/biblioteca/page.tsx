"use client";

import { useState } from "react";
import CardBook from "../_cards/CardBook";
import SearchBar from "../_cards/SearchBar";

export default function Biblioteca() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <section className="w-full px-6">
      <div className="mb-8 flex md:flex-row flex-col md:items-center md:justify-between text-center">
        <h1 className="text-4xl font-bold tracking-tight text-white sm:text-4xl pb-4">
          Minha Biblioteca
        </h1>
        <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      </div>
      <CardBook searchTerm={searchTerm} />
    </section>
  );
}
