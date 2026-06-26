import Link from "next/link";
import { Header, Footer } from "@/components/storefront";

export default function NotFound() {
  return (
    <>
      <Header />
      <div className="min-h-[60vh] flex items-center justify-center bg-white">
        <div className="text-center px-4">
          <h1 className="text-8xl md:text-9xl font-bold text-heading mb-4">404</h1>
          <p className="text-lg text-text mb-8">
            Aradığınız sayfa bulunamadı.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-heading text-white font-medium px-8 py-3 hover:bg-primary transition-colors duration-200 rounded-lg"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Ana Sayfaya Dön
          </Link>
        </div>
      </div>
      <Footer />
    </>
  );
}
