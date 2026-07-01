"use client";

import Image from "next/image";
import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { useMemo, useState } from "react";
import { AddToCartButton } from "@/components/product/add-to-cart-button";
import { QuantitySelector } from "@/components/cart/quantity-selector";
import { calculateLineSubtotal, calculateUnitPrice } from "@/lib/pricing";
import { formatCurrency } from "@/lib/format";
import { buildWhatsAppOrderMessage, buildWhatsAppOrderUrl } from "@/lib/whatsapp";
import type { ProductDTO, StoreSettingDTO } from "@/types";

export function ProductDetail({
  product,
  settings
}: {
  product: ProductDTO;
  settings: StoreSettingDTO;
}) {
  const [selectedImage, setSelectedImage] = useState(product.images[0]?.url);
  const [variantId, setVariantId] = useState(product.variants[0]?.id ?? "");
  const [quantity, setQuantity] = useState(1);
  const variant =
    product.variants.find((item) => item.id === variantId) ?? product.variants[0];
  const unitPrice = calculateUnitPrice(product, quantity);
  const subtotal = calculateLineSubtotal(unitPrice, quantity);
  const reachedWholesale = quantity >= product.wholesaleMinQuantity;
  const neededForWholesale = Math.max(product.wholesaleMinQuantity - quantity, 0);

  const whatsappUrl = useMemo(() => {
    if (!settings.whatsappNumber || !variant) {
      return null;
    }

    const message = buildWhatsAppOrderMessage({
      customerName: "Cliente",
      items: [
        {
          productName: product.name,
          size: variant.size,
          color: variant.color,
          quantity,
          unitPrice,
          subtotal
        }
      ],
      subtotal,
      shippingCost: settings.shippingCost,
      total: subtotal + settings.shippingCost
    });

    return buildWhatsAppOrderUrl(settings.whatsappNumber, message);
  }, [product.name, quantity, settings.shippingCost, settings.whatsappNumber, subtotal, unitPrice, variant]);

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_0.9fr]">
      <div>
        <div className="relative aspect-[4/5] overflow-hidden rounded-lg bg-[#E5E7EB]">
          {selectedImage ? (
            <Image
              src={selectedImage}
              alt={product.name}
              fill
              priority
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          ) : null}
        </div>
        {product.images.length > 1 ? (
          <div className="mt-4 grid grid-cols-4 gap-3">
            {product.images.map((image) => (
              <button
                key={image.id}
                type="button"
                className="relative aspect-square overflow-hidden rounded-lg border border-[var(--border)]"
                onClick={() => setSelectedImage(image.url)}
              >
                <Image
                  src={image.url}
                  alt={image.alt ?? product.name}
                  fill
                  sizes="120px"
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        ) : null}
      </div>

      <section>
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
          {product.category.name}
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-normal sm:text-4xl">
          {product.name}
        </h1>
        <p className="mt-4 text-base leading-7 text-[var(--muted)]">
          {product.description}
        </p>

        <div className="mt-7 grid gap-3 rounded-lg border border-[var(--border)] bg-white p-5 sm:grid-cols-2">
          <div>
            <p className="text-sm text-[var(--muted)]">Precio menudeo</p>
            <p className="mt-1 text-2xl font-semibold">
              {formatCurrency(product.retailPrice)}
            </p>
          </div>
          <div>
            <p className="text-sm text-[var(--muted)]">Precio mayoreo</p>
            <p className="mt-1 text-2xl font-semibold">
              {formatCurrency(product.wholesalePrice)}
            </p>
          </div>
        </div>

        <div className="mt-7 grid gap-5">
          <label>
            <span className="text-sm font-semibold">Talla y color</span>
            <select
              value={variantId}
              onChange={(event) => setVariantId(event.target.value)}
              className="mt-2 h-12 w-full rounded-lg border border-[var(--border)] bg-white px-3 text-sm outline-none transition focus:border-[var(--primary)]"
            >
              {product.variants.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.size} / {item.color} - {item.stock} disponibles
                </option>
              ))}
            </select>
          </label>

          <div>
            <span className="text-sm font-semibold">Cantidad</span>
            <div className="mt-2">
              <QuantitySelector
                value={quantity}
                max={variant?.stock ?? 1}
                onChange={setQuantity}
              />
            </div>
          </div>
        </div>

        <div className="mt-7 rounded-lg border border-[var(--border)] bg-white p-5">
          <div className="flex justify-between gap-4">
            <span className="text-[var(--muted)]">Precio unitario</span>
            <strong>{formatCurrency(unitPrice)}</strong>
          </div>
          <div className="mt-3 flex justify-between gap-4 border-t border-[var(--border)] pt-3">
            <span className="text-[var(--muted)]">Subtotal</span>
            <strong>{formatCurrency(subtotal)}</strong>
          </div>
          <p className="mt-4 rounded-lg bg-[#F8F7F4] px-4 py-3 text-sm text-[var(--muted)]">
            {reachedWholesale
              ? "Ya alcanzaste el precio de mayoreo para este producto."
              : `Agrega ${neededForWholesale} piezas mas para obtener precio de mayoreo.`}
          </p>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {variant ? (
            <AddToCartButton product={product} variant={variant} quantity={quantity} />
          ) : null}
          <Link
            href={whatsappUrl ?? "/checkout"}
            target={whatsappUrl ? "_blank" : undefined}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-lg border border-[var(--primary)] bg-white px-5 text-sm font-semibold text-[var(--primary)] transition hover:bg-[#F3F4F6]"
          >
            <MessageCircle size={18} /> Comprar por WhatsApp
          </Link>
        </div>
      </section>
    </div>
  );
}
