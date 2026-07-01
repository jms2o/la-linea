"use client";

import { ShoppingBag } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/components/cart/cart-provider";
import type { ProductDTO, ProductVariantDTO } from "@/types";

type AddToCartButtonProps = {
  product: ProductDTO;
  variant: ProductVariantDTO;
  quantity: number;
};

export function AddToCartButton({
  product,
  variant,
  quantity
}: AddToCartButtonProps) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  return (
    <button
      type="button"
      className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-[var(--primary)] px-5 text-sm font-semibold text-white transition hover:bg-[#1F2937]"
      onClick={() => {
        addItem({ product, variant, quantity });
        setAdded(true);
        window.setTimeout(() => setAdded(false), 1600);
      }}
    >
      <ShoppingBag size={18} /> {added ? "Agregado" : "Agregar al carrito"}
    </button>
  );
}
