"use client";

export default function Error({
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="grid min-h-screen place-items-center bg-[var(--background)] px-4 py-16">
      <div className="max-w-md rounded-lg border border-[var(--border)] bg-white p-8 text-center">
        <h1 className="text-2xl font-semibold">Algo salio mal</h1>
        <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
          No pudimos cargar esta vista. Intenta nuevamente.
        </p>
        <button
          type="button"
          onClick={reset}
          className="mt-6 h-11 rounded-lg bg-[var(--primary)] px-5 text-sm font-semibold text-white"
        >
          Reintentar
        </button>
      </div>
    </main>
  );
}
