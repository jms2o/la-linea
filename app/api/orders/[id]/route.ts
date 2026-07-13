import { NextResponse } from "next/server";
import { getOrderByIdData, updateOrderStatusData } from "@/lib/data";
import { getSession } from "@/lib/session";
import { updateOrderStatusInputSchema } from "@/lib/validations";
import { CUSTOMER_CANCELLABLE_STATUSES } from "@/types";

type Context = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(_request: Request, context: Context) {
  const session = await getSession();

  if (!session) {
    return NextResponse.json({ message: "No autorizado." }, { status: 401 });
  }

  const { id } = await context.params;
  const order = await getOrderByIdData(id);

  if (!order) {
    return NextResponse.json({ message: "Order not found." }, { status: 404 });
  }

  const isOwner = session.kind === "customer" && order.customer.id === session.sub;
  const isAdmin = session.kind === "admin";

  if (!isOwner && !isAdmin) {
    return NextResponse.json({ message: "No autorizado." }, { status: 403 });
  }

  return NextResponse.json(order);
}

export async function PATCH(request: Request, context: Context) {
  const session = await getSession();

  if (!session) {
    return NextResponse.json({ message: "No autorizado." }, { status: 401 });
  }

  const { id } = await context.params;
  const body = await request.json();
  const parsed = updateOrderStatusInputSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ message: "Estado invalido." }, { status: 400 });
  }

  const order = await getOrderByIdData(id);

  if (!order) {
    return NextResponse.json({ message: "Order not found." }, { status: 404 });
  }

  const isAdmin = session.kind === "admin";
  const isOwner = session.kind === "customer" && order.customer.id === session.sub;

  if (!isAdmin && !isOwner) {
    return NextResponse.json({ message: "No autorizado." }, { status: 403 });
  }

  if (!isAdmin) {
    const canCancel =
      parsed.data.status === "CANCELLED" &&
      CUSTOMER_CANCELLABLE_STATUSES.includes(order.status);

    if (!canCancel) {
      return NextResponse.json(
        { message: "Este pedido ya no se puede cancelar." },
        { status: 403 }
      );
    }
  }

  const updated = await updateOrderStatusData(id, parsed.data.status);

  if (!updated) {
    return NextResponse.json(
      { message: "No se pudo actualizar el pedido." },
      { status: 500 }
    );
  }

  return NextResponse.json(updated);
}
