"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { LogIn } from "lucide-react";
import { motion } from "motion/react";
import { FormEvent, useState } from "react";
import { login } from "@/lib/api";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } }
};

const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] as const } }
};

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "error">("idle");
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    setError("");

    try {
      const result = await login({ email, password });
      const destination = result.kind === "customer" && next ? next : result.redirectTo;
      router.push(destination);
      router.refresh();
    } catch (submitError) {
      setStatus("error");
      setError(
        submitError instanceof Error
          ? submitError.message
          : "No se pudo iniciar sesion."
      );
    }
  }

  return (
    <motion.form
      onSubmit={handleSubmit}
      variants={container}
      initial="hidden"
      animate="show"
      className="mt-8 rounded-lg border border-[var(--border)] bg-white p-6"
    >
      <div className="grid gap-4">
        <motion.label variants={item} className="grid gap-2 text-sm font-medium">
          Correo
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="h-12 rounded-lg border border-[var(--border)] px-3 outline-none focus:border-[var(--primary)]"
            required
          />
        </motion.label>
        <motion.label variants={item} className="grid gap-2 text-sm font-medium">
          Contrasena
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="h-12 rounded-lg border border-[var(--border)] px-3 outline-none focus:border-[var(--primary)]"
            required
            minLength={6}
          />
        </motion.label>
      </div>

      {error ? (
        <motion.p
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {error}
        </motion.p>
      ) : null}

      <motion.button
        variants={item}
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.97 }}
        type="submit"
        disabled={status === "submitting"}
        className="group relative mt-6 inline-flex h-12 w-full items-center justify-center gap-2 overflow-hidden rounded-lg bg-[var(--primary)] px-5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
      >
        <span
          aria-hidden
          className="absolute inset-0 origin-left scale-x-0 bg-white transition-transform duration-300 ease-out group-hover:scale-x-100"
        />
        <span className="relative z-10 flex items-center gap-2 transition-colors duration-300 group-hover:text-black">
          <LogIn size={18} /> {status === "submitting" ? "Entrando" : "Iniciar sesion"}
        </span>
      </motion.button>
    </motion.form>
  );
}
