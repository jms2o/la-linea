"use client";

import { LogOut } from "lucide-react";
import { useAuth } from "@/components/providers/auth-provider";

export function LogoutButton() {
  const { logout } = useAuth();

  return (
    <button
      type="button"
      onClick={() => logout()}
      className="inline-flex h-10 items-center gap-2 rounded-lg border border-[var(--border)] px-4 text-sm font-semibold transition-colors hover:border-black"
    >
      <LogOut size={16} /> Cerrar sesion
    </button>
  );
}
