export default function Loading() {
  return (
    <main className="min-h-screen bg-[var(--background)] px-4 py-12">
      <div className="mx-auto max-w-7xl">
        <div className="h-8 w-48 animate-pulse rounded-lg bg-[#E5E7EB]" />
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <div
              key={index}
              className="overflow-hidden rounded-lg border border-[var(--border)] bg-white"
            >
              <div className="aspect-[4/5] animate-pulse bg-[#E5E7EB]" />
              <div className="space-y-3 p-4">
                <div className="h-4 w-24 animate-pulse rounded bg-[#E5E7EB]" />
                <div className="h-5 w-40 animate-pulse rounded bg-[#E5E7EB]" />
                <div className="h-10 w-full animate-pulse rounded-lg bg-[#E5E7EB]" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
