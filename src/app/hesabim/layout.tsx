import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hesabım",
  alternates: { canonical: "https://somni.com.tr/hesabim" },
};

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return children;
}
