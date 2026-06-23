import { notFound } from "next/navigation";
import { getCategoryBySlug, getAllCategorySlugs, getMainMenu, getCollectionsWithCounts } from "@/data/shopify.server";
import type { Metadata } from "next";
import type { NavMenuItem, CollectionCount } from "@/data/shopify.server";
import type { ProductCategory } from "@/data/products";
import { ProductCategoryClient } from "@/components/storefront/ProductCategoryClient";
import { Header, Footer } from "@/components/storefront";

export const revalidate = 60;

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const category = await getCategoryBySlug(params.slug);
  const name = category?.name ?? "Kategori";
  const description = category?.description
    ? category.description.slice(0, 160)
    : `${name} kategorisindeki bebek ve çocuk giyim ürünlerini keşfedin.`;
  return {
    title: name,
    description,
    alternates: { canonical: `https://somni.com.tr/product-category/${params.slug}` },
    openGraph: {
      title: name,
      description,
      images: category?.image ? [{ url: category.image }] : [],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: name,
      description,
      images: category?.image ? [category.image] : [],
    },
  };
}

function findNavItem(slug: string, items: NavMenuItem[]): NavMenuItem | undefined {
  for (const item of items) {
    if (item.href === `/product-category/${slug}`) return item;
    if (item.children.length > 0) {
      const found = findNavItem(slug, item.children);
      if (found) return found;
    }
  }
}

export async function generateStaticParams() {
  const slugs = await getAllCategorySlugs();
  return slugs.map((slug) => ({ slug }));
}

export default async function ProductCategoryPage({ params }: Props) {
  const [navItems, collectionCounts] = await Promise.all([
    getMainMenu(),
    getCollectionsWithCounts(),
  ]);

  let category = await getCategoryBySlug(params.slug);

  if (!category) {
    const navItem = findNavItem(params.slug, navItems);
    if (!navItem) notFound();
    category = {
      slug: params.slug,
      name: navItem.name,
      description: "",
      image: navItem.image ?? undefined,
      productIds: [],
      order: 0,
    };
  }

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Ana Sayfa", item: "https://somni.com.tr" },
      { "@type": "ListItem", position: 2, name: category.name },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <Header navItems={navItems} />
      <main>
        <ProductCategoryClient category={category} navItems={navItems} collectionCounts={collectionCounts} />
      </main>
      <Footer />
    </>
  );
}
