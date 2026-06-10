import "server-only";
import { shopifyFetch } from "@/lib/shopify";
import {
  PRODUCTS_QUERY,
  PRODUCT_BY_HANDLE_QUERY,
  COLLECTIONS_QUERY,
  COLLECTION_BY_HANDLE_QUERY,
  COLLECTIONS_WITH_COUNTS_QUERY,
  METAOBJECT_BY_HANDLE_QUERY,
} from "@/lib/shopify-queries";
import type {
  ShopifyProduct,
  ShopifyVariant,
  ProductsResponse,
  ProductByHandleResponse,
  CollectionsResponse,
  CollectionByHandleResponse,
  ShopifyCollection,
} from "@/lib/shopify-types";
import type { Product, ProductVariant, ProductCategory } from "./products";

const OPTION_COLOR_NAMES = ["renk", "color", "colour", "color"];
const OPTION_SIZE_NAMES = ["beden", "size", "yaş", "yas", "age"];

function getColorValue(variant: ShopifyVariant): string {
  const colorOption = variant.selectedOptions.find((o) =>
    OPTION_COLOR_NAMES.some((n) => o.name.toLowerCase().includes(n))
  );
  return colorOption?.value ?? "";
}

function getSizeValue(variant: ShopifyVariant): string {
  const sizeOption = variant.selectedOptions.find((o) =>
    OPTION_SIZE_NAMES.some((n) => o.name.toLowerCase().includes(n))
  );
  return sizeOption?.value ?? variant.title;
}

function getUniqueColors(variants: ShopifyVariant[]): string[] {
  return [...new Set(variants.map(getColorValue))].filter(Boolean);
}

function getUniqueSizes(variants: ShopifyVariant[]): string[] {
  return [...new Set(variants.map(getSizeValue))].filter(Boolean);
}

function makeHandle(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9a-zçğıöşü]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function toProductVariant(v: ShopifyVariant): ProductVariant {
  return {
    color: getColorValue(v),
    size: getSizeValue(v),
    sku: v.sku || "",
    stock: v.quantityAvailable,
    variantId: v.id,
  };
}

let productCounter = 0;

function toProduct(node: ShopifyProduct): Product {
  productCounter++;
  const images = node.images.edges.map((e) => e.node.url);
  const variants = node.variants.edges.map((e) => e.node);
  const hasMultipleOptions =
    node.options.length > 1 &&
    node.options.some((o) => OPTION_SIZE_NAMES.some((n) => o.name.toLowerCase().includes(n)));

  let productVariants: ProductVariant[];
  let colors: string[];
  let sizes: string[];

  if (hasMultipleOptions) {
    productVariants = variants.map(toProductVariant);
    colors = getUniqueColors(variants);
    sizes = getUniqueSizes(variants);
  } else {
    const singleSize = variants.length > 1 ? "Tek Beden" : "Standart";
    productVariants = variants.map((v) => ({
      color: v.title,
      size: singleSize,
      sku: v.sku || "",
      stock: v.quantityAvailable,
      variantId: v.id,
    }));
    colors = [variants.map((v) => v.title).join(", ")];
    sizes = [singleSize];
  }

  const price = `${parseFloat(node.priceRange.minVariantPrice.amount).toFixed(2)} TL`;
  const originalPrice = node.compareAtPriceRange?.minVariantPrice.amount
    ? `${parseFloat(node.compareAtPriceRange.minVariantPrice.amount).toFixed(2)} TL`
    : undefined;

  const totalStock = variants.reduce((sum, v) => sum + v.quantityAvailable, 0);

  return {
    id: productCounter,
    name: node.title,
    price,
    originalPrice,
    image: images[0] || "",
    hoverImage: images[1] || images[0] || "",
    images,
    href: `/products/${node.handle}`,
    variants: productVariants,
    colors,
    sizes,
    description: node.descriptionHtml || "",
    categories: node.collections.edges.map((e) => e.node.title),
    sku: variants[0]?.sku || "",
    rating: 0,
    reviewCount: 0,
    stock: totalStock,
  };
}

function toCategory(node: ShopifyCollection): ProductCategory {
  return {
    slug: node.handle,
    name: node.title,
    parent: undefined,
    description: node.descriptionHtml?.replace(/<[^>]*>/g, "") || "",
    image: node.image?.url || undefined,
    productIds: [],
    order: 0,
  };
}

