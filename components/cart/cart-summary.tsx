import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { formatCurrency } from "@/lib/format";

type CartSummaryProps = {
  subtotal: number;
  shippingCost: number;
  total: number;
  checkoutHref?: string | null;
};

export function CartSummary({
  subtotal,
  shippingCost,
  total,
  checkoutHref = "/checkout"
}: CartSummaryProps) {
  return (
    <div className="rounded-lg border border-[var(--border)] bg-white p-5">
      <h2 className="text-lg font-semibold">Resumen</h2>
      <dl className="mt-5 grid gap-3 text-sm">
        <div className="flex justify-between gap-4">
          <dt className="text-[var(--muted)]">Subtotal</dt>
          <dd className="font-medium">{formatCurrency(subtotal)}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-[var(--muted)]">Envio</dt>
          <dd className="font-medium">{formatCurrency(shippingCost)}</dd>
        </div>
        <div className="flex justify-between gap-4 border-t border-[var(--border)] pt-3 text-base">
          <dt className="font-semibold">Total</dt>
          <dd className="font-semibold">{formatCurrency(total)}</dd>
        </div>
      </dl>
      {checkoutHref ? (
        <Link
          href={checkoutHref}
          className="mt-5 inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-[var(--primary)] px-5 text-sm font-semibold text-white transition hover:bg-[#1F2937]"
        >
          Continuar pedido <ArrowRight size={18} />
        </Link>
      ) : null}
    </div>
  );
}
