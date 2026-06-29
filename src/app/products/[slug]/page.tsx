import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Header, Footer } from "@/components/storefront";
import { ProductDetailClient } from "@/components/storefront/ProductDetailClient";
import { getProductBySlug, getAllProductSlugs, getAllProducts, getMainMenu } from "@/data/shopify.server";

export const revalidate = 60;

export async function generateStaticParams() {
  const slugs = await getAllProductSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const product = await getProductBySlug(params.slug);
  if (!product) return { title: "Ürün Bulunamadı" };
  const productName = product.name;
  const description = product.description?.replace(/<[^>]*>/g, "").slice(0, 160) || `${productName} - Somni'de en iyi fiyatlarla.`;
  return {
    title: productName,
    description,
    alternates: { canonical: `https://somni.com.tr/products/${params.slug}` },
    openGraph: {
      title: productName,
      description,
      images: product.images[0] ? [{ url: product.images[0] }] : [],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: productName,
      description,
      images: product.images[0] ? [product.images[0]] : [],
    },
  };
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

  const [navItems, allProducts] = await Promise.all([
    getMainMenu(),
    getAllProducts(),
  ]);

  const relatedProducts = allProducts
    .filter((p) => p.id !== product.id)
    .sort((a, b) => {
      const aCat = a.categories.some((c) => product.categories.includes(c)) ? 1 : 0;
      const aTag = a.tags.some((t) => product.tags.includes(t)) ? 1 : 0;
      const bCat = b.categories.some((c) => product.categories.includes(c)) ? 1 : 0;
      const bTag = b.tags.some((t) => product.tags.includes(t)) ? 1 : 0;
      return (bCat + bTag) - (aCat + aTag);
    })
    .slice(0, 6);

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description?.replace(/<[^>]*>/g, "").slice(0, 500),
    image: product.images,
    sku: product.sku,
    offers: {
      "@type": "Offer",
      price: parseFloat(product.price.replace(/[^0-9,]/g, "").replace(",", ".")).toFixed(2),
      priceCurrency: "TRY",
      availability: product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      url: `https://somni.com.tr/products/${params.slug}`,
    },
    ...(product.rating > 0 && {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: product.rating,
        reviewCount: product.reviewCount,
      },
    }),
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Ana Sayfa", item: "https://somni.com.tr" },
      { "@type": "ListItem", position: 2, name: "Ürünler", item: "https://somni.com.tr" },
      { "@type": "ListItem", position: 3, name: product.name },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <Header navItems={navItems} />
      <main>
        <ProductDetailClient product={product} relatedProducts={relatedProducts} navItems={navItems} />
      </main>
      <Footer />
    </>
  );
}