export async function getAllProducts(): Promise<Product[]> {
  productCounter = 0;
  let allProducts: Product[] = [];
  let after: string | null = null;
  let hasNext = true;

  while (hasNext) {
    const data = await shopifyFetch<ProductsResponse>(PRODUCTS_QUERY, {
      first: 250,
      after,
    });
    const products = data.products.edges.map((e) => toProduct(e.node));
    allProducts = allProducts.concat(products);
    hasNext = data.products.pageInfo.hasNextPage;
    after = data.products.pageInfo.endCursor;
  }

  return allProducts;
}

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  productCounter = 0;
  const data = await shopifyFetch<ProductByHandleResponse>(PRODUCT_BY_HANDLE_QUERY, {
    handle: slug,
  });
  if (!data.productByHandle) return undefined;
  return toProduct(data.productByHandle);
}

export async function getAllProductSlugs(): Promise<string[]> {
  const data = await shopifyFetch<ProductsResponse>(PRODUCTS_QUERY, {
    first: 250,
  });
  return data.products.edges.map((e) => e.node.handle);
}

export async function getAllCategories(): Promise<ProductCategory[]> {
  const data = await shopifyFetch<CollectionsResponse>(COLLECTIONS_QUERY, {
    first: 50,
  });
  return data.collections.edges.map((e) => toCategory(e.node));
}

export async function getCategoryBySlug(slug: string): Promise<ProductCategory | undefined> {
  try {
    const data = await shopifyFetch<any>(METAOBJECT_BY_HANDLE_QUERY, {
      handle: { handle: slug, type: "navigation_item" },
    });
    const metaobject = data?.metaobjectByHandle;
    if (!metaobject) return undefined;

    const fields: Record<string, any> = {};
    for (const f of metaobject.fields) {
      fields[f.key] = f;
    }

    const imageField = fields["image"] ?? fields["gorsel"];
    return {
      slug,
      name: fields["title"]?.value ?? fields["baslik"]?.value ?? slug,
      description: "",
      image: imageField?.reference?.image?.url ?? undefined,
      productIds: [],
      order: parseInt(fields["order"]?.value ?? fields["sira"]?.value ?? "0", 10),
    };
  } catch {
    return undefined;
  }
}

export async function getAllCategorySlugs(): Promise<string[]> {
  const data = await shopifyFetch<CollectionsResponse>(COLLECTIONS_QUERY, {
    first: 50,
  });
  return data.collections.edges.map((e) => e.node.handle);
}

export async function getCategoryTree(): Promise<CategoryTreeNode[]> {
  const data = await shopifyFetch<CollectionsResponse>(COLLECTIONS_QUERY, {
    first: 50,
  });
  const collections = data.collections.edges.map((e) => e.node);
  return collections.map((c) => ({
    name: c.title,
    slug: c.handle,
    children: [],
  }));
}

export interface CategoryTreeNode {
  name: string;
  slug: string;
  children: CategoryTreeNode[];
}

export interface NavMenuItem {
  name: string;
  href: string;
  children: NavMenuItem[];
  image: string | null;
}

interface NavMetaobject {
  id: string;
  handle: string;
  title: string;
  link: string;
  order: number;
  parentId: string | null;
  image: string | null;
}

const NAV_METAOBJECTS_QUERY = `#graphql
query GetNavigation {
  metaobjects(type: "navigation_item", first: 50) {
    nodes {
      id
      fields {
        key
        value
        reference {
          ... on MediaImage {
            image {
              url
              altText
            }
          }
          ... on Metaobject {
            id
          }
        }
      }
    }
  }
}`;

