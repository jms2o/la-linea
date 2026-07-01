import { NextResponse } from "next/server";
import { getOrderByIdData } from "@/lib/data";

type Context = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(_request: Request, context: Context) {
  const { id } = await context.params;
  const order = await getOrderByIdData(id);

  if (!order) {
    return NextResponse.json({ message: "Order not found." }, { status: 404 });
  }

  return NextResponse.json(order);
}
