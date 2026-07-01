"use client";

import Image from "next/image";
import Link from "next/link";
import { Trash2 } from "lucide-react";
import { getCartItemKey, useCart } from "@/components/cart/cart-provider";
import { QuantitySelector } from "@/components/cart/quantity-selector";
import { formatCurrency } from "@/lib/format";
import type { CartItem as CartItemType } from "@/types";

export function CartItem({ item }: { item: CartItemType }) {
  const { increaseItem, decreaseItem, removeItem } = useCart();
  const key = getCartItemKey(item);

  return (
    <article className="grid grid-cols-[88px_1fr] gap-4 border-b border-[var(--border)] py-5 last:border-b-0 sm:grid-cols-[104px_1fr_auto]">
      <div className="relative aspect-square overflow-hidden rounded-lg bg-[#E5E7EB]">
        {item.imageUrl ? (
          <Image
            src={item.imageUrl}
            alt={item.productName}
            fill
            sizes="120px"
            className="object-cover"
          />
        ) : null}
      </div>
      <div className="min-w-0">
        <Link
          href={item.productSlug ? `/producto/${item.productSlug}` : "/catalogo"}
          className="font-semibold"
        >
          {item.productName}
        </Link>
        <p className="mt-1 text-sm text-[var(--muted)]">
          {[item.size, item.color].filter(Boolean).join(" / ")}
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <QuantitySelector
            value={item.quantity}
            onChange={(next) => {
              if (next > item.quantity) {
                increaseItem(key);
              } else if (next < item.quantity) {
                decreaseItem(key);
              }
            }}
          />
          <button
            type="button"
            className="inline-flex h-11 items-center gap-2 rounded-lg border border-[var(--border)] px-3 text-sm text-[var(--muted)] transition hover:border-[#D1D5DB] hover:text-[var(--foreground)]"
            onClick={() => removeItem(key)}
          >
            <Trash2 size={16} /> Eliminar
          </button>
        </div>
      </div>
      <div className="col-span-2 text-left sm:col-span-1 sm:text-right">
        <p className="text-sm text-[var(--muted)]">
          {formatCurrency(item.unitPrice)} c/u
        </p>
        <p className="mt-1 text-lg font-semibold">{formatCurrency(item.subtotal)}</p>
      </div>
    </article>
  );
}
