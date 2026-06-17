import { MetadataRoute } from "next";
import { getAllProductSlugs, getAllCategorySlugs } from "@/data/shopify.server";

const BASE_URL = "https://minimog.com.tr";

const staticPages: { path: string; priority?: number; changeFrequency?: "daily" | "weekly" | "monthly" }[] = [
  { path: "/", priority: 1.0, changeFrequency: "daily" },
  { path: "/hakkimizda", priority: 0.5, changeFrequency: "monthly" },
  { path: "/teslimat", priority: 0.4, changeFrequency: "monthly" },
  { path: "/gizlilik-politikasi", priority: 0.3, changeFrequency: "monthly" },
  { path: "/kullanim-kosullari", priority: 0.3, changeFrequency: "monthly" },
  { path: "/cerez-politikasi", priority: 0.3, changeFrequency: "monthly" },
  { path: "/cart", priority: 0.3, changeFrequency: "monthly" },
  { path: "/wishlist", priority: 0.3, changeFrequency: "monthly" },
  { path: "/login", priority: 0.3, changeFrequency: "monthly" },
  { path: "/hesabim", priority: 0.3, changeFrequency: "monthly" },
  { path: "/siparislerim", priority: 0.3, changeFrequency: "monthly" },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [productSlugs, categorySlugs] = await Promise.all([
    getAllProductSlugs(),
    getAllCategorySlugs(),
  ]);

  const productUrls = productSlugs.map((slug) => ({
    url: `${BASE_URL}/products/${slug}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: 0.8,
  }));

  const categoryUrls = categorySlugs.map((slug) => ({
    url: `${BASE_URL}/product-category/${slug}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: 0.7,
  }));

  const staticUrls = staticPages.map((page) => ({
    url: `${BASE_URL}${page.path}`,
    lastModified: new Date(),
    changeFrequency: page.changeFrequency ?? "monthly",
    priority: page.priority ?? 0.5,
  }));

  return [...staticUrls, ...categoryUrls, ...productUrls];
}
