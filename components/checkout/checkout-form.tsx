"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CreditCard,
  Lock,
  MapPin,
  Send,
  Store,
  Truck
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa6";
import { useState } from "react";
import { CartItem } from "@/components/cart/cart-item";
import { CartSummary } from "@/components/cart/cart-summary";
import { useCart } from "@/components/cart/cart-provider";
import { AnimatedButton } from "@/components/ui/animated-button";
import { createOrder } from "@/lib/api";
import {
  createOrderInputSchema,
  type DeliveryOption,
  type PaymentMethod
} from "@/lib/validations";
import type { OrderDTO } from "@/types";

type CheckoutCustomer = {
  name: string;
  phone: string;
  address: string | null;
  neighborhood: string | null;
  city: string | null;
  state: string | null;
  zipCode: string | null;
  reference: string | null;
};

type CheckoutFormProps = {
  customer: CheckoutCustomer;
};

const DELIVERY_OPTIONS: Array<{
  value: DeliveryOption;
  label: string;
  icon: typeof Store;
}> = [
  { value: "Recoger en tienda", label: "Recoger en tienda", icon: Store },
  { value: "A domicilio", label: "A domicilio", icon: Truck }
];

const BUTTON_TAP = { scale: 0.96 };
const BUTTON_HOVER = { y: -2 };
const BUTTON_SPRING = { type: "spring", stiffness: 420, damping: 26 } as const;

function formatCardNumber(value: string): string {
  return value
    .replace(/\D/g, "")
    .slice(0, 16)
    .replace(/(.{4})/g, "$1 ")
    .trim();
}

function formatCardExpiry(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 4);
  return digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits;
}

function formatCardCvv(value: string): string {
  return value.replace(/\D/g, "").slice(0, 4);
}

