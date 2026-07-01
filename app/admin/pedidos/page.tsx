import Link from "next/link";
import { Eye } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/format";
import { getOrdersData } from "@/lib/data";

export default async function AdminOrdersPage() {
  const orders = await getOrdersData();

  return (
    <div className="px-4 py-8 sm:px-6 lg:px-8">
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
        Admin
      </p>
      <h1 className="mt-2 text-3xl font-semibold tracking-normal">Pedidos</h1>

      <section className="mt-8 rounded-lg border border-[var(--border)] bg-white">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[860px] text-left text-sm">
            <thead className="bg-[#F8F7F4] text-xs uppercase tracking-[0.12em] text-[var(--muted)]">
              <tr>
                <th className="px-5 py-3">Pedido</th>
                <th className="px-5 py-3">Cliente</th>
                <th className="px-5 py-3">Telefono</th>
                <th className="px-5 py-3">Total</th>
                <th className="px-5 py-3">Estado</th>
                <th className="px-5 py-3">Fecha</th>
                <th className="px-5 py-3">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-t border-[var(--border)]">
                  <td className="px-5 py-4 font-medium">{order.orderNumber}</td>
                  <td className="px-5 py-4">{order.customer.name}</td>
                  <td className="px-5 py-4 text-[var(--muted)]">{order.customer.phone}</td>
                  <td className="px-5 py-4 font-medium">{formatCurrency(order.total)}</td>
                  <td className="px-5 py-4">{order.status}</td>
                  <td className="px-5 py-4 text-[var(--muted)]">{formatDate(order.createdAt)}</td>
                  <td className="px-5 py-4">
                    <Link
                      href={`/admin/pedidos/${order.id}`}
                      className="grid h-9 w-9 place-items-center rounded-lg border border-[var(--border)]"
                    >
                      <Eye size={16} />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
