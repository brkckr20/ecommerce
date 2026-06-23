import type { Metadata } from "next";
import "./globals.css";
import { CartProvider, WishlistProvider, ShopifyCustomerProvider } from "@/providers";
import { CookieConsent, CartDrawer, FlyToCart } from "@/components/storefront";
import Link from "next/link";

const BASE_URL = "https://somni.com.tr";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "Somni",
    template: "Somni · %s",
  },
  description: "Somni – Bebek & Çocuk Giyim",
  icons: {
    icon: "/favicon.png",
  },
  openGraph: {
    type: "website",
    locale: "tr_TR",
    siteName: "Somni",
    title: "Somni – Bebek & Çocuk Giyim",
    description: "Somni – Bebek & Çocuk Giyim",
    url: BASE_URL,
  },
  twitter: {
    card: "summary_large_image",
    title: "Somni – Bebek & Çocuk Giyim",
    description: "Somni – Bebek & Çocuk Giyim",
  },
  verification: {
    google: "YOUR_GOOGLE_VERIFICATION_CODE",
    yandex: "YOUR_YANDEX_VERIFICATION_CODE",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Somni",
    url: BASE_URL,
    logo: `${BASE_URL}/icon.svg`,
    contactPoint: {
      "@type": "ContactPoint",
      email: "info@somni.com.tr",
      contactType: "customer service",
    },
  };

  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Somni",
    url: BASE_URL,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${BASE_URL}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <html lang="tr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://cdn.shopify.com" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
      </head>
      <body>
        <ShopifyCustomerProvider>
          <CartProvider>
            <WishlistProvider>
              {children}
              <FlyToCart />
              <CartDrawer />
              <CookieConsent />
            </WishlistProvider>
          </CartProvider>
        </ShopifyCustomerProvider>
      </body>
    </html>
  );
}