export async function getMainMenu(): Promise<NavMenuItem[]> {
  const data = await shopifyFetch<any>(NAV_METAOBJECTS_QUERY);
  const nodes = data?.metaobjects?.nodes ?? [];

  const items: NavMetaobject[] = nodes.map((node: any) => {
    const fields: Record<string, any> = {};
    for (const f of node.fields) {
      fields[f.key] = f;
    }
    const parentField = fields["parent"];
    const parentId =
      parentField?.reference?.id ??
      (parentField?.value?.startsWith("gid://") ? parentField.value : null);
    const imageField = fields["image"] ?? fields["icon"];
    const imageUrl = imageField?.reference?.image?.url ?? null;
    return {
      id: node.id,
      handle: "",
      title: fields["title"]?.value ?? "",
      link: fields["link"]?.value ?? "/",
      order: parseInt(fields["order"]?.value ?? "0", 10),
      parentId,
      image: imageUrl,
    };
  });

  const itemMap = new Map(items.map((i) => [i.id, i]));
  const childrenMap = new Map<string, NavMetaobject[]>();
  const roots: NavMetaobject[] = [];

  for (const item of items) {
    if (item.parentId && itemMap.has(item.parentId)) {
      const list = childrenMap.get(item.parentId) ?? [];
      list.push(item);
      childrenMap.set(item.parentId, list);
    } else {
      roots.push(item);
    }
  }

  roots.sort((a: NavMetaobject, b: NavMetaobject) => a.order - b.order);
  Array.from(childrenMap.values()).forEach((children) => {
    children.sort((a: NavMetaobject, b: NavMetaobject) => a.order - b.order);
  });

  function toNavItem(item: NavMetaobject): NavMenuItem {
    let href = item.link;
    if (href.startsWith("http")) {
      try { href = new URL(href).pathname; } catch { /* keep as-is */ }
    }
    return {
      name: item.title,
      href,
      image: item.image,
      children: (childrenMap.get(item.id) ?? []).map(toNavItem),
    };
  }

  return roots.map(toNavItem);
}

export interface CollectionCount {
  handle: string;
  name: string;
  productCount: number;
  image: string | null;
}

export async function getCollectionsWithCounts(): Promise<CollectionCount[]> {
  const data = await shopifyFetch<any>(COLLECTIONS_WITH_COUNTS_QUERY, { first: 50 });
  return (data?.collections?.edges ?? []).map((e: any) => ({
    handle: e.node.handle,
    name: e.node.title,
    productCount: e.node.products?.edges?.length ?? 0,
    image: e.node.image?.url ?? null,
  }));
}

export interface SiteSettings {
  freeShippingLimit: number;
  freeShippingBannerText: string | null;
}

const SITE_SETTINGS_QUERY = `#graphql
query GetSiteSettings {
  metaobjects(type: "site_settings", first: 1) {
    nodes {
      fields {
        key
        value
      }
    }
  }
}`;

export async function getSiteSettings(): Promise<SiteSettings | null> {
  try {
    const data = await shopifyFetch<any>(SITE_SETTINGS_QUERY, undefined, { cache: "no-store" });
    const nodes = data?.metaobjects?.nodes ?? [];
    if (nodes.length === 0) return null;
    const fields: Record<string, string> = {};
    for (const field of nodes[0].fields) {
      fields[field.key] = field.value;
    }
    return {
      freeShippingLimit: parseInt(fields["free_shipping_threshold"] ?? "499", 10),
      freeShippingBannerText: fields["free_shipping_banner_text"] ?? null,
    };
  } catch {
    return null;
  }
}

const HERO_SLIDES_QUERY = `#graphql
query GetHeroSlides {
  metaobjects(type: "hero_slide", first: 10) {
    nodes {
      id
      fields {
        key
        value
        reference {
          ... on MediaImage {
            image {
              url
              altText
              width
              height
            }
          }
        }
      }
    }
  }
}`;

export interface HeroSlide {
  id: string;
  title: string;
  subtitle: string;
  cta: string;
  href: string;
  bgColor: string;
  image: string;
  order: number;
}

export async function getHeroSlides(): Promise<HeroSlide[]> {
  const data = await shopifyFetch<any>(HERO_SLIDES_QUERY);
  const nodes = data?.metaobjects?.nodes ?? [];

  return nodes.map((node: any) => {
    const fields: Record<string, any> = {};
    for (const f of node.fields) {
      fields[f.key] = f;
    }
    const imageField = fields["image"] ?? fields["gorsel"];
    return {
      id: node.id,
      title: fields["title"]?.value ?? fields["baslik"]?.value ?? "",
      subtitle: fields["subtitle"]?.value ?? "",
      cta: fields["cta"]?.value ?? fields["buton_metni"]?.value ?? "",
      href: fields["link"]?.value ?? fields["href"]?.value ?? "/",
      bgColor: fields["bg_color"]?.value ?? fields["bgColor"]?.value ?? "#F2F2F2",
      image: imageField?.reference?.image?.url ?? "",
      order: parseInt(fields["order"]?.value ?? fields["sira"]?.value ?? "0", 10),
    };
  });
}

export async function getProductMap(): Promise<Record<string, Product[]>> {
  const products = await getAllProducts();
  return {
    "best-sellers": products,
    "on-sale": products.filter((p) => p.originalPrice),
    "top-rated": [...products].sort((a, b) => b.rating - a.rating),
  };
}
