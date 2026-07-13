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

  return (
    <main className="min-h-screen bg-[var(--background)] py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <CheckoutForm
          customer={{
            name: customer?.name ?? session.name,
            phone: customer?.phone ?? "",
            address: customer?.address ?? null,
            neighborhood: customer?.neighborhood ?? null,
            city: customer?.city ?? null,
            state: customer?.state ?? null,
            zipCode: customer?.zipCode ?? null,
            reference: customer?.reference ?? null
          }}
        />
      </div>
    </main>
  );
}
