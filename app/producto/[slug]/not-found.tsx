import Link from "next/link";

export default function ProductNotFound() {
  return (
    <main className="grid min-h-screen place-items-center bg-[var(--background)] px-4 py-16">
      <div className="max-w-md rounded-lg border border-[var(--border)] bg-white p-8 text-center">
        <h1 className="text-2xl font-semibold">Producto no encontrado</h1>
        <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
          El producto ya no esta disponible o la liga cambio.
        </p>
        <Link
          href="/catalogo"
          className="mt-6 inline-flex h-11 items-center justify-center rounded-lg bg-[var(--primary)] px-5 text-sm font-semibold text-white"
        >
          Volver al catalogo
        </Link>
      </div>
    </main>
  );
}
