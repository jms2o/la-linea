import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { AnimatedButton } from "@/components/ui/animated-button";
import { ProductSpinViewer } from "@/components/product/product-spin-viewer";
import { formatCurrency } from "@/lib/format";
import { getProductSpinColor } from "@/lib/product-spin";
import type { ProductDTO } from "@/types";

export function ProductCard({ product }: { product: ProductDTO }) {
  const firstVariantColor = product.variants[0]?.color;
  const spinColor = getProductSpinColor(product.name, firstVariantColor);

  return (
    <article className="group overflow-hidden rounded-2xl border border-black/10 bg-white shadow-sm transition-all duration-300 hover:border-transparent hover:shadow-2xl">
      <div className="relative aspect-[4/5] overflow-hidden">
        <ProductSpinViewer
          productName={product.name}
          color={spinColor}
          compact
          className="transition duration-500 group-hover:scale-[1.015]"
        />
        <Link
          href={`/producto/${product.slug}`}
          aria-label={`Ver detalle de ${product.name}`}
          className="absolute inset-x-0 bottom-0 h-20"
        />
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="inline-block rounded-full bg-[var(--blue)]/10 px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--blue)]">
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
        <AnimatedButton href={`/producto/${product.slug}`} className="mt-5 h-11 w-full rounded-xl">
          Ver producto <ArrowRight size={17} />
        </AnimatedButton>
      </div>
    </article>
  );
}
