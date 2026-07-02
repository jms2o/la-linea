import type { Metadata } from "next";
import Image from "next/image";
import { CheckCircle2, MapPin, ShieldCheck, Sparkles } from "lucide-react";
import { FadeIn } from "@/components/ui/fade-in";
import { HoverScale } from "@/components/ui/hover-scale";
import { IconWiggle } from "@/components/ui/icon-wiggle";
import { StaggerItem, StaggerList } from "@/components/ui/stagger-list";

export const metadata: Metadata = {
  title: "Nosotros",
  description:
    "La Linea es una tienda de ropa en Mazatlan enfocada en calidad, tallas reales y atencion directa por WhatsApp."
};

const stats = [
  { label: "Ciudad", value: "Mazatlan" },
  { label: "Enfoque", value: "Calidad" },
  { label: "Pedidos", value: "Menudeo y mayoreo" }
];

const values = [
  {
    icon: ShieldCheck,
    title: "Calidad garantizada",
    text: "Telas seleccionadas y confeccion revisada antes de cada envio."
  },
  {
    icon: Sparkles,
    title: "Estilo para todos",
    text: "Prendas versatiles para uso diario, negocio o reventa."
  },
  {
    icon: MapPin,
    title: "Raices en Mazatlan",
    text: "Somos una tienda local que crece llevando ropa de calidad a mas clientes."
  }
];

export default function NosotrosPage() {
  return (
    <main className="bg-white">
      <section className="relative overflow-hidden pb-4 pt-6 sm:pb-6 sm:pt-10">
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
              <HoverScale scale={1.02} className="relative min-h-[320px] overflow-hidden rounded-2xl shadow-xl ring-1 ring-black/5 lg:min-h-[460px]">
                <Image
                  src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&w=1200&q=80"
                  alt="Equipo La Linea"
                  fill
                  sizes="(min-width: 1024px) 45vw, 100vw"
                  className="object-cover"
                />
              </HoverScale>
            </div>
          </FadeIn>
          <FadeIn delay={0.1}>
            <div className="mb-4 h-1.5 w-16 rounded-full bg-[var(--blue)]" />
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
              Nosotros
            </p>
            <h1 className="mt-2 text-4xl font-bold tracking-tight sm:text-5xl">
              Ropa de excelente calidad, hecha en Mazatlan
            </h1>
            <p className="mt-4 text-base leading-7 text-[var(--muted)]">
              La Linea es una tienda de ropa ubicada en Mazatlan, Sinaloa. Nacimos
              para surtir a comerciantes y clientes finales con prendas de
              excelente calidad, catalogo claro, tallas y colores disponibles y
              precios que se ajustan segun la cantidad. Sin intermediarios ni
              procesos complicados: el pedido se arma y se confirma por
              WhatsApp.
            </p>
            <StaggerList className="mt-6 grid gap-3">
              {[
                "Prendas seleccionadas por su calidad y durabilidad",
                "Catalogo actualizado con tallas, colores y stock reales",
                "Precios por volumen calculados de forma automatica",
                "Atencion directa desde Mazatlan y pedidos por WhatsApp"
              ].map((item) => (
                <StaggerItem key={item} className="flex items-start gap-3 text-sm text-[var(--foreground)]">
                  <CheckCircle2 size={20} className="mt-0.5 shrink-0 text-[var(--blue)]" />
                  {item}
                </StaggerItem>
              ))}
            </StaggerList>

            <div className="mt-8 grid grid-cols-3 gap-4 border-t border-black/10 pt-6">
              {stats.map((stat, index) => (
                <FadeIn key={stat.label} delay={index * 0.1} y={14}>
                  <p className="text-lg font-bold tracking-tight sm:text-xl">{stat.value}</p>
                  <p className="text-xs uppercase tracking-[0.14em] text-[var(--muted)]">
                    {stat.label}
                  </p>
                </FadeIn>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      <section className="bg-[var(--background)] pb-6 pt-0 sm:pb-8 sm:pt-0">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="mb-4 h-1.5 w-16 rounded-full bg-[var(--red)]" />
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Lo que nos representa
            </h2>
          </FadeIn>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {values.map((value, index) => (
              <FadeIn key={value.title} delay={index * 0.08}>
                <div className="group relative h-full overflow-hidden rounded-2xl border border-black/10 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:rotate-1 hover:border-transparent hover:shadow-2xl">
                  <div
                    aria-hidden
                    className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-[var(--blue)] transition-transform duration-300 group-hover:scale-x-100"
                  />
                  <IconWiggle className="grid h-11 w-11 place-items-center rounded-full bg-[var(--red)]/10 text-[var(--red)] transition-colors duration-300 group-hover:bg-[var(--blue)] group-hover:text-white">
                    <value.icon size={22} />
                  </IconWiggle>
                  <h3 className="mt-4 font-semibold">{value.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{value.text}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
