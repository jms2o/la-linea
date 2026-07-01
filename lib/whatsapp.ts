type WhatsAppOrderItem = {
  productName: string;
  size?: string | null;
  color?: string | null;
  quantity: number;
  unitPrice: number;
  subtotal: number;
};

type WhatsAppOrder = {
  customerName: string;
  phone?: string | null;
  address?: string | null;
  city?: string | null;
  notes?: string | null;
  deliveryMethod?: string | null;
  items: WhatsAppOrderItem[];
  subtotal: number;
  shippingCost: number;
  total: number;
};

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN"
  }).format(value);
}

export function buildWhatsAppOrderMessage(order: WhatsAppOrder): string {
  const lines = [
    "Nuevo pedido",
    "",
    `Cliente: ${order.customerName}`,
    order.phone ? `Telefono: ${order.phone}` : null,
    order.deliveryMethod ? `Metodo de entrega: ${order.deliveryMethod}` : null,
    order.address ? `Direccion: ${order.address}` : null,
    order.city ? `Ciudad: ${order.city}` : null,
    "",
    "Productos:",
    ...order.items.map((item, index) => {
      const variant = [item.size, item.color].filter(Boolean).join(" / ");
      const variantText = variant ? ` (${variant})` : "";

      return `${index + 1}. ${item.productName}${variantText} x ${item.quantity} - ${formatCurrency(
        item.unitPrice
      )} = ${formatCurrency(item.subtotal)}`;
    }),
    "",
    `Subtotal: ${formatCurrency(order.subtotal)}`,
    `Envio: ${formatCurrency(order.shippingCost)}`,
    `Total: ${formatCurrency(order.total)}`,
    order.notes ? `Notas: ${order.notes}` : null
  ].filter(Boolean);

  return lines.join("\n");
}

export function buildWhatsAppOrderUrl(phoneNumber: string, message: string): string {
  const normalizedPhone = phoneNumber.replace(/[^\d]/g, "");

  if (!normalizedPhone) {
    throw new Error("A WhatsApp phone number is required.");
  }

  return `https://wa.me/${normalizedPhone}?text=${encodeURIComponent(message)}`;
}
