import { MetadataRoute } from "next";
import { getAllProductSlugs, getAllCategorySlugs } from "@/data/shopify.server";

const BASE_URL = "https://somni.com.tr";

const staticPages: { path: string; priority?: number; changeFrequency?: "daily" | "weekly" | "monthly" }[] = [
  { path: "/", priority: 1.0, changeFrequency: "daily" },
  { path: "/hakkimizda", priority: 0.5, changeFrequency: "monthly" },
  { path: "/teslimat", priority: 0.4, changeFrequency: "monthly" },
  { path: "/gizlilik-politikasi", priority: 0.3, changeFrequency: "monthly" },
  { path: "/kullanim-kosullari", priority: 0.3, changeFrequency: "monthly" },
  { path: "/cerez-politikasi", priority: 0.3, changeFrequency: "monthly" },
  { path: "/iade-kosullari", priority: 0.4, changeFrequency: "monthly" },
  { path: "/siparis-takip", priority: 0.5, changeFrequency: "weekly" },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [productSlugs, categorySlugs] = await Promise.all([
    getAllProductSlugs(),
    getAllCategorySlugs(),
  ]);

  const now = new Date();

  const productUrls = productSlugs.map((slug) => ({
    url: `${BASE_URL}/products/${slug}`,
    lastModified: now,
    changeFrequency: "daily" as const,
    priority: 0.8,
  }));

  const categoryUrls = categorySlugs.map((slug) => ({
    url: `${BASE_URL}/product-category/${slug}`,
    lastModified: now,
    changeFrequency: "daily" as const,
    priority: 0.7,
  }));

  const staticUrls = staticPages.map((page) => ({
    url: `${BASE_URL}${page.path}`,
    lastModified: now,
    changeFrequency: page.changeFrequency ?? "monthly",
    priority: page.priority ?? 0.5,
  }));

  return [...staticUrls, ...categoryUrls, ...productUrls];
}
