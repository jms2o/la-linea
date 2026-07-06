import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { CheckoutForm } from "@/components/checkout/checkout-form";
import { getCustomerByIdData } from "@/lib/data";
import { getSession } from "@/lib/session";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Confirma tu pedido La Linea y envialo por WhatsApp."
};

export default async function CheckoutPage() {
  const session = await getSession();

  if (!session || session.kind !== "customer") {
    redirect("/login?next=/checkout");
  }

  const customer = await getCustomerByIdData(session.sub);
  const initialCustomer = customer
    ? {
        name: customer.name,
        phone: customer.phone,
        address: customer.address ?? "",
        city: customer.city ?? "",
        notes: customer.notes ?? ""
      }
    : undefined;

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
        <CheckoutForm initialCustomer={initialCustomer} />
      </div>
    </main>
  );
}
