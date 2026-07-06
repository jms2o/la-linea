"use client";

import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { MessageCircle, Shirt, Truck } from "lucide-react";
import { useState } from "react";
import { LoginForm } from "@/components/auth/login-form";
import { RegisterForm } from "@/components/auth/register-form";
import { cn } from "@/lib/utils";

type Mode = "login" | "register";

const COPY: Record<Mode, { title: string; description: string }> = {
  login: {
    title: "Iniciar sesion",
    description:
      "Accede para hacer pedidos, ver tu historial o entrar al panel de administracion."
  },
  register: {
    title: "Crear cuenta",
    description: "Registrate para poder hacer pedidos y ver tu historial de compras."
  }
};

const highlights = [
  { icon: Shirt, label: "Menudeo y mayoreo" },
  { icon: Truck, label: "Entrega en Mazatlan" },
  { icon: MessageCircle, label: "Pedidos por WhatsApp" }
];

export function AuthPanel({ initialMode }: { initialMode: Mode }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [mode, setMode] = useState<Mode>(
    searchParams.get("mode") === "register" ? "register" : initialMode
  );

  function switchMode(next: Mode) {
    setMode(next);
    const params = new URLSearchParams(searchParams.toString());
    params.set("mode", next);
    router.replace(`${pathname === "/registro" ? "/login" : pathname}?${params.toString()}`, {
      scroll: false
    });
  }

  const copy = COPY[mode];

  return (
    <main className="min-h-screen bg-[var(--background)]">
      <div className="mx-auto grid min-h-screen max-w-7xl md:grid-cols-2">
        <div className="relative hidden overflow-hidden md:sticky md:top-0 md:flex md:h-screen md:flex-col md:justify-center md:px-16 md:pb-40">
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 max-w-md"
          >
            <Link href="/" className="text-lg font-semibold tracking-wide">
              La Linea
            </Link>
            <h2 className="mt-6 text-4xl font-bold leading-tight tracking-tight">
              Camisas al menudeo y mayoreo
            </h2>
            <p className="mt-4 text-base leading-7 text-[var(--muted)]">
              Catalogo claro, precios por volumen y pedidos rapidos por WhatsApp
              para surtir desde una pieza hasta paquetes completos.
            </p>
            <ul className="mt-8 grid gap-4">
              {highlights.map(({ icon: Icon, label }, index) => (
                <motion.li
                  key={label}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 + index * 0.1, duration: 0.4 }}
                  className="flex items-center gap-3 text-sm font-semibold"
                >
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-white text-[var(--blue)] shadow-sm">
                    <Icon size={18} />
                  </span>
                  {label}
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>

        <div className="flex items-start justify-center px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="w-full max-w-md"
          >
            <div className="relative grid grid-cols-2 rounded-full border border-[var(--border)] bg-white p-1 text-sm font-semibold">
              {(["login", "register"] as Mode[]).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => switchMode(tab)}
                  className={cn(
                    "relative z-10 flex h-10 items-center justify-center rounded-full transition-colors",
                    mode === tab ? "text-white" : "text-[var(--muted)] hover:text-black"
                  )}
                >
                  {mode === tab ? (
                    <motion.span
                      layoutId="auth-tab-pill"
                      className="absolute inset-0 -z-10 rounded-full bg-[var(--primary)]"
                      transition={{ type: "spring", stiffness: 420, damping: 32 }}
                    />
                  ) : null}
                  {tab === "login" ? "Iniciar sesion" : "Crear cuenta"}
                </button>
              ))}
            </div>

            <motion.div
              layout="size"
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="mt-6 overflow-hidden"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={mode}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -14 }}
                  transition={{ duration: 0.25, ease: "easeInOut" }}
                >
                  <h1 className="text-4xl font-semibold tracking-normal">{copy.title}</h1>
                  <p className="mt-4 text-base leading-7 text-[var(--muted)]">
                    {copy.description}
                  </p>
                  {mode === "login" ? <LoginForm /> : <RegisterForm />}
                </motion.div>
              </AnimatePresence>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
