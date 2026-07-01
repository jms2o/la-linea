import { NextResponse } from "next/server";
import { createOrderData, getOrdersData } from "@/lib/data";
import { createOrderInputSchema } from "@/lib/validations";

export async function GET() {
  const orders = await getOrdersData();
  return NextResponse.json(orders);
}

export async function POST(request: Request) {
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
    const order = await createOrderData(parsed.data);
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
