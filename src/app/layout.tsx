import type { Metadata } from "next";
import "./globals.css";
import { CartProvider, WishlistProvider, ShopifyCustomerProvider } from "@/providers";
import { CookieConsent, CartDrawer, FlyToCart } from "@/components/storefront";

const BASE_URL = "https://minimog.com.tr";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "eCommerce",
    template: "eCommerce · %s",
  },
  description: "Baby & Kids Textile E-Commerce",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
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
