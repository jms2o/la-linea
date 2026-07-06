"use client";

import { usePathname, useRouter } from "next/navigation";
import { ShoppingBag } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/components/cart/cart-provider";
import { useAuth } from "@/components/providers/auth-provider";
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
  const { user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [added, setAdded] = useState(false);

  function handleClick() {
    if (!user) {
      router.push(`/login?next=${encodeURIComponent(pathname)}`);
      return;
    }

    addItem({ product, variant, quantity });
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1600);
  }

  return (
    <button
      type="button"
      className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-[var(--primary)] px-5 text-sm font-semibold text-white transition hover:bg-[#1F2937]"
      onClick={handleClick}
    >
      <ShoppingBag size={18} /> {added ? "Agregado" : "Agregar al carrito"}
    </button>
  );
}
