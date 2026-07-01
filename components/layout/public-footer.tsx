"use client";

import Link from "next/link";
import { Camera, Mail, MapPin, MessageCircle } from "lucide-react";

export function PublicFooter() {
  return (
    <footer className="border-t border-[var(--border)] bg-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1.2fr_0.8fr_0.8fr] lg:px-8">
        <div>
          <Link href="/" className="text-xl font-semibold tracking-wide">
            La Linea
          </Link>
          <p className="mt-3 max-w-md text-sm leading-6 text-[var(--muted)]">
            Camisas para compra individual y paquetes de mayoreo, con atencion
            clara y pedidos por WhatsApp.
          </p>
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
            Tienda
          </p>
          <nav className="mt-4 grid gap-2 text-sm">
            <Link href="/catalogo">Catalogo</Link>
            <Link href="/#mayoreo">Mayoreo</Link>
            <Link href="/checkout">Checkout</Link>
          </nav>
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
            Contacto
          </p>
          <div className="mt-4 grid gap-3 text-sm text-[var(--muted)]">
            <span className="flex items-center gap-2">
              <MessageCircle size={16} /> WhatsApp
            </span>
            <span className="flex items-center gap-2">
              <Camera size={16} /> Instagram
            </span>
            <span className="flex items-center gap-2">
              <Mail size={16} /> ventas@lalinea.local
            </span>
            <span className="flex items-center gap-2">
              <MapPin size={16} /> Chihuahua, Mexico
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
