import type { Metadata } from "next";
import { CheckoutForm } from "@/components/checkout/checkout-form";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Confirma tu pedido La Linea y envialo por WhatsApp."
};

export default function CheckoutPage() {
  return (
    <main className="min-h-screen bg-[var(--background)] py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
            Checkout
          </p>
          <h1 className="mt-2 text-4xl font-semibold tracking-normal">
            Confirma tu pedido
          </h1>
          <p className="mt-4 text-base leading-7 text-[var(--muted)]">
            Completa tus datos para guardar el pedido y generar el mensaje de
            WhatsApp con productos, variantes y total.
          </p>
        </div>
        <CheckoutForm />
      </div>
    </main>
  );
}
