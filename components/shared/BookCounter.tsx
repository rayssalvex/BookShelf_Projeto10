"use client";

type BookCounterProps = {
  counts: {
    total: number;
    lido: number;
    lendo: number;
    queroLer: number;
  };
};

export default function BookCounter({ counts }: BookCounterProps) {
  return (
    <div className="flex gap-3 my-3 text-center text-sm">
      <p className="">Total: {counts.total}</p>
      <p className="text-blue-600">Lidos: {counts.lido}</p>
      <p className="text-green-600">Lendo: {counts.lendo}</p>
      <p className="text-yellow-500">Quero ler: {counts.queroLer}</p>
    </div>
  );
}
