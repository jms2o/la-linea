import type { Metadata } from "next";
import { CartPageClient } from "@/components/cart/cart-page-client";

export const metadata: Metadata = {
  title: "Carrito",
  description: "Resumen del carrito de compra La Linea."
};

export default function CartPage() {
  return <CartPageClient />;
}
