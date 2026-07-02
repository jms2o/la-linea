import type { Metadata } from "next";
import { Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { FaFacebookF, FaInstagram, FaWhatsapp } from "react-icons/fa6";
import { AnimatedButton } from "@/components/ui/animated-button";
import { FadeIn } from "@/components/ui/fade-in";
import { HoverScale } from "@/components/ui/hover-scale";
import { IconWiggle } from "@/components/ui/icon-wiggle";
import { Pulse } from "@/components/ui/pulse";

export const metadata: Metadata = {
  title: "Contacto",
  description: "Contacto de La Linea, tienda de ropa en Mazatlan: direccion, telefono, horario y redes sociales."
};

const infoCards = [
  {
    icon: MapPin,
    title: "Direccion",
    lines: ["Av. del Mar 1245, Zona Dorada", "Mazatlan, Sinaloa, C.P. 82110"]
  },
  {
    icon: Phone,
    title: "Telefono y WhatsApp",
    lines: ["+52 669 123 4567"]
  },
  {
    icon: Mail,
    title: "Correo",
    lines: ["contacto@lalinea.mx"]
  },
  {
    icon: Clock,
    title: "Horario",
    lines: ["Lunes a sabado: 10:00 - 20:00", "Domingo: 11:00 - 17:00"]
  }
];

const socialRows = [
  {
    label: "WhatsApp",
    href: "https://wa.me/526691234567",
    icon: FaWhatsapp,
    bg: "bg-[#25D366]"
  },
  {
    label: "Instagram",
    href: "https://instagram.com/lalinea.mx",
    icon: FaInstagram,
    bg: "bg-gradient-to-br from-[#f09433] via-[#e6683c] to-[#bc1888]"
  },
  {
    label: "Facebook",
    href: "https://www.facebook.com/profile.php?id=100064229881766",
    icon: FaFacebookF,
    bg: "bg-[#1877F2]"
  }
];

export default function ContactoPage() {
  return (
    <main className="relative overflow-hidden bg-white py-16 sm:py-24">
      <div
        aria-hidden
        className="float-slow absolute -left-24 top-0 h-72 w-72 rounded-full bg-[var(--blue)]/10 blur-3xl"
      />
      <div
        aria-hidden
        className="float-slow-delay absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-[var(--red)]/10 blur-3xl"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeIn className="max-w-2xl">
          <div className="mb-4 h-1.5 w-16 rounded-full bg-[var(--blue)]" />
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
            Contacto
          </p>
          <h1 className="mt-2 text-4xl font-bold tracking-tight sm:text-5xl">
            Escribenos, estamos en Mazatlan
          </h1>
          <p className="mt-4 text-base leading-7 text-[var(--muted)]">
            Resolvemos dudas sobre tallas, colores, mayoreo y envios. La forma
            mas rapida de recibir respuesta es por WhatsApp.
          </p>
          <div className="mt-6">
            <Pulse className="inline-block">
              <AnimatedButton href="https://wa.me/526691234567" variant="whatsapp">
                <MessageCircle size={18} /> Escribir por WhatsApp
              </AnimatedButton>
            </Pulse>
          </div>
        </FadeIn>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {infoCards.map((card, index) => (
            <FadeIn key={card.title} delay={index * 0.08}>
              <HoverScale scale={1.03} className="h-full rounded-2xl border border-black/10 bg-[var(--background)] p-5 shadow-sm">
                <IconWiggle className="grid h-11 w-11 place-items-center rounded-full bg-[var(--blue)]/10 text-[var(--blue)]">
                  <card.icon size={20} />
                </IconWiggle>
                <h3 className="mt-4 font-semibold">{card.title}</h3>
                <div className="mt-2 grid gap-0.5 text-sm leading-6 text-[var(--muted)]">
                  {card.lines.map((line) => (
                    <p key={line}>{line}</p>
                  ))}
                </div>
              </HoverScale>
            </FadeIn>
          ))}
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-stretch">
          <FadeIn>
            <div className="h-full rounded-2xl border border-black/10 bg-[var(--background)] p-6">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
                Siguenos
              </p>
              <div className="mt-4 grid gap-3">
                {socialRows.map((row) => (
                  <HoverScale key={row.label} scale={1.02}>
                    <a
                      href={row.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center gap-3 rounded-xl border border-black/10 bg-white p-3 text-sm font-medium transition-colors hover:border-black/20"
                    >
                      <IconWiggle className={`grid h-9 w-9 place-items-center rounded-full text-white ${row.bg}`}>
                        <row.icon size={16} />
                      </IconWiggle>
                      {row.label}
                    </a>
                  </HoverScale>
                ))}
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={0.1}>
            <HoverScale scale={1.015} className="h-full min-h-[280px] overflow-hidden rounded-2xl border border-black/10 shadow-sm">
              <iframe
                title="Ubicacion La Linea en Mazatlan"
                src="https://www.google.com/maps?q=Mazatlan,Sinaloa&output=embed"
                className="h-full min-h-[280px] w-full"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </HoverScale>
          </FadeIn>
        </div>
      </div>
    </main>
  );
}
