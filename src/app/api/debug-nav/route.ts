import { NextResponse } from "next/server";
import { getMainMenu } from "@/data/shopify.server";

export async function GET() {
  const navItems = await getMainMenu();
  const flatten = (items: any[], depth = 0): any[] => {
    const result: any[] = [];
    for (const item of items) {
      result.push({ name: item.name, href: item.href, children: item.children.length, depth, image: item.image?.slice(0, 50) });
      result.push(...flatten(item.children, depth + 1));
    }
    return result;
  };
  return NextResponse.json({ roots: navItems.map(x => ({ name: x.name, href: x.href, childrenCount: x.children.length })), flat: flatten(navItems) });
}
