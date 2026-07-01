import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { formatCurrency } from "@/lib/format";
import type { ProductDTO } from "@/types";

export function ProductCard({ product }: { product: ProductDTO }) {
  const image = product.images[0];

  return (
    <article className="group overflow-hidden rounded-lg border border-[var(--border)] bg-white">
      <Link href={`/producto/${product.slug}`} className="block">
        <div className="relative aspect-[4/5] overflow-hidden bg-[#E5E7EB]">
          {image ? (
            <Image
              src={image.url}
              alt={image.alt ?? product.name}
              fill
              sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
              className="object-cover transition duration-500 group-hover:scale-105"
            />
          ) : null}
        </div>
      </Link>
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
              {product.category.name}
            </p>
            <h3 className="mt-2 text-base font-semibold">{product.name}</h3>
          </div>
          <span className="rounded-full border border-[var(--border)] px-2.5 py-1 text-xs text-[var(--muted)]">
            {product.variants.reduce((sum, variant) => sum + variant.stock, 0)} pzas
          </span>
        </div>
        <div className="mt-4 grid gap-1 text-sm">
          <p>
            <span className="text-[var(--muted)]">Menudeo </span>
            <strong>{formatCurrency(product.retailPrice)}</strong>
          </p>
          <p>
            <span className="text-[var(--muted)]">Mayoreo </span>
            <strong>{formatCurrency(product.wholesalePrice)}</strong>
          </p>
          <p className="text-xs text-[var(--muted)]">
            Mayoreo desde {product.wholesaleMinQuantity} piezas
          </p>
        </div>
        <Link
          href={`/producto/${product.slug}`}
          className="mt-5 inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-[var(--primary)] px-4 text-sm font-semibold text-white transition hover:bg-[#1F2937]"
        >
          Ver producto <ArrowRight size={17} />
        </Link>
      </div>
    </article>
  );
}
