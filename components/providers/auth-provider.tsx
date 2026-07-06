"use client";

import { createContext, useContext, useMemo } from "react";
import { useRouter } from "next/navigation";
import { logout as logoutRequest } from "@/lib/api";

export type AuthUser = {
  kind: "admin" | "customer";
  name: string;
  email: string;
} | null;

type AuthContextValue = {
  user: AuthUser;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({
  user,
  children
}: {
  user: AuthUser;
  children: React.ReactNode;
}) {
  const router = useRouter();

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      logout: async () => {
        await logoutRequest();
        router.push("/login");
        router.refresh();
      }
    }),
    [user, router]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider.");
  }

  return context;
}
