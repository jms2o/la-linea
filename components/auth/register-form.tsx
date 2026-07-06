"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { UserPlus } from "lucide-react";
import { motion } from "motion/react";
import { FormEvent, useState } from "react";
import { registerCustomer } from "@/lib/api";

type Gender = "MALE" | "FEMALE" | "OTHER";

type Fields = {
  name: string;
  gender: Gender;
  phone: string;
  email: string;
  password: string;
  confirmPassword: string;
};

const initialFields: Fields = {
  name: "",
  gender: "MALE",
  phone: "",
  email: "",
  password: "",
  confirmPassword: ""
};

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } }
};

const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] as const } }
};

export function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next");

  const [fields, setFields] = useState<Fields>(initialFields);
  const [status, setStatus] = useState<"idle" | "submitting" | "error">("idle");
  const [error, setError] = useState("");

  function updateField<K extends keyof Fields>(name: K, value: Fields[K]) {
    setFields((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (fields.password !== fields.confirmPassword) {
      setStatus("error");
      setError("Las contrasenas no coinciden.");
      return;
    }

    setStatus("submitting");

    try {
      const result = await registerCustomer({
        name: fields.name,
        gender: fields.gender,
        phone: fields.phone,
        email: fields.email,
        password: fields.password
      });
      router.push(next ?? result.redirectTo);
      router.refresh();
    } catch (submitError) {
      setStatus("error");
      setError(
        submitError instanceof Error
          ? submitError.message
          : "No se pudo crear la cuenta."
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
      <div className="grid gap-4 sm:grid-cols-2">
        <motion.label variants={item} className="grid gap-2 text-sm font-medium">
          Nombre
          <input
            value={fields.name}
            onChange={(event) => updateField("name", event.target.value)}
            className="h-12 rounded-lg border border-[var(--border)] px-3 outline-none focus:border-[var(--primary)]"
            required
          />
        </motion.label>
        <motion.label variants={item} className="grid gap-2 text-sm font-medium">
          Sexo
          <select
            value={fields.gender}
            onChange={(event) => updateField("gender", event.target.value as Gender)}
            className="h-12 rounded-lg border border-[var(--border)] bg-white px-3 outline-none focus:border-[var(--primary)]"
          >
            <option value="MALE">Masculino</option>
            <option value="FEMALE">Femenino</option>
            <option value="OTHER">Otro</option>
          </select>
        </motion.label>
        <motion.label variants={item} className="grid gap-2 text-sm font-medium">
          Telefono
          <input
            value={fields.phone}
            onChange={(event) => updateField("phone", event.target.value)}
            className="h-12 rounded-lg border border-[var(--border)] px-3 outline-none focus:border-[var(--primary)]"
            required
          />
        </motion.label>
        <motion.label variants={item} className="grid gap-2 text-sm font-medium">
          Correo
          <input
            type="email"
            value={fields.email}
            onChange={(event) => updateField("email", event.target.value)}
            className="h-12 rounded-lg border border-[var(--border)] px-3 outline-none focus:border-[var(--primary)]"
            required
          />
        </motion.label>
        <motion.label variants={item} className="grid gap-2 text-sm font-medium">
          Contrasena
          <input
            type="password"
            value={fields.password}
            onChange={(event) => updateField("password", event.target.value)}
            className="h-12 rounded-lg border border-[var(--border)] px-3 outline-none focus:border-[var(--primary)]"
            required
            minLength={8}
          />
        </motion.label>
        <motion.label variants={item} className="grid gap-2 text-sm font-medium">
          Confirmar contrasena
          <input
            type="password"
            value={fields.confirmPassword}
            onChange={(event) => updateField("confirmPassword", event.target.value)}
            className="h-12 rounded-lg border border-[var(--border)] px-3 outline-none focus:border-[var(--primary)]"
            required
            minLength={8}
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
          <UserPlus size={18} /> {status === "submitting" ? "Creando cuenta" : "Crear cuenta"}
        </span>
      </motion.button>
    </motion.form>
  );
}
