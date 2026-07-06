import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/components/cart/cart-provider";
import { SiteShell } from "@/components/layout/site-shell";
import { AuthProvider } from "@/components/providers/auth-provider";
import { getSession } from "@/lib/session";

export const metadata: Metadata = {
  title: {
    default: "La Linea",
    template: "%s | La Linea"
  },
  description:
    "Tienda en linea de camisas al menudeo y mayoreo con pedidos por WhatsApp.",
  openGraph: {
    title: "La Linea",
    description:
      "Camisas para venta al menudeo y mayoreo con catalogo, carrito y pedidos por WhatsApp.",
    type: "website"
  }
};

export default async function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getSession();
  const user = session ? { kind: session.kind, name: session.name, email: session.email } : null;

  return (
    <html lang="es">
      <body>
        <AuthProvider user={user}>
          <CartProvider>
            <SiteShell>{children}</SiteShell>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
