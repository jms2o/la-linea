import { NextResponse } from "next/server";
import { getProductBySlugData } from "@/lib/data";

type Context = {
  params: Promise<{
    slug: string;
  }>;
};

export async function GET(_request: Request, context: Context) {
  const { slug } = await context.params;
  const product = await getProductBySlugData(slug);

  if (!product) {
    return NextResponse.json({ message: "Product not found." }, { status: 404 });
  }

  return NextResponse.json(product);
}
