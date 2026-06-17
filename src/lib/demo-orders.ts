import type { ShopifyOrder } from "@/lib/shopify-types";

const now = new Date();

const demoOrders: ShopifyOrder[] = [
  {
    id: "gid://shopify/Order/demo-1001",
    name: "#1001",
    totalPrice: { amount: "899.00", currencyCode: "TRY" },
    subtotalPrice: { amount: "749.00", currencyCode: "TRY" },
    totalShippingPrice: { amount: "49.90", currencyCode: "TRY" },
    totalTax: { amount: "100.10", currencyCode: "TRY" },
    processedAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    fulfillmentStatus: "FULFILLED",
    financialStatus: "PAID",
    shippingAddress: {
      id: "gid://shopify/MailingAddress/demo-1",
      address1: "Atatürk Cad. No:42",
      address2: "Daire:5",
      city: "İstanbul",
      province: "Kadıköy",
      zip: "34700",
      country: "Türkiye",
      phone: "+90 532 123 45 67",
      firstName: "Ayşe",
      lastName: "Yılmaz",
    },
    lineItems: {
      edges: [
        {
          node: {
            title: "Bebek Bodysuit - Pamuklu",
            quantity: 2,
            variant: {
              id: "gid://shopify/ProductVariant/demo-1",
              title: "Mavi / 6-12 Ay",
              image: { url: "https://images.unsplash.com/photo-1522771930-78848d9293e8?w=200&h=200&fit=crop" },
              price: { amount: "249.50", currencyCode: "TRY" },
            },
          },
        },
        {
          node: {
            title: "Çocuk Pijama Takımı",
            quantity: 1,
            variant: {
              id: "gid://shopify/ProductVariant/demo-2",
              title: "Pembe / 3-4 Yaş",
              image: { url: "https://images.unsplash.com/photo-1519457431-44ccd64a579b?w=200&h=200&fit=crop" },
              price: { amount: "250.00", currencyCode: "TRY" },
            },
          },
        },
      ],
    },
  },
  {
    id: "gid://shopify/Order/demo-1002",
    name: "#1002",
    totalPrice: { amount: "1299.00", currencyCode: "TRY" },
    subtotalPrice: { amount: "1199.00", currencyCode: "TRY" },
    totalShippingPrice: { amount: "0.00", currencyCode: "TRY" },
    totalTax: { amount: "100.00", currencyCode: "TRY" },
    processedAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    fulfillmentStatus: "UNFULFILLED",
    financialStatus: "PAID",
    shippingAddress: {
      id: "gid://shopify/MailingAddress/demo-2",
      address1: "Bağdat Cad. No:150",
      address2: "",
      city: "İstanbul",
      province: "Maltepe",
      zip: "34840",
      country: "Türkiye",
      phone: "+90 555 987 65 43",
      firstName: "Mehmet",
      lastName: "Demir",
    },
    lineItems: {
      edges: [
        {
          node: {
            title: "Bebek Battaniyesi - Polar",
            quantity: 1,
            variant: {
              id: "gid://shopify/ProductVariant/demo-3",
              title: "Krem / 80x100 cm",
              image: { url: "https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=200&h=200&fit=crop" },
              price: { amount: "399.00", currencyCode: "TRY" },
            },
          },
        },
        {
          node: {
            title: "Muslin Önlük 3'lü Set",
            quantity: 2,
            variant: {
              id: "gid://shopify/ProductVariant/demo-4",
              title: "Desenli",
              image: { url: "https://images.unsplash.com/photo-1584654537739-46f7e8489e78?w=200&h=200&fit=crop" },
              price: { amount: "200.00", currencyCode: "TRY" },
            },
          },
        },
        {
          node: {
            title: "Bebek Şapka - Güneş Koruyucu",
            quantity: 1,
            variant: {
              id: "gid://shopify/ProductVariant/demo-5",
              title: "Beyaz / 0-6 Ay",
              image: { url: "https://images.unsplash.com/photo-1503457574462-bd270a1e3ca4?w=200&h=200&fit=crop" },
              price: { amount: "150.00", currencyCode: "TRY" },
            },
          },
        },
      ],
    },
  },
  {
    id: "gid://shopify/Order/demo-1003",
    name: "#1003",
    totalPrice: { amount: "549.90", currencyCode: "TRY" },
    subtotalPrice: { amount: "459.90", currencyCode: "TRY" },
    totalShippingPrice: { amount: "49.90", currencyCode: "TRY" },
    totalTax: { amount: "40.10", currencyCode: "TRY" },
    processedAt: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    fulfillmentStatus: "FULFILLED",
    financialStatus: "REFUNDED",
    shippingAddress: {
      id: "gid://shopify/MailingAddress/demo-3",
      address1: "Cumhuriyet Mah. Çiçek Sok. No:8",
      address2: "A Blok Kat:3",
      city: "Ankara",
      province: "Çankaya",
      zip: "06600",
      country: "Türkiye",
      phone: "+90 536 456 78 90",
      firstName: "Zeynep",
      lastName: "Kara",
    },
    lineItems: {
      edges: [
        {
          node: {
            title: "Kız Çocuk Elbise - Tül Etekli",
            quantity: 1,
            variant: {
              id: "gid://shopify/ProductVariant/demo-6",
              title: "Lila / 5-6 Yaş",
              image: { url: "https://images.unsplash.com/photo-1597248881519-db089f22d7b0?w=200&h=200&fit=crop" },
              price: { amount: "459.90", currencyCode: "TRY" },
            },
          },
        },
      ],
    },
  },
];

export function getDemoOrders(): ShopifyOrder[] {
  return demoOrders;
}
