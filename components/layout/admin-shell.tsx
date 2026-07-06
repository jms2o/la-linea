"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Boxes,
  FolderTree,
  LogOut,
  Menu,
  Package,
  Settings,
  Store,
  X
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/components/providers/auth-provider";
import { cn } from "@/lib/utils";

const links = [
  { href: "/admin/dashboard", label: "Dashboard", icon: BarChart3 },
  { href: "/admin/productos", label: "Productos", icon: Package },
  { href: "/admin/categorias", label: "Categorias", icon: FolderTree },
  { href: "/admin/pedidos", label: "Pedidos", icon: Boxes },
  { href: "/admin/configuracion", label: "Configuracion", icon: Settings }
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { logout } = useAuth();

  const sidebar = (
    <aside className="flex h-full w-72 flex-col border-r border-[var(--border)] bg-white">
      <div className="flex h-16 items-center gap-3 border-b border-[var(--border)] px-5">
        <span className="grid h-10 w-10 place-items-center rounded-lg bg-[var(--primary)] text-white">
          <Store size={19} />
        </span>
        <div>
          <p className="font-semibold">La Linea</p>
          <p className="text-xs text-[var(--muted)]">Panel admin</p>
        </div>
      </div>
      <nav className="grid gap-1 p-3">
        {links.map((link) => {
          const active = pathname.startsWith(link.href);
          const Icon = link.icon;

          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className={cn(
                "flex h-11 items-center gap-3 rounded-lg px-3 text-sm font-medium transition",
                active
                  ? "bg-[var(--primary)] text-white"
                  : "text-[var(--muted)] hover:bg-[#F3F4F6] hover:text-[var(--foreground)]"
              )}
            >
              <Icon size={18} />
              {link.label}
            </Link>
          );
        })}
      </nav>
      <div className="mt-auto grid gap-2 border-t border-[var(--border)] p-4">
        <Link
          href="/"
          className="inline-flex h-10 w-full items-center justify-center rounded-lg border border-[var(--border)] text-sm font-semibold"
        >
          Ver tienda
        </Link>
        <button
          type="button"
          onClick={() => logout()}
          className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg border border-[var(--border)] text-sm font-semibold"
        >
          <LogOut size={16} /> Cerrar sesion
        </button>
      </div>
    </aside>
  );

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-[var(--border)] bg-white px-4 lg:hidden">
        <Link href="/admin/dashboard" className="font-semibold">
          La Linea Admin
        </Link>
        <button
          type="button"
          aria-label="Abrir menu admin"
          className="grid h-10 w-10 place-items-center rounded-lg border border-[var(--border)]"
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X size={19} /> : <Menu size={19} />}
        </button>
      </header>

      <div className="flex">
        <div className="fixed inset-y-0 left-0 z-40 hidden lg:block">{sidebar}</div>
        {open ? (
          <div className="fixed inset-0 z-40 lg:hidden">
            <button
              type="button"
              aria-label="Cerrar menu admin"
              className="absolute inset-0 bg-black/40"
              onClick={() => setOpen(false)}
            />
            <div className="absolute inset-y-0 left-0">{sidebar}</div>
          </div>
        ) : null}
        <main className="w-full lg:pl-72">{children}</main>
      </div>
    </div>
  );
}
