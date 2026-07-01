import { Pencil, Power } from "lucide-react";
import { getCategoriesData } from "@/lib/data";

export default async function AdminCategoriesPage() {
  const categories = await getCategoriesData();

  return (
    <div className="px-4 py-8 sm:px-6 lg:px-8">
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
        Admin
      </p>
      <h1 className="mt-2 text-3xl font-semibold tracking-normal">Categorias</h1>

      <div className="mt-8 grid gap-6 xl:grid-cols-[1fr_360px]">
        <section className="rounded-lg border border-[var(--border)] bg-white">
          <div className="border-b border-[var(--border)] px-5 py-4">
            <h2 className="font-semibold">Listado</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] text-left text-sm">
              <thead className="bg-[#F8F7F4] text-xs uppercase tracking-[0.12em] text-[var(--muted)]">
                <tr>
                  <th className="px-5 py-3">Nombre</th>
                  <th className="px-5 py-3">Slug</th>
                  <th className="px-5 py-3">Estado</th>
                  <th className="px-5 py-3">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((category) => (
                  <tr key={category.id} className="border-t border-[var(--border)]">
                    <td className="px-5 py-4 font-medium">{category.name}</td>
                    <td className="px-5 py-4 text-[var(--muted)]">{category.slug}</td>
                    <td className="px-5 py-4">{category.active ? "Activa" : "Inactiva"}</td>
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
        <section className="rounded-lg border border-[var(--border)] bg-white p-5">
          <h2 className="font-semibold">Crear categoria</h2>
          <div className="mt-5 grid gap-4">
            <label className="grid gap-2 text-sm font-medium">
              Nombre
              <input className="h-11 rounded-lg border border-[var(--border)] px-3 outline-none focus:border-[var(--primary)]" />
            </label>
            <label className="grid gap-2 text-sm font-medium">
              Slug
              <input className="h-11 rounded-lg border border-[var(--border)] px-3 outline-none focus:border-[var(--primary)]" />
            </label>
            <button className="h-11 rounded-lg bg-[var(--primary)] px-4 text-sm font-semibold text-white">
              Guardar categoria
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
