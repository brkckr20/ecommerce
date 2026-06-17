import type { Metadata } from "next";
import { Header, BannerSlider, SeasonCollection, CertificateBar, BestSellers, Footer } from "@/components/storefront";
import { getMainMenu, getCategoryCountsFromTags, getHeroSlides } from "@/data/shopify.server";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Minimog | Bebek & Çocuk Giyim",
  description: "Minimog ile bebek ve çocuk giyimde kaliteyi keşfedin. Şık, rahat ve doğal kumaşlardan üretilen bebek body, pijama, zıbın ve daha fazlası.",
  alternates: { canonical: "https://minimog.com.tr" },
};

export default async function HomePage() {
  const navItems = await getMainMenu();
  const collectionCounts = await getCategoryCountsFromTags(navItems);

  const slides = await getHeroSlides();

  return (
    <>
      <Header navItems={navItems} />
      <main>
        <BannerSlider slides={slides} />
        <SeasonCollection navItems={navItems} collectionCounts={collectionCounts} />
        <CertificateBar />
        <BestSellers />
      </main>
      <Footer />
    </>
  );
}
