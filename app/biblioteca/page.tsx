import CardBook from "../_cards/CardBook";

export default function Biblioteca() {
  return (
    <section className="w-full p-6">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-white sm:text-4xl">
          Minha Biblioteca
        </h1>
      </div>
      <CardBook />
    </section>
  );
}

