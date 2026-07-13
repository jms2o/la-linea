"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { X } from "lucide-react";
import { updateOrderStatus } from "@/lib/api";

type CancelOrderButtonProps = {
  orderId: string;
};

export function CancelOrderButton({ orderId }: CancelOrderButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleCancel() {
    if (!window.confirm("Seguro que quieres cancelar este pedido?")) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      await updateOrderStatus(orderId, "CANCELLED");
      router.refresh();
    } catch {
      setError("No se pudo cancelar el pedido. Intenta de nuevo.");
      setLoading(false);
    }
  }

  return (
    <div className="mt-3">
      <motion.button
        type="button"
        onClick={handleCancel}
        disabled={loading}
        whileHover={loading ? undefined : { y: -1 }}
        whileTap={loading ? undefined : { scale: 0.96 }}
        transition={{ type: "spring", stiffness: 420, damping: 26 }}
        className="inline-flex h-9 items-center gap-1 rounded-lg border border-red-200 px-3 text-xs font-semibold text-red-700 transition-colors hover:border-red-400 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <X size={14} /> {loading ? "Cancelando..." : "Cancelar pedido"}
      </motion.button>
      {error ? <p className="mt-1 text-xs text-red-600">{error}</p> : null}
    </div>
  );
}
