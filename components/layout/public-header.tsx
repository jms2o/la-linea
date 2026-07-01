"use client";

import Link from "next/link";
import { Menu, ShoppingBag, X } from "lucide-react";
import { useState } from "react";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { useCart } from "@/components/cart/cart-provider";
import { cn } from "@/lib/utils";

const links = [
  { href: "/", label: "Inicio" },
  { href: "/catalogo", label: "Catalogo" },
  { href: "/#mayoreo", label: "Mayoreo" },
  { href: "/#contacto", label: "Contacto" }
];

export function PublicHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const { itemCount } = useCart();

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-[var(--border)] bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="text-lg font-semibold tracking-wide">
            La Linea
          </Link>
          <nav className="hidden items-center gap-7 text-sm font-medium text-[var(--muted)] md:flex">
            {links.map((link) => (
              <Link key={link.href} href={link.href} className="hover:text-[var(--foreground)]">
                {link.label}
              </Link>
            ))}
            <Link href="/admin/dashboard" className="hover:text-[var(--foreground)]">
              Admin
            </Link>
          </nav>
          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label="Abrir carrito"
              className="relative grid h-10 w-10 place-items-center rounded-lg border border-[var(--border)] bg-white text-[var(--foreground)] transition hover:border-[#D1D5DB]"
              onClick={() => setCartOpen(true)}
            >
              <ShoppingBag size={19} />
              {itemCount ? (
                <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-[var(--accent)] px-1 text-[11px] font-bold text-[var(--foreground)]">
                  {itemCount}
                </span>
              ) : null}
            </button>
            <button
              type="button"
              aria-label="Abrir menu"
              className="grid h-10 w-10 place-items-center rounded-lg border border-[var(--border)] bg-white md:hidden"
              onClick={() => setMenuOpen((value) => !value)}
            >
              {menuOpen ? <X size={19} /> : <Menu size={19} />}
            </button>
          </div>
        </div>
        <div
          className={cn(
            "border-t border-[var(--border)] bg-white px-4 py-4 md:hidden",
            menuOpen ? "block" : "hidden"
          )}
        >
          <nav className="grid gap-3 text-sm font-medium">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link href="/admin/dashboard" onClick={() => setMenuOpen(false)}>
              Admin
            </Link>
          </nav>
        </div>
      </header>
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}
