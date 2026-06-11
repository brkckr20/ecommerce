export interface ShopifyProduct {
  id: string;
  handle: string;
  title: string;
  tags: string[];
  descriptionHtml: string;
  availableForSale: boolean;
  totalInventory: number;
  priceRange: {
    minVariantPrice: { amount: string; currencyCode: string };
    maxVariantPrice: { amount: string; currencyCode: string };
  };
  compareAtPriceRange?: {
    minVariantPrice: { amount: string; currencyCode: string };
  };
  images: {
    edges: Array<{ node: { url: string; altText: string | null } }>;
  };
  variants: {
    edges: Array<{
      node: ShopifyVariant;
    }>;
  };
  options: Array<{
    name: string;
    values: string[];
  }>;
  collections: {
    edges: Array<{
      node: { id: string; handle: string; title: string };
    }>;
  };
  seo?: {
    title: string | null;
    description: string | null;
  };
}

export interface ShopifyVariant {
  id: string;
  title: string;
  sku: string;
  availableForSale: boolean;
  quantityAvailable: number;
  price: { amount: string; currencyCode: string };
  compareAtPrice?: { amount: string; currencyCode: string } | null;
  selectedOptions: Array<{ name: string; value: string }>;
  image?: { url: string } | null;
}

export interface ShopifyCollection {
  id: string;
  handle: string;
  title: string;
  descriptionHtml: string;
  image?: { url: string; altText: string | null } | null;
}

export interface ShopifyCollectionWithProducts extends ShopifyCollection {
  products: {
    edges: Array<{ node: ShopifyProduct }>;
  };
}

export interface ProductsResponse {
  products: {
    pageInfo: { hasNextPage: boolean; endCursor: string | null };
    edges: Array<{ node: ShopifyProduct }>;
  };
}

export interface ProductByHandleResponse {
  productByHandle: ShopifyProduct | null;
}

export interface CollectionsResponse {
  collections: {
    edges: Array<{ node: ShopifyCollection }>;
  };
}

export interface CollectionByHandleResponse {
  collectionByHandle: ShopifyCollectionWithProducts | null;
}

export interface ShopifyMenuItem {
  id: string;
  title: string;
  url: string | null;
  type: string;
  items: ShopifyMenuItem[];
}

export interface ShopifyMenu {
  id: string;
  handle: string;
  title: string;
  items: ShopifyMenuItem[];
}

export interface MenuResponse {
  menu: ShopifyMenu | null;
}

export interface ShopifyCustomer {
  id: string;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  phone: string | null;
  numberOfOrders?: number;
  defaultAddress?: ShopifyAddress | null;
  addresses?: { edges: Array<{ node: ShopifyAddress }> };
  orders?: { edges: Array<{ node: ShopifyOrder }> };
}

export interface ShopifyAddress {
  id: string;
  address1: string | null;
  address2: string | null;
  city: string | null;
  province: string | null;
  zip: string | null;
  country: string | null;
  phone: string | null;
  firstName: string | null;
  lastName: string | null;
}

export interface ShopifyOrder {
  id: string;
  name: string;
  totalPrice: { amount: string; currencyCode: string };
  processedAt: string;
  fulfillmentStatus: string;
  financialStatus: string;
  lineItems: {
    edges: Array<{
      node: {
        title: string;
        quantity: number;
        variant: { id: string; title: string; image: { url: string } | null } | null;
      };
    }>;
  };
}

export interface CustomerAccessTokenCreateResponse {
  customerAccessTokenCreate: {
    customerAccessToken: { accessToken: string; expiresAt: string } | null;
    customerUserErrors: Array<{ code: string; field: string[]; message: string }>;
  };
}

export interface CustomerCreateResponse {
  customerCreate: {
    customer: ShopifyCustomer | null;
    customerUserErrors: Array<{ code: string; field: string[]; message: string }>;
  };
}

export interface CustomerQueryResponse {
  customer: ShopifyCustomer | null;
}
