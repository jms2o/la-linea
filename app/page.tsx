import {
  ArrowRight,
  MessageCircle,
  PackageCheck,
  Ruler,
  ShoppingBag,
  Shirt,
  Truck
} from "lucide-react";
import Image from "next/image";
import { ShirtScrollHero } from "@/components/home/shirt-scroll-hero";
import { AnimatedButton } from "@/components/ui/animated-button";
import { FadeIn } from "@/components/ui/fade-in";
import { getSettingsData } from "@/lib/data";

const benefits = [
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
];

export default async function HomePage() {
  const settings = await getSettingsData();
  const whatsappHref = settings.whatsappNumber
    ? `https://wa.me/${settings.whatsappNumber.replace(/[^\d]/g, "")}`
    : "/checkout";

  return (
    <main>
      <ShirtScrollHero whatsappHref={whatsappHref} />

      <section className="relative overflow-hidden bg-white py-20 sm:py-28">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:items-center lg:px-8">
          <FadeIn>
            <div className="relative">
              <div
                aria-hidden
                className="float-slow absolute -left-8 -top-8 -z-10 h-40 w-40 rounded-full bg-[var(--blue)]/15 blur-3xl"
              />
              <div
                aria-hidden
                className="float-slow-delay absolute -bottom-8 -right-8 -z-10 h-48 w-48 rounded-full bg-[var(--red)]/15 blur-3xl"
              />
              <div className="relative min-h-[320px] overflow-hidden rounded-2xl shadow-xl ring-1 ring-black/5 lg:min-h-[420px]">
                <Image
                  src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&w=1200&q=80"
                  alt="Equipo La Linea"
                  fill
                  sizes="(min-width: 1024px) 45vw, 100vw"
                  className="object-cover"
                />
              </div>
            </div>
          </FadeIn>
          <FadeIn delay={0.1}>
            <div className="mb-4 h-1.5 w-16 rounded-full bg-[var(--blue)]" />
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
              Nosotros
            </p>
            <h2 className="mt-2 text-4xl font-bold tracking-tight sm:text-5xl">
              Ropa de excelente calidad desde Mazatlan
            </h2>
            <p className="mt-4 text-base leading-7 text-[var(--muted)]">
              Somos una tienda de ropa en Mazatlan enfocada en calidad,
              catalogo claro y precios que se ajustan segun la cantidad. Sin
              intermediarios ni procesos complicados: el pedido se arma y se
              confirma por WhatsApp.
            </p>
            <AnimatedButton href="/nosotros" variant="outline" className="mt-6 h-11 px-5">
              Conocer mas <ArrowRight size={17} />
            </AnimatedButton>
          </FadeIn>
        </div>
      </section>

      <section className="bg-[var(--background)]">
        <FadeIn className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative flex flex-col items-center overflow-hidden rounded-2xl border border-dashed border-black/15 bg-white px-4 py-10 text-center">
            <div
              aria-hidden
              className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_20%,var(--red)_0%,transparent_60%)] opacity-10"
            />
            <div className="float-slow grid h-16 w-16 place-items-center rounded-full bg-[var(--red)]/10">
              <ShoppingBag size={26} className="text-[var(--red)]" />
            </div>
            <p className="mt-5 text-sm font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
              Catalogo
            </p>
            <h2 className="mt-2 text-4xl font-bold tracking-tight sm:text-5xl">
              Descubre todas nuestras prendas
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-6 text-[var(--muted)]">
              Menudeo, mayoreo, tallas y colores disponibles en un solo lugar.
            </p>
            <AnimatedButton href="/catalogo" className="mt-6 h-11 px-6">
              Ver catalogo <ArrowRight size={17} />
            </AnimatedButton>
          </div>
        </FadeIn>
      </section>

      <section id="mayoreo" className="bg-white py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="mb-4 h-1.5 w-16 rounded-full bg-[var(--red)]" />
            <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Compra a tu manera
            </h2>
          </FadeIn>
          <div className="mt-8 grid gap-5 md:grid-cols-4">
            {benefits.map((benefit, index) => (
              <FadeIn key={benefit.title} delay={index * 0.08}>
                <div className="group relative h-full overflow-hidden rounded-2xl border border-black/10 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:rotate-1 hover:border-transparent hover:shadow-2xl">
                  <div
                    aria-hidden
                    className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-[var(--red)] transition-transform duration-300 group-hover:scale-x-100"
                  />
                  <div className="grid h-11 w-11 place-items-center rounded-full bg-[var(--blue)]/10 text-[var(--blue)] transition-all duration-300 group-hover:-rotate-6 group-hover:bg-[var(--red)] group-hover:text-white">
                    <benefit.icon size={22} />
                  </div>
                  <h3 className="mt-4 font-semibold">{benefit.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                    {benefit.text}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <section id="como-comprar" className="relative overflow-hidden bg-white py-20 sm:py-28">
        <div
          aria-hidden
          className="float-slow absolute -left-24 top-0 h-72 w-72 rounded-full bg-[#25D366]/10 blur-3xl"
        />
        <div
          aria-hidden
          className="float-slow-delay absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-[#25D366]/10 blur-3xl"
        />
        <FadeIn className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <div className="mb-3 inline-flex h-11 w-11 items-center justify-center rounded-full bg-[#25D366]">
                <MessageCircle size={22} className="text-white" />
              </div>
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#25D366]">
                Como comprar
              </p>
              <h2 className="mt-2 text-4xl font-bold tracking-tight sm:text-5xl">
                Elige, agrega al carrito y confirma por WhatsApp
              </h2>
              <p className="mt-4 max-w-2xl text-sm leading-6 text-[var(--muted)]">
                El pedido queda con productos, cantidades, variantes y total para
                que la conversacion empiece ordenada, lista para mandarse por WhatsApp.
              </p>
              <AnimatedButton href="/contacto" variant="outline" className="mt-5 h-11 px-5">
                Ver datos de contacto <ArrowRight size={17} />
              </AnimatedButton>
            </div>
            <AnimatedButton href="/checkout" variant="whatsapp">
              <MessageCircle size={18} /> Preparar pedido por WhatsApp
            </AnimatedButton>
          </div>
        </FadeIn>
      </section>
    </main>
  );
}
