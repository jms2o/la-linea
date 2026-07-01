"use client";

import Link from "next/link";
import { Trash2 } from "lucide-react";
import { CartItem } from "@/components/cart/cart-item";
import { CartSummary } from "@/components/cart/cart-summary";
import { useCart } from "@/components/cart/cart-provider";

export function CartPageClient() {
  const cart = useCart();

  return (
    <main className="min-h-screen bg-[var(--background)] py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
              Carrito
            </p>
            <h1 className="mt-2 text-4xl font-semibold tracking-normal">
              Resumen del pedido
            </h1>
          </div>
          {cart.items.length ? (
            <button
              type="button"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-[var(--border)] bg-white px-4 text-sm font-semibold text-[var(--muted)]"
              onClick={cart.clearCart}
            >
              <Trash2 size={17} /> Vaciar carrito
            </button>
          ) : null}
        </div>

        {cart.items.length ? (
          <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
            <section className="rounded-lg border border-[var(--border)] bg-white px-5">
              {cart.items.map((item) => (
                <CartItem
                  key={`${item.productId}:${item.productVariantId}`}
                  item={item}
                />
              ))}
            </section>
            <CartSummary
              subtotal={cart.subtotal}
              shippingCost={cart.shippingCost}
              total={cart.total}
            />
          </div>
        ) : (
          <div className="mt-8 rounded-lg border border-dashed border-[var(--border)] bg-white px-6 py-16 text-center">
            <h2 className="text-xl font-semibold">Tu carrito esta vacio</h2>
            <p className="mt-3 text-sm text-[var(--muted)]">
              Agrega productos del catalogo para preparar tu pedido.
            </p>
            <Link
              href="/catalogo"
              className="mt-6 inline-flex h-11 items-center justify-center rounded-lg bg-[var(--primary)] px-5 text-sm font-semibold text-white"
            >
              Ver catalogo
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
