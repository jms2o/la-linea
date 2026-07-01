import { notFound } from "next/navigation";
import { formatCurrency, formatDate } from "@/lib/format";
import { getOrderByIdData } from "@/lib/data";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

const statuses = [
  "PENDING",
  "CONFIRMED",
  "PREPARING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED"
];

export default async function AdminOrderDetailPage({ params }: PageProps) {
  const { id } = await params;
  const order = await getOrderByIdData(id);

  if (!order) {
    notFound();
  }

  return (
    <div className="px-4 py-8 sm:px-6 lg:px-8">
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
        Pedido
      </p>
      <h1 className="mt-2 text-3xl font-semibold tracking-normal">
        {order.orderNumber}
      </h1>
      <p className="mt-2 text-sm text-[var(--muted)]">{formatDate(order.createdAt)}</p>

      <div className="mt-8 grid gap-6 xl:grid-cols-[1fr_360px]">
        <section className="rounded-lg border border-[var(--border)] bg-white">
          <div className="border-b border-[var(--border)] px-5 py-4">
            <h2 className="font-semibold">Productos</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[680px] text-left text-sm">
              <thead className="bg-[#F8F7F4] text-xs uppercase tracking-[0.12em] text-[var(--muted)]">
                <tr>
                  <th className="px-5 py-3">Producto</th>
                  <th className="px-5 py-3">Talla</th>
                  <th className="px-5 py-3">Color</th>
                  <th className="px-5 py-3">Cantidad</th>
                  <th className="px-5 py-3">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item) => (
                  <tr key={item.id} className="border-t border-[var(--border)]">
                    <td className="px-5 py-4 font-medium">{item.productName}</td>
                    <td className="px-5 py-4">{item.size}</td>
                    <td className="px-5 py-4">{item.color}</td>
                    <td className="px-5 py-4">{item.quantity}</td>
                    <td className="px-5 py-4 font-medium">{formatCurrency(item.subtotal)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <aside className="grid gap-5 self-start">
          <section className="rounded-lg border border-[var(--border)] bg-white p-5">
            <h2 className="font-semibold">Cliente</h2>
            <dl className="mt-4 grid gap-3 text-sm">
              <div>
                <dt className="text-[var(--muted)]">Nombre</dt>
                <dd className="font-medium">{order.customer.name}</dd>
              </div>
              <div>
                <dt className="text-[var(--muted)]">Telefono</dt>
                <dd className="font-medium">{order.customer.phone}</dd>
              </div>
              <div>
                <dt className="text-[var(--muted)]">Direccion</dt>
                <dd className="font-medium">{order.customer.address ?? "Sin direccion"}</dd>
              </div>
            </dl>
          </section>
          <section className="rounded-lg border border-[var(--border)] bg-white p-5">
            <h2 className="font-semibold">Estado</h2>
            <select
              defaultValue={order.status}
              className="mt-4 h-11 w-full rounded-lg border border-[var(--border)] bg-white px-3 text-sm"
            >
              {statuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
            <div className="mt-5 border-t border-[var(--border)] pt-4 text-sm">
              <div className="flex justify-between">
                <span className="text-[var(--muted)]">Subtotal</span>
                <strong>{formatCurrency(order.subtotal)}</strong>
              </div>
              <div className="mt-2 flex justify-between">
                <span className="text-[var(--muted)]">Envio</span>
                <strong>{formatCurrency(order.shippingCost)}</strong>
              </div>
              <div className="mt-2 flex justify-between text-base">
                <span>Total</span>
                <strong>{formatCurrency(order.total)}</strong>
              </div>
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}
