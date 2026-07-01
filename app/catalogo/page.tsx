import type { Metadata } from "next";
import { CatalogClient } from "@/components/product/catalog-client";
import { getCategoriesData, getProductsData } from "@/lib/data";

export const metadata: Metadata = {
  title: "Catalogo",
  description:
    "Catalogo de camisas La Linea con precios de menudeo, mayoreo, tallas y colores."
};

export default async function CatalogPage() {
  const [products, categories] = await Promise.all([
    getProductsData({ activeOnly: true }),
    getCategoriesData()
  ]);

  return (
    <main className="min-h-screen bg-[var(--background)] py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
            Catalogo
          </p>
          <h1 className="mt-2 text-4xl font-semibold tracking-normal">
            Camisas para cada pedido
          </h1>
          <p className="mt-4 text-base leading-7 text-[var(--muted)]">
            Filtra por categoria, busca por nombre y compara precio de menudeo
            contra mayoreo antes de elegir variantes.
          </p>
        </div>
        <div className="mt-8">
          <CatalogClient products={products} categories={categories} />
        </div>
      </div>
    </main>
  );
}
