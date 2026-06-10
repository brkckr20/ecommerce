import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Header, Footer } from "@/components/storefront";
import { ProductDetailClient } from "@/components/storefront/ProductDetailClient";
import { getProductBySlug, getAllProductSlugs, getMainMenu } from "@/data/shopify.server";

export const revalidate = 60;

export async function generateStaticParams() {
  const slugs = await getAllProductSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const product = await getProductBySlug(params.slug);
  if (!product) return { title: "Ürün Bulunamadı" };
  return { title: product.name };
}

export default async function ProductPage({
  params,
}: {
  params: { slug: string };
}) {
  const product = await getProductBySlug(params.slug);

  if (!product) {
    notFound();
  }

  const [navItems] = await Promise.all([
    getMainMenu(),
  ]);

  return (
    <>
      <Header navItems={navItems} />
      <main>
        <ProductDetailClient product={product} />
      </main>
      <Footer />
    </>
  );
}
