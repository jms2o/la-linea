"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, ShoppingCart, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { useCart } from "@/components/cart/cart-provider";
import { cn } from "@/lib/utils";

const links = [
  { href: "/#inicio", label: "Inicio" },
  { href: "/#nosotros", label: "Nosotros" },
  { href: "/#tienda", label: "Tienda" },
  { href: "/#contacto", label: "Contacto" },
  { href: "/admin/dashboard", label: "Admin" }
];

export function PublicHeader() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  const { itemCount } = useCart();
  const activeHref = pathname === "/" ? "/#inicio" : null;

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-black/10 bg-white/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="text-lg font-semibold tracking-wide">
            La Linea
          </Link>
          <nav
            className="hidden items-center gap-1 text-sm font-medium text-[var(--muted)] md:flex"
            onMouseLeave={() => setHovered(null)}
          >
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onMouseEnter={() => setHovered(link.href)}
                className={cn(
                  "relative rounded-full px-3.5 py-2 transition-colors hover:text-black",
                  activeHref === link.href && "font-semibold text-black"
                )}
              >
                {hovered === link.href || (hovered === null && activeHref === link.href) ? (
                  <motion.span
                    layoutId="nav-hover-pill"
                    className="absolute inset-0 -z-10 rounded-full bg-black/5"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                ) : null}
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <motion.button
              type="button"
              aria-label="Abrir carrito de compras"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="relative flex h-10 items-center gap-2 rounded-full border border-black/10 bg-white px-3 text-black transition-colors hover:border-black sm:px-4"
              onClick={() => setCartOpen(true)}
            >
              <motion.span
                whileHover={{ rotate: [0, -14, 12, -8, 0] }}
                transition={{ duration: 0.5 }}
                className="flex"
              >
                <ShoppingCart size={19} />
              </motion.span>
              <span className="hidden text-sm font-semibold sm:inline">Carrito de compras</span>
              <AnimatePresence>
                {itemCount ? (
                  <motion.span
                    key={itemCount}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 20 }}
                    className="absolute -right-1.5 -top-1.5 grid h-5 min-w-5 place-items-center rounded-full bg-[var(--red)] px-1 text-[11px] font-bold text-white"
                  >
                    {itemCount}
                  </motion.span>
                ) : null}
              </AnimatePresence>
            </motion.button>
            <motion.button
              type="button"
              aria-label="Abrir menu"
              whileTap={{ scale: 0.92 }}
              className="grid h-10 w-10 place-items-center rounded-full border border-black/10 bg-white md:hidden"
              onClick={() => setMenuOpen((value) => !value)}
            >
              {menuOpen ? <X size={19} /> : <Menu size={19} />}
            </motion.button>
          </div>
        </div>
        <AnimatePresence initial={false}>
          {menuOpen ? (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className={cn("overflow-hidden border-t border-black/10 bg-white md:hidden")}
            >
              <nav className="grid gap-1 px-4 py-4 text-sm font-medium">
                {links.map((link, index) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.25 }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setMenuOpen(false)}
                      className={cn(
                        "block rounded-lg px-2 py-2 transition-colors active:bg-black/5",
                        activeHref === link.href && "bg-black/5 font-semibold text-black"
                      )}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
              </nav>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </header>
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}