export function CheckoutForm({ customer }: CheckoutFormProps) {
  const cart = useCart();
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1);
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryOption>("Recoger en tienda");
  const [address, setAddress] = useState(customer.address ?? "");
  const [neighborhood, setNeighborhood] = useState(customer.neighborhood ?? "");
  const [city, setCity] = useState(customer.city ?? "");
  const [state, setState] = useState(customer.state ?? "");
  const [zipCode, setZipCode] = useState(customer.zipCode ?? "");
  const [reference, setReference] = useState(customer.reference ?? "");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null);
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [error, setError] = useState("");
  const [order, setOrder] = useState<OrderDTO | null>(null);

  const needsAddress = deliveryMethod === "A domicilio";
  const canContinue =
    !needsAddress ||
    [address, neighborhood, city, state, zipCode].every((field) => field.trim().length > 0);

  function handleContinue() {
    if (!canContinue) {
      return;
    }
    setStep(2);
  }

  async function handleSubmit() {
    setError("");

    if (!paymentMethod) {
      setStatus("error");
      setError("Elige un metodo de pago.");
      return;
    }

    const payload = {
      deliveryMethod,
      paymentMethod,
      address: needsAddress ? address : undefined,
      neighborhood: needsAddress ? neighborhood : undefined,
      city: needsAddress ? city : undefined,
      state: needsAddress ? state : undefined,
      zipCode: needsAddress ? zipCode : undefined,
      reference: needsAddress ? reference : undefined,
      items: cart.items.map((item) => ({
        productId: item.productId,
        productVariantId: item.productVariantId,
        quantity: item.quantity
      }))
    };

    const parsed = createOrderInputSchema.safeParse(payload);

    if (!parsed.success) {
      setStatus("error");
      setError("Revisa los datos de tu pedido e intenta de nuevo.");
      return;
    }

    setStatus("submitting");

    try {
      const createdOrder = await createOrder(parsed.data);
      setOrder(createdOrder);
      setStatus("success");
      cart.clearCart();

      if (paymentMethod === "WHATSAPP" && createdOrder.whatsappUrl) {
        window.open(createdOrder.whatsappUrl, "_blank", "noopener,noreferrer");
      }

      window.setTimeout(() => {
        router.push("/catalogo");
      }, 2000);
    } catch {
      setStatus("error");
      setError("No se pudo crear el pedido. Intenta de nuevo.");
    }
  }

  const header = (
    <div className="max-w-2xl">
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
        Checkout
      </p>
      <h1 className="mt-2 text-4xl font-semibold tracking-normal">Confirma tu pedido</h1>
      <p className="mt-4 text-base leading-7 text-[var(--muted)]">
        Completa tus datos para guardar el pedido y generar el mensaje de WhatsApp con
        productos, variantes y total.
      </p>
    </div>
  );

  if (!cart.items.length && !order) {
    return (
      <>
        {header}
        <div className="mt-8 rounded-lg border border-dashed border-[var(--border)] bg-white px-6 py-16 text-center">
          <h2 className="text-xl font-semibold">No hay productos para confirmar</h2>
          <p className="mt-3 text-sm text-[var(--muted)]">
            Agrega productos al carrito antes de continuar.
          </p>
          <AnimatedButton href="/catalogo" variant="solid" className="mt-6">
            Ver catalogo
          </AnimatedButton>
        </div>
      </>
    );
  }

  return (
    <div className="grid gap-8 md:grid-cols-[1fr_380px] lg:grid-cols-[1fr_420px]">
      <div className="order-2 md:order-1">
        {header}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="mt-8 rounded-lg border border-[var(--border)] bg-white p-5"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Datos del cliente</h2>
          <Link
            href="/mi-cuenta"
            className="text-sm font-medium text-[var(--primary)] underline underline-offset-2"
          >
            Editar
          </Link>
        </div>
        <dl className="mt-4 grid gap-1 text-sm text-[var(--muted)]">
          <div className="flex gap-2">
            <dt className="font-medium text-[var(--foreground)]">{customer.name}</dt>
          </div>
          {customer.phone ? <dd>{customer.phone}</dd> : null}
        </dl>

        <div className="mt-6 flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
          {([
            { n: 1 as const, label: "Entrega" },
            { n: 2 as const, label: "Pago" }
          ]).map(({ n, label }) => (
            <div key={n} className="relative">
              {step === n ? (
                <motion.span
                  layoutId="checkout-step-pill"
                  transition={BUTTON_SPRING}
                  className="absolute inset-0 rounded-full bg-[var(--primary)]/10"
                />
              ) : null}
              <span
                className={`relative z-10 block rounded-full px-2.5 py-1 ${
                  step === n ? "text-[var(--primary)]" : undefined
                }`}
              >
                {n}. {label}
              </span>
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {step === 1 ? (
            <motion.div
              key="step-1"
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              transition={{ duration: 0.2 }}
            >
              <h2 className="mt-4 text-lg font-semibold">Como quieres tu pedido</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {DELIVERY_OPTIONS.map(({ value, label, icon: Icon }) => (
                  <motion.button
                    key={value}
                    type="button"
                    onClick={() => setDeliveryMethod(value)}
                    whileHover={BUTTON_HOVER}
                    whileTap={BUTTON_TAP}
                    transition={BUTTON_SPRING}
                    className={`relative flex h-14 items-center justify-center gap-2 rounded-lg border text-sm font-semibold transition-colors ${
                      deliveryMethod === value
                        ? "border-[var(--primary)] bg-[var(--primary)] text-white"
                        : "border-[var(--border)] bg-white text-[var(--foreground)] hover:border-[var(--primary)]"
                    }`}
                  >
                    <Icon size={18} /> {label}
                    <AnimatePresence>
                      {deliveryMethod === value ? (
                        <motion.span
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0, opacity: 0 }}
                          transition={BUTTON_SPRING}
                          className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-white text-[var(--primary)] shadow"
                        >
                          <Check size={12} strokeWidth={3} />
                        </motion.span>
                      ) : null}
                    </AnimatePresence>
                  </motion.button>
                ))}
              </div>

              <AnimatePresence>
                {needsAddress ? (
                  <motion.div
                    key="address-panel"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-4 grid gap-4 rounded-lg border border-[var(--border)] bg-[var(--background)] p-4 sm:grid-cols-2">
                      <label className="grid gap-2 text-sm font-medium sm:col-span-2">
                        <span className="flex items-center gap-1">
                          <MapPin size={14} /> Calle y numero
                        </span>
                        <input
                          value={address}
                          onChange={(event) => setAddress(event.target.value)}
                          placeholder="Calle, numero exterior/interior..."
                          className="h-12 rounded-lg border border-[var(--border)] bg-white px-3 outline-none focus:border-[var(--primary)]"
                          required
                        />
                      </label>
                      <label className="grid gap-2 text-sm font-medium">
                        Colonia
                        <input
                          value={neighborhood}
                          onChange={(event) => setNeighborhood(event.target.value)}
                          className="h-12 rounded-lg border border-[var(--border)] bg-white px-3 outline-none focus:border-[var(--primary)]"
                          required
                        />
                      </label>
                      <label className="grid gap-2 text-sm font-medium">
                        Ciudad
                        <input
                          value={city}
                          onChange={(event) => setCity(event.target.value)}
                          className="h-12 rounded-lg border border-[var(--border)] bg-white px-3 outline-none focus:border-[var(--primary)]"
                          required
                        />
                      </label>
                      <label className="grid gap-2 text-sm font-medium">
                        Estado
                        <input
                          value={state}
                          onChange={(event) => setState(event.target.value)}
                          className="h-12 rounded-lg border border-[var(--border)] bg-white px-3 outline-none focus:border-[var(--primary)]"
                          required
                        />
                      </label>
                      <label className="grid gap-2 text-sm font-medium">
                        Codigo postal
                        <input
                          value={zipCode}
                          onChange={(event) => setZipCode(event.target.value)}
                          inputMode="numeric"
                          className="h-12 rounded-lg border border-[var(--border)] bg-white px-3 outline-none focus:border-[var(--primary)]"
                          required
                        />
                      </label>
                      <label className="grid gap-2 text-sm font-medium sm:col-span-2">
                        Referencias (opcional)
                        <input
                          value={reference}
                          onChange={(event) => setReference(event.target.value)}
                          placeholder="Entre calles, color de fachada, punto de referencia..."
                          className="h-12 rounded-lg border border-[var(--border)] bg-white px-3 outline-none focus:border-[var(--primary)]"
                        />
                      </label>
                    </div>
                  </motion.div>
                ) : null}
              </AnimatePresence>

              <motion.button
                type="button"
                onClick={handleContinue}
                disabled={!canContinue}
                whileHover={canContinue ? BUTTON_HOVER : undefined}
                whileTap={canContinue ? BUTTON_TAP : undefined}
                transition={BUTTON_SPRING}
                className="mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-[var(--primary)] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#1F2937] disabled:cursor-not-allowed disabled:opacity-60"
              >
                Continuar <ArrowRight size={18} />
              </motion.button>
            </motion.div>
          ) : (
            <motion.div
              key="step-2"
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 12 }}
              transition={{ duration: 0.2 }}
            >
              <div className="mt-4 flex items-center justify-between rounded-lg border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-sm">
                <div>
                  <p className="font-semibold text-[var(--foreground)]">{deliveryMethod}</p>
                  {needsAddress ? (
                    <p className="text-[var(--muted)]">
                      {[address, neighborhood, city, state, zipCode]
                        .filter(Boolean)
                        .join(", ")}
                    </p>
                  ) : null}
                </div>
                <motion.button
                  type="button"
                  onClick={() => setStep(1)}
                  whileHover={BUTTON_HOVER}
                  whileTap={BUTTON_TAP}
                  transition={BUTTON_SPRING}
                  className="inline-flex items-center gap-1 text-sm font-medium text-[var(--primary)]"
                >
                  <ArrowLeft size={14} /> Cambiar
                </motion.button>
              </div>

              <h2 className="mt-6 text-lg font-semibold">Como quieres pagar</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <motion.button
                  type="button"
                  onClick={() => setPaymentMethod("WHATSAPP")}
                  whileHover={BUTTON_HOVER}
                  whileTap={BUTTON_TAP}
                  transition={BUTTON_SPRING}
                  className={`relative flex h-14 items-center justify-center gap-2 rounded-lg border text-sm font-semibold transition-colors ${
                    paymentMethod === "WHATSAPP"
                      ? "border-[#25D366] bg-[#25D366] text-white"
                      : "border-[var(--border)] bg-white text-[var(--foreground)] hover:border-[#25D366]"
                  }`}
                >
                  <FaWhatsapp size={18} /> WhatsApp
                  <AnimatePresence>
                    {paymentMethod === "WHATSAPP" ? (
                      <motion.span
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={BUTTON_SPRING}
                        className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-white text-[#25D366] shadow"
                      >
                        <Check size={12} strokeWidth={3} />
                      </motion.span>
                    ) : null}
                  </AnimatePresence>
                </motion.button>
                <motion.button
                  type="button"
                  onClick={() => setPaymentMethod("CARD")}
                  whileHover={BUTTON_HOVER}
                  whileTap={BUTTON_TAP}
                  transition={BUTTON_SPRING}
                  className={`relative flex h-14 items-center justify-center gap-2 rounded-lg border text-sm font-semibold transition-colors ${
                    paymentMethod === "CARD"
                      ? "border-[var(--primary)] bg-[var(--primary)] text-white"
                      : "border-[var(--border)] bg-white text-[var(--foreground)] hover:border-[var(--primary)]"
                  }`}
                >
                  <CreditCard size={18} /> Tarjeta
                  <AnimatePresence>
                    {paymentMethod === "CARD" ? (
                      <motion.span
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={BUTTON_SPRING}
                        className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-white text-[var(--primary)] shadow"
                      >
                        <Check size={12} strokeWidth={3} />
                      </motion.span>
                    ) : null}
                  </AnimatePresence>
                </motion.button>
              </div>

              <AnimatePresence mode="wait">
              {paymentMethod === "CARD" ? (
                <motion.div
                  key="card-panel"
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                  className="mt-3"
                >
                  <p className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-800">
                    El pago con tarjeta estara disponible pronto. Registramos tu pedido y te
                    contactamos por WhatsApp para coordinar el cobro.
                  </p>

                  <div className="relative mt-3 rounded-lg border border-[var(--border)] bg-[var(--background)] p-4">
                    <span className="absolute right-3 top-3 rounded-full bg-[var(--muted)] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
                      Vista previa
                    </span>
                    <div className="grid gap-3">
                      <label className="grid gap-1 text-xs font-medium text-[var(--muted)]">
                        Numero de tarjeta
                        <div className="flex h-11 items-center gap-2 rounded-lg border border-[var(--border)] bg-white px-3 text-sm text-[var(--foreground)]">
                          <CreditCard size={16} className="text-[var(--muted)]" />
                          <input
                            value={cardNumber}
                            onChange={(event) => setCardNumber(formatCardNumber(event.target.value))}
                            inputMode="numeric"
                            autoComplete="off"
                            placeholder="0000 0000 0000 0000"
                            className="w-full bg-transparent outline-none placeholder:text-[var(--muted)]"
                          />
                        </div>
                      </label>
                      <label className="grid gap-1 text-xs font-medium text-[var(--muted)]">
                        Nombre en la tarjeta
                        <input
                          value={cardName}
                          onChange={(event) => setCardName(event.target.value)}
                          autoComplete="off"
                          placeholder="Como aparece en la tarjeta"
                          className="h-11 rounded-lg border border-[var(--border)] bg-white px-3 text-sm text-[var(--foreground)] outline-none placeholder:text-[var(--muted)]"
                        />
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        <label className="grid gap-1 text-xs font-medium text-[var(--muted)]">
                          Vencimiento
                          <input
                            value={cardExpiry}
                            onChange={(event) => setCardExpiry(formatCardExpiry(event.target.value))}
                            inputMode="numeric"
                            autoComplete="off"
                            placeholder="MM/AA"
                            className="h-11 rounded-lg border border-[var(--border)] bg-white px-3 text-sm text-[var(--foreground)] outline-none placeholder:text-[var(--muted)]"
                          />
                        </label>
                        <label className="grid gap-1 text-xs font-medium text-[var(--muted)]">
                          CVV
                          <input
                            value={cardCvv}
                            onChange={(event) => setCardCvv(formatCardCvv(event.target.value))}
                            inputMode="numeric"
                            autoComplete="off"
                            placeholder="123"
                            className="h-11 rounded-lg border border-[var(--border)] bg-white px-3 text-sm text-[var(--foreground)] outline-none placeholder:text-[var(--muted)]"
                          />
                        </label>
                      </div>
                    </div>
                    <p className="mt-3 flex items-center gap-1 text-[11px] text-[var(--muted)]">
                      <Lock size={12} /> Estos datos no se envian ni se guardan, es solo una
                      vista previa mientras activamos pagos en linea.
                    </p>
                  </div>
                </motion.div>
              ) : paymentMethod === "WHATSAPP" ? (
                <motion.p
                  key="whatsapp-panel"
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                  className="mt-3 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800"
                >
                  Coordinas el pago (efectivo o transferencia) directamente por WhatsApp.
                </motion.p>
              ) : null}
              </AnimatePresence>

              <AnimatePresence>
                {error ? (
                  <motion.p
                    key="error-message"
                    initial={{ opacity: 0, y: -8, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: "auto" }}
                    exit={{ opacity: 0, y: -8, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="mt-4 overflow-hidden rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                  >
                    {error}
                  </motion.p>
                ) : null}
              </AnimatePresence>

              <AnimatePresence>
                {order ? (
                  <motion.div
                    key="order-success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={BUTTON_SPRING}
                    className="mt-5 rounded-lg border border-green-200 bg-green-50 px-4 py-4"
                  >
                    <p className="font-semibold text-green-900">Pedido creado correctamente</p>
                    <p className="mt-1 text-sm text-green-800">{order.orderNumber}</p>
                    {order.whatsappUrl ? (
                      <div className="mt-4">
                        <AnimatedButton href={order.whatsappUrl} variant="whatsapp" target="_blank">
                          <FaWhatsapp size={18} /> Enviar por WhatsApp
                        </AnimatedButton>
                      </div>
                    ) : null}
                  </motion.div>
                ) : null}
              </AnimatePresence>

              <motion.button
                type="button"
                onClick={handleSubmit}
                disabled={status === "submitting" || !cart.items.length || !paymentMethod}
                whileHover={status === "submitting" || !paymentMethod ? undefined : BUTTON_HOVER}
                whileTap={status === "submitting" || !paymentMethod ? undefined : BUTTON_TAP}
                transition={BUTTON_SPRING}
                className="mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-[var(--primary)] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#1F2937] disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Send size={18} /> {status === "submitting" ? "Creando pedido" : "Confirmar pedido"}
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
      </div>

      <motion.aside
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="order-1 grid gap-5 self-start md:order-2"
      >
        <section className="rounded-lg border border-[var(--border)] bg-white px-5 pt-5">
          <h2 className="text-lg font-semibold">Tu pedido</h2>
          <AnimatePresence initial={false}>
            {cart.items.map((item) => (
              <motion.div
                key={`${item.productId}:${item.productVariantId}`}
                layout
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.25 }}
                className="overflow-hidden"
              >
                <CartItem item={item} />
              </motion.div>
            ))}
          </AnimatePresence>
        </section>
        <CartSummary
          subtotal={cart.subtotal}
          shippingCost={cart.shippingCost}
          total={cart.total}
          checkoutHref={null}
        />
      </motion.aside>
    </div>
  );
}
