import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sepetim",
  alternates: { canonical: "https://somni.com.tr/cart" },
};

export default function CartLayout({ children }: { children: React.ReactNode }) {
  return children;
}
