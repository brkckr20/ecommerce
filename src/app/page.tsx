import { Header, BannerSlider, SeasonCollection, CertificateBar, BestSellers, Footer } from "@/components/storefront";
import { getMainMenu, getCollectionsWithCounts, getHeroSlides } from "@/data/shopify.server";

export const revalidate = 60;

export default async function HomePage() {
  const [navItems, collectionCounts] = await Promise.all([
    getMainMenu(),
    getCollectionsWithCounts(),
  ]);

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
