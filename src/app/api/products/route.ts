import { NextResponse } from "next/server";
import { getAllProducts } from "@/data/shopify.server";

export const revalidate = 60;

export async function GET() {
  const products = await getAllProducts();
  return NextResponse.json(products);
}
