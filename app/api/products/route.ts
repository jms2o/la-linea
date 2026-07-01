import { NextResponse } from "next/server";
import { getProductsData } from "@/lib/data";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const sort = searchParams.get("sort");

  const products = await getProductsData({
    search: searchParams.get("search") ?? undefined,
    category: searchParams.get("category") ?? undefined,
    sort:
      sort === "price-asc" || sort === "price-desc" || sort === "recent"
        ? sort
        : "recent"
  });

  return NextResponse.json(products);
}
