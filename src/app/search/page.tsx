import { Suspense } from "react";
import { getAllProducts } from "@/data/shopify.server";
import type { Metadata } from "next";
import { Header, Footer } from "@/components/storefront";
import { SearchPageClient } from "./SearchPageClient";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Arama Sonuçları",
  description: "Ürünlerde arama yapın",
};

interface Props {
  searchParams: { q?: string };
}

export default async function SearchPage({ searchParams }: Props) {
  const products = await getAllProducts();
  const query = searchParams.q?.trim() ?? "";

  return (
    <>
      <Header />
      <main className="min-h-screen">
        <div className="container-wide py-12">
          <div className="max-w-[800px] mx-auto">
            <h1 className="text-2xl md:text-3xl font-medium text-heading mb-8">
              Arama Sonuçları
            </h1>
            <Suspense fallback={<div className="text-center py-12 text-text">Yükleniyor...</div>}>
              <SearchPageClient products={products} initialQuery={query} />
            </Suspense>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
