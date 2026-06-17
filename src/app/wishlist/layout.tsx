import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Favorilerim",
  alternates: { canonical: "https://minimog.com.tr/wishlist" },
};

export default function WishlistLayout({ children }: { children: React.ReactNode }) {
  return children;
}
