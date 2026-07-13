import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Package } from "lucide-react";
import { CancelOrderButton } from "@/components/account/cancel-order-button";
import { LogoutButton } from "@/components/auth/logout-button";
import { formatCurrency, formatDate } from "@/lib/format";
import { getOrdersByCustomerIdData } from "@/lib/data";
import { getSession } from "@/lib/session";
import { CUSTOMER_CANCELLABLE_STATUSES } from "@/types";

export const metadata: Metadata = {
  title: "Mi cuenta",
  description: "Consulta tu historial de pedidos en La Linea."
};

export default async function MiCuentaPage() {
  const session = await getSession();

  if (!session || session.kind !== "customer") {
    redirect("/login?next=/mi-cuenta");
  }

  const orders = await getOrdersByCustomerIdData(session.sub);

  return (
    <main className="min-h-screen bg-[var(--background)] py-12">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
              Cuenta
            </p>
            <h1 className="mt-2 text-4xl font-semibold tracking-normal">
              Hola, {session.name}
            </h1>
            <p className="mt-4 text-base leading-7 text-[var(--muted)]">
              Este es tu historial de pedidos.
            </p>
          </div>
          <LogoutButton />
        </div>

        <section className="mt-8 grid gap-4">
          {orders.length === 0 ? (
            <div className="rounded-lg border border-dashed border-[var(--border)] bg-white px-6 py-16 text-center">
              <Package className="mx-auto text-[var(--muted)]" size={32} />
              <h2 className="mt-4 text-xl font-semibold">Aun no tienes pedidos</h2>
              <p className="mt-3 text-sm text-[var(--muted)]">
                Explora el catalogo y arma tu primer pedido.
              </p>
              <Link
                href="/catalogo"
                className="mt-6 inline-flex h-11 items-center justify-center rounded-lg bg-[var(--primary)] px-5 text-sm font-semibold text-white"
              >
                Ver catalogo
              </Link>
            </div>
          ) : (
            orders.map((order) => (
              <div
                key={order.id}
                className="rounded-lg border border-[var(--border)] bg-white p-5"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold">{order.orderNumber}</p>
                    <p className="text-sm text-[var(--muted)]">
                      {formatDate(order.createdAt)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{formatCurrency(order.total)}</p>
                    <p className="text-sm text-[var(--muted)]">{order.status}</p>
                  </div>
                </div>
                <ul className="mt-4 grid gap-1 text-sm text-[var(--muted)]">
                  {order.items.map((item) => (
                    <li key={item.id}>
                      {item.quantity}x {item.productName}
                      {item.size ? ` (${item.size})` : ""}
                    </li>
                  ))}
                </ul>
                {CUSTOMER_CANCELLABLE_STATUSES.includes(order.status) ? (
                  <CancelOrderButton orderId={order.id} />
                ) : null}
              </div>
            ))
          )}
        </section>
      </div>
    </main>
  );
}
