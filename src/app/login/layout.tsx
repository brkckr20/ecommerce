import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Giriş Yap",
  alternates: { canonical: "https://minimog.com.tr/login" },
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return children;
}
