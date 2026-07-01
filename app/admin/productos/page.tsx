import Image from "next/image";
import { Pencil, Power } from "lucide-react";
import { formatCurrency } from "@/lib/format";
import { getProductsData } from "@/lib/data";

export default async function AdminProductsPage() {
  const products = await getProductsData({ activeOnly: false });

  return (
    <div className="px-4 py-8 sm:px-6 lg:px-8">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
          Admin
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-normal">Productos</h1>
      </div>

      <section className="mt-8 rounded-lg border border-[var(--border)] bg-white">
        <div className="flex flex-col justify-between gap-3 border-b border-[var(--border)] px-5 py-4 sm:flex-row sm:items-center">
          <h2 className="font-semibold">Catalogo administrable</h2>
          <button className="h-10 rounded-lg bg-[var(--primary)] px-4 text-sm font-semibold text-white">
            Crear producto
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[920px] text-left text-sm">
            <thead className="bg-[#F8F7F4] text-xs uppercase tracking-[0.12em] text-[var(--muted)]">
              <tr>
                <th className="px-5 py-3">Producto</th>
                <th className="px-5 py-3">Categoria</th>
                <th className="px-5 py-3">Menudeo</th>
                <th className="px-5 py-3">Mayoreo</th>
                <th className="px-5 py-3">Stock</th>
                <th className="px-5 py-3">Estado</th>
                <th className="px-5 py-3">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-t border-[var(--border)]">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="relative h-12 w-12 overflow-hidden rounded-lg bg-[#E5E7EB]">
                        {product.images[0] ? (
                          <Image
                            src={product.images[0].url}
                            alt={product.name}
                            fill
                            sizes="48px"
                            className="object-cover"
                          />
                        ) : null}
                      </div>
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-xs text-[var(--muted)]">{product.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-[var(--muted)]">{product.category.name}</td>
                  <td className="px-5 py-4">{formatCurrency(product.retailPrice)}</td>
                  <td className="px-5 py-4">{formatCurrency(product.wholesalePrice)}</td>
                  <td className="px-5 py-4">
                    {product.variants.reduce((sum, variant) => sum + variant.stock, 0)}
                  </td>
                  <td className="px-5 py-4">{product.active ? "Activo" : "Inactivo"}</td>
                  <td className="px-5 py-4">
                    <div className="flex gap-2">
                      <button className="grid h-9 w-9 place-items-center rounded-lg border border-[var(--border)]">
                        <Pencil size={16} />
                      </button>
                      <button className="grid h-9 w-9 place-items-center rounded-lg border border-[var(--border)]">
                        <Power size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-8 rounded-lg border border-[var(--border)] bg-white p-5">
        <h2 className="font-semibold">Formulario de producto</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {["Nombre", "Slug", "Precio menudeo", "Precio mayoreo", "Minimo mayoreo", "Categoria"].map((label) => (
            <label key={label} className="grid gap-2 text-sm font-medium">
              {label}
              <input className="h-11 rounded-lg border border-[var(--border)] px-3 outline-none focus:border-[var(--primary)]" />
            </label>
          ))}
          <label className="grid gap-2 text-sm font-medium md:col-span-2">
            Descripcion
            <textarea className="min-h-28 rounded-lg border border-[var(--border)] px-3 py-3 outline-none focus:border-[var(--primary)]" />
          </label>
        </div>
      </section>
    </div>
  );
}
