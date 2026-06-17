import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Siparişlerim",
  alternates: { canonical: "https://minimog.com.tr/siparislerim" },
};

export default function OrdersLayout({ children }: { children: React.ReactNode }) {
  return children;
}
