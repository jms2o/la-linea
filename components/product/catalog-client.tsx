"use client";

import { Search, SlidersHorizontal } from "lucide-react";
import { useMemo, useState } from "react";
import { ProductCard } from "@/components/product/product-card";
import type { CategoryDTO, ProductDTO } from "@/types";

type SortValue = "recent" | "price-asc" | "price-desc";

export function CatalogClient({
  products,
  categories
}: {
  products: ProductDTO[];
  categories: CategoryDTO[];
}) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState<SortValue>("recent");

  const filteredProducts = useMemo(() => {
    const needle = search.trim().toLowerCase();

    return [...products]
      .filter((product) => {
        const matchesCategory = category === "all" || product.category.slug === category;
        const matchesSearch =
          !needle ||
          product.name.toLowerCase().includes(needle) ||
          product.description.toLowerCase().includes(needle);

        return matchesCategory && matchesSearch;
      })
      .sort((a, b) => {
        if (sort === "price-asc") {
          return a.retailPrice - b.retailPrice;
        }

        if (sort === "price-desc") {
          return b.retailPrice - a.retailPrice;
        }

        return Date.parse(b.createdAt) - Date.parse(a.createdAt);
      });
  }, [category, products, search, sort]);

  return (
    <div>
      <div className="grid gap-3 rounded-lg border border-[var(--border)] bg-white p-3 md:grid-cols-[1fr_220px_220px]">
        <label className="relative block">
          <Search
            size={18}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]"
          />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Buscar por nombre"
            className="h-12 w-full rounded-lg border border-[var(--border)] bg-white pl-10 pr-3 text-sm outline-none transition focus:border-[var(--primary)]"
          />
        </label>
        <label className="relative block">
          <SlidersHorizontal
            size={18}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]"
          />
          <select
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            className="h-12 w-full appearance-none rounded-lg border border-[var(--border)] bg-white pl-10 pr-3 text-sm outline-none transition focus:border-[var(--primary)]"
          >
            <option value="all">Todas las categorias</option>
            {categories.map((item) => (
              <option key={item.id} value={item.slug}>
                {item.name}
              </option>
            ))}
          </select>
        </label>
        <select
          value={sort}
          onChange={(event) => setSort(event.target.value as SortValue)}
          className="h-12 rounded-lg border border-[var(--border)] bg-white px-3 text-sm outline-none transition focus:border-[var(--primary)]"
        >
          <option value="recent">Mas recientes</option>
          <option value="price-asc">Menor precio</option>
          <option value="price-desc">Mayor precio</option>
        </select>
      </div>

      {filteredProducts.length ? (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="mt-8 rounded-lg border border-dashed border-[var(--border)] bg-white px-6 py-16 text-center">
          <p className="text-lg font-semibold">No hay productos para esta busqueda</p>
          <p className="mt-2 text-sm text-[var(--muted)]">
            Prueba con otra categoria o limpia el texto de busqueda.
          </p>
        </div>
      )}
    </div>
  );
}
