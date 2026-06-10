export interface ProductVariant {
  color: string;
  size: string;
  sku: string;
  stock: number;
  variantId?: string;
}

export interface Product {
  id: number;
  name: string;
  price: string;
  originalPrice?: string;
  image: string;
  hoverImage: string;
  images: string[];
  href: string;
  variants: ProductVariant[];
  colors: string[];
  sizes: string[];
  description: string;
  categories: string[];
  sku: string;
  rating: number;
  reviewCount: number;
  stock: number;
}

export interface ProductCategory {
  slug: string;
  name: string;
  parent?: string;
  description: string;
  image?: string;
  productIds: number[];
  order: number;
}
