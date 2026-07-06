import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthPanel } from "@/components/auth/auth-panel";

export const metadata: Metadata = {
  title: "Iniciar sesion",
  description: "Inicia sesion o crea una cuenta en La Linea."
};

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <AuthPanel initialMode="login" />
    </Suspense>
  );
}
