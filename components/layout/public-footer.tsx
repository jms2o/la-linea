"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowUp, Mail, MapPin } from "lucide-react";
import { FaFacebookF, FaInstagram, FaWhatsapp } from "react-icons/fa6";
import { cn } from "@/lib/utils";
import { FadeIn } from "@/components/ui/fade-in";

const MotionAnchor = motion.create("a");

const shopLinks = [
  { href: "/catalogo", label: "Catalogo" },
  { href: "/#mayoreo", label: "Mayoreo" },
  { href: "/checkout", label: "Checkout" },
  { href: "/nosotros", label: "Nosotros" }
];

const contactRows = [
  {
    label: "WhatsApp",
    href: "/checkout",
    icon: FaWhatsapp,
    bg: "bg-[#25D366]",
    external: false
  },
  {
    label: "Instagram",
    href: "https://instagram.com",
    icon: FaInstagram,
    bg: "bg-gradient-to-br from-[#f09433] via-[#e6683c] to-[#bc1888]",
    external: true
  },
  {
    label: "Facebook",
    href: "https://www.facebook.com/profile.php?id=100064229881766",
    icon: FaFacebookF,
    bg: "bg-[#1877F2]",
    external: true
  }
];

export function PublicFooter() {
  return (
    <footer className="relative overflow-hidden bg-black text-white">
      <div className="flex h-1 w-full">
        <div className="w-1/2 bg-[var(--blue)]" />
        <div className="w-1/2 bg-[var(--red)]" />
      </div>

      <div aria-hidden className="pointer-events-none absolute -left-24 top-0 h-72 w-72 rounded-full bg-[var(--blue)]/10 blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-[var(--red)]/10 blur-3xl" />

      <FadeIn className="relative mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
        <div className="grid gap-4 lg:grid-cols-[1.3fr_0.8fr_0.9fr] lg:gap-5">
          <div>
            <Link href="/" className="text-xl font-bold tracking-tight">
              La Linea
            </Link>
            <p className="mt-1.5 max-w-sm text-sm leading-5 text-white/60">
              Tienda de ropa de excelente calidad en Mazatlan, para compra
              individual y paquetes de mayoreo, con atencion clara y pedidos
              por WhatsApp.
            </p>
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-white/40">
              Catalogo
            </p>
            <nav className="mt-2 grid gap-1 text-sm text-white/80">
              {shopLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="nav-underline w-fit transition-colors hover:text-white"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-white/40">
              Contacto
            </p>
            <div className="mt-2 grid gap-1.5 text-sm text-white/70">
              {contactRows.map((row) => (
                <a
                  key={row.label}
                  href={row.href}
                  target={row.external ? "_blank" : undefined}
                  rel={row.external ? "noopener noreferrer" : undefined}
                  className="group flex w-fit items-center gap-2 text-white/70 transition-colors duration-300 hover:text-white"
                >
                  <span className={cn("grid h-5 w-5 place-items-center rounded-full text-white", row.bg)}>
                    <row.icon size={10} />
                  </span>
                  <span className="transition-transform duration-300 group-hover:translate-x-0.5">
                    {row.label}
                  </span>
                </a>
              ))}
              <span className="flex items-center gap-2">
                <span className="grid h-5 w-5 place-items-center rounded-full bg-[var(--blue)] text-white">
                  <Mail size={10} />
                </span>
                ventas@lalinea.local
              </span>
              <span className="flex items-center gap-2">
                <span className="grid h-5 w-5 place-items-center rounded-full bg-[var(--red)] text-white">
                  <MapPin size={10} />
                </span>
                Mazatlan, Sinaloa
              </span>
            </div>
          </div>
        </div>

        <div className="mt-3 flex flex-col items-center gap-1.5 border-t border-white/10 pt-2.5 text-xs text-white/40 sm:flex-row sm:justify-between">
          <span>© {new Date().getFullYear()} La Linea. Todos los derechos reservados.</span>
          <MotionAnchor
            href="#inicio"
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.94 }}
            className="flex items-center gap-1.5 text-white/60 transition-colors hover:text-white"
          >
            Volver arriba <ArrowUp size={14} />
          </MotionAnchor>
        </div>
      </FadeIn>
    </footer>
  );
}
