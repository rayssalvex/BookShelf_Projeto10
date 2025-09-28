
"use client";


import React, { useState } from "react";

type ReadingStatus = "" | "Lido" | "Lendo" | "Quero Ler";

import Image from "next/image";

interface FormData {
  titulo: string;
  autor: string;
  paginas: string; // mantive como string para facilitar o input controlado
  paginaAtual: string; // idem
  status: ReadingStatus;
  isbn: string;
  urlCapa: string;
  genero: string;
  estrelas: number;
  notas: string;
}

type FormErrors = Partial<Record<keyof FormData, string>>;

export default function AddBook() {
  const [formData, setFormData] = useState<FormData>({
    titulo: "",
    autor: "",
    paginas: "",
    paginaAtual: "",
    status: "",
    isbn: "",
    urlCapa: "",
    genero: "",
    estrelas: 0,
    notas: "",
  });

  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [mensagem, setMensagem] = useState<string>("");
  const [erros, setErros] = useState<FormErrors>({});

  // util: verifica url válida
  const isValidUrl = (s: string) => {
    try {
      new URL(s);
      return true;
    } catch {
      return false;
    }
  };

  // handler genérico com tipagem correta
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const name = e.target.name as keyof FormData;
 
    const rawValue = e.target.value;
    const value: FormData[typeof name] =
      name === "estrelas"
        ? (Number(rawValue) as unknown as FormData[typeof name])
        : (rawValue as unknown as FormData[typeof name]);

    setFormData((prev) => ({ ...prev, [name]: value } as FormData));

    if (name === "urlCapa") {
      setPreviewUrl(String(value));
    }
  };

  // Validação simples
  const validar = (): FormErrors => {
    const novosErros: FormErrors = {};
    if (!formData.titulo.trim()) novosErros.titulo = "Título é obrigatório";
    if (!formData.autor.trim()) novosErros.autor = "Autor é obrigatório";

    const paginasNum = Number(formData.paginas);
    const paginaAtualNum = Number(formData.paginaAtual);

    if (formData.paginas && (isNaN(paginasNum) || paginasNum <= 0)) {
      novosErros.paginas = "Total de páginas inválido";
    }
    if (formData.paginaAtual && (isNaN(paginaAtualNum) || paginaAtualNum < 0)) {
      novosErros.paginaAtual = "Página atual inválida";
    }
    if (
      !isNaN(paginasNum) &&
      !isNaN(paginaAtualNum) &&
      paginaAtualNum > paginasNum
    ) {
      novosErros.paginaAtual =
        "Página atual não pode ser maior que total de páginas";
    }

    if (formData.urlCapa && !isValidUrl(formData.urlCapa)) {
      novosErros.urlCapa = "URL da capa inválida";
    }

    return novosErros;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const validation = validar();
    if (Object.keys(validation).length > 0) {
      setErros(validation);
      setMensagem("❌ Corrija os erros antes de enviar.");
      return;
    }
    setErros({});
    setMensagem("✅ Livro adicionado com sucesso!");

    // preparar payload (converte campos numéricos)
    const payload = {
      ...formData,
      paginas: formData.paginas ? Number(formData.paginas) : undefined,
      paginaAtual: formData.paginaAtual
        ? Number(formData.paginaAtual)
        : undefined,
    };

    console.log("Enviar para backend:", payload);

  };

  // barra de progresso: contar campos preenchidos
  const totalCampos = 9; 
  const preenchidos = (Object.keys(formData) as (keyof FormData)[]).reduce(
    (acc, k) => {
      const v = formData[k];
      if (typeof v === "number") return v > 0 ? acc + 1 : acc;
      return v !== "" ? acc + 1 : acc;
    },
    0
  );
  const progresso = Math.round((preenchidos / totalCampos) * 100);

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Adicionar Livro</h2>

      <div className="w-full bg-gray-100 rounded-full h-2.5 mb-4">
        <div
          className="h-2.5 rounded-full bg-blue-600"
          style={{ width: `${progresso}%` }}
        />
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Título */}
        <div>
          <label className="block font-medium">Título *</label>
          <input
            name="titulo"
            value={formData.titulo}
            onChange={handleChange}
            className="w-full border rounded p-2"
          />
          {erros.titulo && (
            <p className="text-red-500 text-sm">{erros.titulo}</p>
          )}
        </div>

        {/* Autor */}
        <div>
          <label className="block font-medium">Autor *</label>
          <input
            name="autor"
            value={formData.autor}
            onChange={handleChange}
            className="w-full border rounded p-2"
          />
          {erros.autor && <p className="text-red-500 text-sm">{erros.autor}</p>}
        </div>

        {/* Páginas */}
        <div>
          <label className="block font-medium">Total de páginas</label>
          <input
            name="paginas"
            value={formData.paginas}
            onChange={handleChange}
            type="number"
            className="w-full border rounded p-2"
          />
          {erros.paginas && (
            <p className="text-red-500 text-sm">{erros.paginas}</p>
          )}
        </div>

        {/* Página atual */}
        <div>
          <label className="block font-medium">Página atual</label>
          <input
            name="paginaAtual"
            value={formData.paginaAtual}
            onChange={handleChange}
            type="number"
            className="w-full border rounded p-2"
          />
          {erros.paginaAtual && (
            <p className="text-red-500 text-sm">{erros.paginaAtual}</p>
          )}
        </div>

        {/* Status */}
        <div>
          <label className="block font-medium">Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full border rounded p-2 "
          >
            <option value="">Selecione</option>
            <option value="Lido">Lido</option>
            <option value="Lendo">Lendo</option>
            <option value="Quero Ler">Quero Ler</option>
          </select>
        </div>

        {/* ISBN */}
        <div>
          <label className="block font-medium">ISBN</label>
          <input
            name="isbn"
            value={formData.isbn}
            onChange={handleChange}
            className="w-full border rounded p-2"
          />
        </div>

        {/* URL capa */}
        <div>
          <label className="block font-medium">URL da capa</label>
          <input
            name="urlCapa"
            value={formData.urlCapa}
            onChange={handleChange}
            className="w-full border rounded p-2"
          />
          {erros.urlCapa && (
            <p className="text-red-500 text-sm">{erros.urlCapa}</p>
          )}
          {previewUrl && (
            <div className="mt-2">
              <p className="text-sm font-medium">Preview da capa:</p>
              <Image
                src={previewUrl}
                alt="Preview da capa"
                width={128} // 32 * 4 (tailwind "w-32" = 128px)
                height={192} // proporção aproximada de capa de livro
                className="rounded shadow"
                onError={() => setPreviewUrl("")}
              />
            </div>
          )}
        </div>

        {/* Gênero */}
        <div>
          <label className="block font-medium text-[var(--foreground)]">Gênero</label>
          <input
            name="genero"
            value={formData.genero}
            onChange={handleChange}
            className="w-full border rounded p-2 bg-[var(--card-bg)] text-[var(--foreground)] placeholder-[var(--secondary-text)] border-[var(--border)] focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
          />
        </div>

        {/* Avaliação */}
        <div>
          <label className="block font-medium">Avaliação (0-5)</label>
          <input
            name="estrelas"
            value={String(formData.estrelas)}
            onChange={handleChange}
            type="number"
            min={0}
            max={5}
            className="w-full border rounded p-2"
          />
        </div>

        {/* Notas */}
        <div>
          <label className="block font-medium">Notas pessoais</label>
          <textarea
            name="notas"
            value={formData.notas}
            onChange={handleChange}
            className="w-full border rounded p-2"
          />
        </div>

        {mensagem && (
          <p
            className={`font-medium ${
              mensagem.startsWith("✅") ? "text-green-600" : "text-red-600"
            }`}
          >
            {mensagem}
          </p>
        )}

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Adicionar
        </button>
      </form>
    </div>
  );
}
