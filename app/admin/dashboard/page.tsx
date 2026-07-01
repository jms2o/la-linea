import Link from "next/link";
import { AlertTriangle, ArrowRight, Boxes, DollarSign, Package } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/format";
import { getOrdersData, getProductsData } from "@/lib/data";

export default async function AdminDashboardPage() {
  const [products, orders] = await Promise.all([
    getProductsData({ activeOnly: false }),
    getOrdersData()
  ]);
  const activeProducts = products.filter((product) => product.active);
  const lowStockProducts = products.filter(
    (product) =>
      product.variants.reduce((sum, variant) => sum + variant.stock, 0) <= 10
  );
  const pendingOrders = orders.filter((order) => order.status === "PENDING");
  const estimatedSales = orders.reduce((sum, order) => sum + order.total, 0);

  const metrics = [
    { label: "Total de pedidos", value: orders.length, icon: Boxes },
    { label: "Pedidos pendientes", value: pendingOrders.length, icon: AlertTriangle },
    { label: "Productos activos", value: activeProducts.length, icon: Package },
    { label: "Ventas estimadas", value: formatCurrency(estimatedSales), icon: DollarSign }
  ];

  return (
    <div className="px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
            Admin
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-normal">Dashboard</h1>
        </div>
        <Link
          href="/admin/pedidos"
          className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-[var(--primary)] px-4 text-sm font-semibold text-white"
        >
          Ver pedidos <ArrowRight size={17} />
        </Link>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <div key={metric.label} className="rounded-lg border border-[var(--border)] bg-white p-5">
            <metric.icon size={22} className="text-[var(--blue)]" />
            <p className="mt-4 text-sm text-[var(--muted)]">{metric.label}</p>
            <p className="mt-1 text-2xl font-semibold">{metric.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-[1fr_360px]">
        <section className="rounded-lg border border-[var(--border)] bg-white">
          <div className="border-b border-[var(--border)] px-5 py-4">
            <h2 className="font-semibold">Ultimos pedidos</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="bg-[#F8F7F4] text-xs uppercase tracking-[0.12em] text-[var(--muted)]">
                <tr>
                  <th className="px-5 py-3">Pedido</th>
                  <th className="px-5 py-3">Cliente</th>
                  <th className="px-5 py-3">Estado</th>
                  <th className="px-5 py-3">Total</th>
                  <th className="px-5 py-3">Fecha</th>
                </tr>
              </thead>
              <tbody>
                {orders.slice(0, 6).map((order) => (
                  <tr key={order.id} className="border-t border-[var(--border)]">
                    <td className="px-5 py-4 font-medium">{order.orderNumber}</td>
                    <td className="px-5 py-4 text-[var(--muted)]">{order.customer.name}</td>
                    <td className="px-5 py-4">{order.status}</td>
                    <td className="px-5 py-4 font-medium">{formatCurrency(order.total)}</td>
                    <td className="px-5 py-4 text-[var(--muted)]">{formatDate(order.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="rounded-lg border border-[var(--border)] bg-white p-5">
          <h2 className="font-semibold">Productos con bajo stock</h2>
          <div className="mt-4 grid gap-3">
            {lowStockProducts.length ? (
              lowStockProducts.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between gap-4 rounded-lg border border-[var(--border)] p-3"
                >
                  <div>
                    <p className="font-medium">{product.name}</p>
                    <p className="text-sm text-[var(--muted)]">{product.category.name}</p>
                  </div>
                  <span className="text-sm font-semibold">
                    {product.variants.reduce((sum, variant) => sum + variant.stock, 0)}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-sm text-[var(--muted)]">No hay productos con bajo stock.</p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
