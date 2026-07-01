"use client";

import Link from "next/link";
import { ShoppingBag, X } from "lucide-react";
import { CartItem } from "@/components/cart/cart-item";
import { CartSummary } from "@/components/cart/cart-summary";
import { useCart } from "@/components/cart/cart-provider";

type CartDrawerProps = {
  open: boolean;
  onClose: () => void;
};

export function CartDrawer({ open, onClose }: CartDrawerProps) {
  const cart = useCart();

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50">
      <button
        type="button"
        aria-label="Cerrar carrito"
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />
      <aside className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-[var(--border)] px-5 py-4">
          <div className="flex items-center gap-2 font-semibold">
            <ShoppingBag size={19} /> Carrito
          </div>
          <button
            type="button"
            aria-label="Cerrar carrito"
            className="grid h-10 w-10 place-items-center rounded-lg border border-[var(--border)]"
            onClick={onClose}
          >
            <X size={18} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-5">
          {cart.items.length ? (
            cart.items.map((item) => <CartItem key={`${item.productId}:${item.productVariantId}`} item={item} />)
          ) : (
            <div className="grid h-full place-items-center py-16 text-center">
              <div>
                <p className="text-lg font-semibold">Tu carrito esta vacio</p>
                <p className="mt-2 text-sm text-[var(--muted)]">
                  Agrega camisas desde el catalogo para preparar tu pedido.
                </p>
                <Link
                  href="/catalogo"
                  onClick={onClose}
                  className="mt-5 inline-flex h-11 items-center justify-center rounded-lg bg-[var(--primary)] px-5 text-sm font-semibold text-white"
                >
                  Ver catalogo
                </Link>
              </div>
            </div>
          )}
        </div>
        {cart.items.length ? (
          <div className="border-t border-[var(--border)] p-5">
            <CartSummary
              subtotal={cart.subtotal}
              shippingCost={cart.shippingCost}
              total={cart.total}
            />
          </div>
        ) : null}
      </aside>
    </div>
  );
}
