import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MessageCircle, PackageCheck, Ruler, Shirt, Truck } from "lucide-react";
import { ProductCard } from "@/components/product/product-card";
import { getProductsData, getSettingsData } from "@/lib/data";

export default async function HomePage() {
  const [products, settings] = await Promise.all([
    getProductsData({ activeOnly: true }),
    getSettingsData()
  ]);
  const featured = products.slice(0, 3);
  const whatsappHref = settings.whatsappNumber
    ? `https://wa.me/${settings.whatsappNumber.replace(/[^\d]/g, "")}`
    : "/checkout";

  return (
    <main>
      <section className="relative overflow-hidden bg-white">
        <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-7xl items-center gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
          <div className="max-w-xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--blue)]">
              Camisas al menudeo y mayoreo
            </p>
            <h1 className="mt-5 text-4xl font-semibold leading-tight tracking-normal sm:text-5xl lg:text-6xl">
              La Linea
            </h1>
            <p className="mt-5 text-lg leading-8 text-[var(--muted)]">
              Catalogo claro, precios por volumen y pedidos rapidos por WhatsApp
              para surtir desde una pieza hasta paquetes completos.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/catalogo"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-[var(--primary)] px-6 text-sm font-semibold text-white transition hover:bg-[#1F2937]"
              >
                Ver catalogo <ArrowRight size={18} />
              </Link>
              <Link
                href={whatsappHref}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-lg border border-[var(--primary)] px-6 text-sm font-semibold text-[var(--primary)] transition hover:bg-[#F3F4F6]"
              >
                <MessageCircle size={18} /> Comprar por WhatsApp
              </Link>
            </div>
          </div>
          <div className="relative min-h-[420px] overflow-hidden rounded-lg bg-[#E5E7EB] lg:min-h-[560px]">
            <Image
              src="https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=1400&q=80"
              alt="Camisas modernas La Linea"
              fill
              priority
              sizes="(min-width: 1024px) 55vw, 100vw"
              className="object-cover"
            />
            <div className="absolute bottom-5 left-5 right-5 rounded-lg bg-white/92 p-4 backdrop-blur">
              <p className="text-sm font-semibold">Mayoreo desde pocas piezas</p>
              <p className="mt-1 text-sm text-[var(--muted)]">
                Selecciona talla, color y cantidad; el precio se calcula solo.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[var(--background)] py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
                Destacados
              </p>
              <h2 className="mt-2 text-3xl font-semibold tracking-normal">
                Productos listos para vender
              </h2>
            </div>
            <Link
              href="/catalogo"
              className="inline-flex h-11 items-center gap-2 rounded-lg border border-[var(--border)] bg-white px-4 text-sm font-semibold"
            >
              Ver todo <ArrowRight size={17} />
            </Link>
          </div>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {featured.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      <section id="mayoreo" className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-5 md:grid-cols-4">
            {[
              {
                icon: Shirt,
                title: "Menudeo",
                text: "Compra piezas individuales sin complicar el pedido."
              },
              {
                icon: PackageCheck,
                title: "Mayoreo",
                text: "Precio especial automatico al llegar a la cantidad minima."
              },
              {
                icon: Ruler,
                title: "Variantes",
                text: "Tallas, colores y stock visibles antes de confirmar."
              },
              {
                icon: Truck,
                title: "Entrega",
                text: "Metodo de entrega y notas incluidos en el pedido."
              }
            ].map((benefit) => (
              <div
                key={benefit.title}
                className="rounded-lg border border-[var(--border)] bg-white p-5"
              >
                <benefit.icon size={24} className="text-[var(--blue)]" />
                <h3 className="mt-4 font-semibold">{benefit.title}</h3>
                <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                  {benefit.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="contacto" className="bg-[var(--primary)] py-16 text-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[1fr_auto] lg:items-center lg:px-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#C8A96A]">
              Como comprar
            </p>
            <h2 className="mt-2 text-3xl font-semibold tracking-normal">
              Elige, agrega al carrito y confirma por WhatsApp
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-gray-300">
              El pedido queda con productos, cantidades, variantes y total para
              que la conversacion empiece ordenada.
            </p>
          </div>
          <Link
            href="/checkout"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-white px-6 text-sm font-semibold text-[var(--primary)]"
          >
            Preparar pedido <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </main>
  );
}
