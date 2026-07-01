import { getSettingsData } from "@/lib/data";

export default async function AdminSettingsPage() {
  const settings = await getSettingsData();

  return (
    <div className="px-4 py-8 sm:px-6 lg:px-8">
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
        Admin
      </p>
      <h1 className="mt-2 text-3xl font-semibold tracking-normal">Configuracion</h1>

      <section className="mt-8 rounded-lg border border-[var(--border)] bg-white p-5">
        <h2 className="font-semibold">Datos de tienda</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <label className="grid gap-2 text-sm font-medium">
            Nombre de la tienda
            <input
              defaultValue={settings.storeName}
              className="h-11 rounded-lg border border-[var(--border)] px-3 outline-none focus:border-[var(--primary)]"
            />
          </label>
          <label className="grid gap-2 text-sm font-medium">
            Numero de WhatsApp
            <input
              defaultValue={settings.whatsappNumber ?? ""}
              className="h-11 rounded-lg border border-[var(--border)] px-3 outline-none focus:border-[var(--primary)]"
            />
          </label>
          <label className="grid gap-2 text-sm font-medium md:col-span-2">
            Direccion
            <input
              defaultValue={settings.address ?? ""}
              className="h-11 rounded-lg border border-[var(--border)] px-3 outline-none focus:border-[var(--primary)]"
            />
          </label>
          <label className="grid gap-2 text-sm font-medium">
            Facebook
            <input
              defaultValue={settings.facebookUrl ?? ""}
              className="h-11 rounded-lg border border-[var(--border)] px-3 outline-none focus:border-[var(--primary)]"
            />
          </label>
          <label className="grid gap-2 text-sm font-medium">
            Instagram
            <input
              defaultValue={settings.instagramUrl ?? ""}
              className="h-11 rounded-lg border border-[var(--border)] px-3 outline-none focus:border-[var(--primary)]"
            />
          </label>
          <label className="grid gap-2 text-sm font-medium">
            Costo de envio
            <input
              defaultValue={settings.shippingCost}
              className="h-11 rounded-lg border border-[var(--border)] px-3 outline-none focus:border-[var(--primary)]"
            />
          </label>
          <label className="grid gap-2 text-sm font-medium md:col-span-2">
            Mensaje personalizado
            <textarea
              defaultValue={settings.orderMessage ?? ""}
              className="min-h-28 rounded-lg border border-[var(--border)] px-3 py-3 outline-none focus:border-[var(--primary)]"
            />
          </label>
        </div>
        <button className="mt-5 h-11 rounded-lg bg-[var(--primary)] px-5 text-sm font-semibold text-white">
          Guardar configuracion
        </button>
      </section>
    </div>
  );
}
