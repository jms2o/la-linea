import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/components/cart/cart-provider";
import { SiteShell } from "@/components/layout/site-shell";

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

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>
        <CartProvider>
          <SiteShell>{children}</SiteShell>
        </CartProvider>
      </body>
    </html>
  );
}
