"use client";

import Link from "next/link";
import { MessageCircle, Send } from "lucide-react";
import { FormEvent, useState } from "react";
import { CartItem } from "@/components/cart/cart-item";
import { CartSummary } from "@/components/cart/cart-summary";
import { useCart } from "@/components/cart/cart-provider";
import { createOrder } from "@/lib/api";
import { createOrderInputSchema } from "@/lib/validations";
import type { OrderDTO } from "@/types";

type CheckoutFields = {
  name: string;
  phone: string;
  address: string;
  city: string;
  deliveryMethod: string;
  notes: string;
};

const initialFields: CheckoutFields = {
  name: "",
  phone: "",
  address: "",
  city: "",
  deliveryMethod: "Entrega local",
  notes: ""
};

type CheckoutFormProps = {
  initialCustomer?: Partial<CheckoutFields>;
};

export function CheckoutForm({ initialCustomer }: CheckoutFormProps) {
  const cart = useCart();
  const [fields, setFields] = useState<CheckoutFields>({
    ...initialFields,
    ...initialCustomer
  });
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [error, setError] = useState("");
  const [order, setOrder] = useState<OrderDTO | null>(null);

  function updateField(name: keyof CheckoutFields, value: string) {
    setFields((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const payload = {
      customer: {
        name: fields.name,
        phone: fields.phone,
        address: fields.address || undefined,
        city: fields.city || undefined,
        notes: fields.notes || undefined
      },
      deliveryMethod: fields.deliveryMethod,
      notes: fields.notes || undefined,
      items: cart.items.map((item) => ({
        productId: item.productId,
        productVariantId: item.productVariantId,
        quantity: item.quantity
      }))
    };

    const parsed = createOrderInputSchema.safeParse(payload);

    if (!parsed.success) {
      setStatus("error");
      setError("Revisa tus datos y agrega al menos un producto al carrito.");
      return;
    }

    setStatus("submitting");

    try {
      const createdOrder = await createOrder(parsed.data);
      setOrder(createdOrder);
      setStatus("success");
      cart.clearCart();
    } catch {
      setStatus("error");
      setError("No se pudo crear el pedido. Intenta de nuevo.");
    }
  }

  if (!cart.items.length && !order) {
    return (
      <div className="mt-8 rounded-lg border border-dashed border-[var(--border)] bg-white px-6 py-16 text-center">
        <h2 className="text-xl font-semibold">No hay productos para confirmar</h2>
        <p className="mt-3 text-sm text-[var(--muted)]">
          Agrega productos al carrito antes de continuar.
        </p>
        <Link
          href="/catalogo"
          className="mt-6 inline-flex h-11 items-center justify-center rounded-lg bg-[var(--primary)] px-5 text-sm font-semibold text-white"
        >
          Ver catalogo
        </Link>
      </div>
    );
  }

  return (
    <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_420px]">
      <form
        onSubmit={handleSubmit}
        className="rounded-lg border border-[var(--border)] bg-white p-5"
      >
        <h2 className="text-lg font-semibold">Datos del cliente</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <label className="grid gap-2 text-sm font-medium">
            Nombre
            <input
              value={fields.name}
              onChange={(event) => updateField("name", event.target.value)}
              className="h-12 rounded-lg border border-[var(--border)] px-3 outline-none focus:border-[var(--primary)]"
              required
            />
          </label>
          <label className="grid gap-2 text-sm font-medium">
            Telefono
            <input
              value={fields.phone}
              onChange={(event) => updateField("phone", event.target.value)}
              className="h-12 rounded-lg border border-[var(--border)] px-3 outline-none focus:border-[var(--primary)]"
              required
            />
          </label>
          <label className="grid gap-2 text-sm font-medium sm:col-span-2">
            Direccion
            <input
              value={fields.address}
              onChange={(event) => updateField("address", event.target.value)}
              className="h-12 rounded-lg border border-[var(--border)] px-3 outline-none focus:border-[var(--primary)]"
            />
          </label>
          <label className="grid gap-2 text-sm font-medium">
            Ciudad
            <input
              value={fields.city}
              onChange={(event) => updateField("city", event.target.value)}
              className="h-12 rounded-lg border border-[var(--border)] px-3 outline-none focus:border-[var(--primary)]"
            />
          </label>
          <label className="grid gap-2 text-sm font-medium">
            Metodo de entrega
            <select
              value={fields.deliveryMethod}
              onChange={(event) => updateField("deliveryMethod", event.target.value)}
              className="h-12 rounded-lg border border-[var(--border)] bg-white px-3 outline-none focus:border-[var(--primary)]"
            >
              <option>Entrega local</option>
              <option>Enviar por paqueteria</option>
              <option>Recoger en tienda</option>
            </select>
          </label>
          <label className="grid gap-2 text-sm font-medium sm:col-span-2">
            Notas adicionales
            <textarea
              value={fields.notes}
              onChange={(event) => updateField("notes", event.target.value)}
              className="min-h-28 rounded-lg border border-[var(--border)] px-3 py-3 outline-none focus:border-[var(--primary)]"
            />
          </label>
        </div>

        {error ? (
          <p className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </p>
        ) : null}

        {order ? (
          <div className="mt-5 rounded-lg border border-green-200 bg-green-50 px-4 py-4">
            <p className="font-semibold text-green-900">Pedido creado correctamente</p>
            <p className="mt-1 text-sm text-green-800">{order.orderNumber}</p>
            {order.whatsappUrl ? (
              <Link
                href={order.whatsappUrl}
                target="_blank"
                className="mt-4 inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-green-900 px-5 text-sm font-semibold text-white"
              >
                <MessageCircle size={17} /> Enviar por WhatsApp
              </Link>
            ) : null}
          </div>
        ) : null}

        <button
          type="submit"
          disabled={status === "submitting" || !cart.items.length}
          className="mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-[var(--primary)] px-5 text-sm font-semibold text-white transition hover:bg-[#1F2937] disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Send size={18} /> {status === "submitting" ? "Creando pedido" : "Confirmar pedido"}
        </button>
      </form>

      <aside className="grid gap-5 self-start">
        <section className="rounded-lg border border-[var(--border)] bg-white px-5">
          {cart.items.map((item) => (
            <CartItem key={`${item.productId}:${item.productVariantId}`} item={item} />
          ))}
        </section>
        <CartSummary
          subtotal={cart.subtotal}
          shippingCost={cart.shippingCost}
          total={cart.total}
          checkoutHref={null}
        />
      </aside>
    </div>
  );
}
