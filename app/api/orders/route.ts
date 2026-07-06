import { NextResponse } from "next/server";
import { createOrderData, getOrdersData } from "@/lib/data";
import { getSession } from "@/lib/session";
import { createOrderInputSchema } from "@/lib/validations";

export async function GET() {
  const orders = await getOrdersData();
  return NextResponse.json(orders);
}

export async function POST(request: Request) {
  const session = await getSession();

  if (!session || session.kind !== "customer") {
    return NextResponse.json(
      { message: "Debes iniciar sesion para hacer un pedido." },
      { status: 401 }
    );
  }

  const body = await request.json();
  const parsed = createOrderInputSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      {
        message: "Invalid order payload.",
        errors: parsed.error.flatten()
      },
      { status: 400 }
    );
  }

  try {
    const order = await createOrderData(parsed.data, session.sub);
    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error ? error.message : "Unable to create order."
      },
      { status: 500 }
    );
  }
}
