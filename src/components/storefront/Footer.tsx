"use client";

import Link from "next/link";
import { useState } from "react";
import { FeaturesBar } from "./FeaturesBar";
import InstagramLightbox from "./InstagramLightbox";

const footerLinks = {
  information: [
    { label: "Hesabım", href: "/hesabim" },
    { label: "Giriş Yap", href: "/login" },
    { label: "Sepetim", href: "/cart" },
    { label: "Favorilerim", href: "/wishlist" },
  ],
  services: [
    { label: "Hakkımızda", href: "/hakkimizda" },

    { label: "Teslimat Bilgileri", href: "/teslimat" },
    { label: "Gizlilik Politikası", href: "/gizlilik-politikasi" },
    { label: "Kullanım Koşulları", href: "/kullanim-kosullari" },
  ],
};

const trustBadges = [
  { label: "Güvenli Alışveriş", icon: "lock" },
  { label: "SSL Sertifikalı", icon: "check" },
  { label: "İade Garantisi", icon: "return" },
  { label: "Müşteri Hizmetleri", icon: "phone" },
];

const instagramPosts = [
  "https://picsum.photos/seed/footer-ig-1/300/300",
  "https://picsum.photos/seed/footer-ig-2/300/300",
  "https://picsum.photos/seed/footer-ig-3/300/300",
  "https://picsum.photos/seed/footer-ig-4/300/300",
  "https://picsum.photos/seed/footer-ig-5/300/300",
  "https://picsum.photos/seed/footer-ig-6/300/300",
];

export function Footer() {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const nextImage = () => {
    setLightboxIndex((prev) =>
      prev !== null ? (prev + 1) % instagramPosts.length : null
    );
  };

  const prevImage = () => {
    setLightboxIndex((prev) =>
      prev !== null ? (prev - 1 + instagramPosts.length) % instagramPosts.length : null
    );
  };

  return (
    <footer className="page-footer">
      <FeaturesBar />

      <div className="bg-[#F5F5F5] py-[30px] md:py-[30px] border-b border-[#DEDEDE]">
        <div className="max-w-[1510px] mx-auto px-4 md:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-xs text-text-lighter uppercase tracking-wider font-medium">
              Instagram <span className="text-primary">@somni</span>
            </h4>
            <a href="#" className="text-xs text-text hover:text-primary transition-colors font-medium">
              Takip Et
            </a>
          </div>
          <div className="grid grid-cols-6 gap-1.5 md:gap-2">
            {instagramPosts.map((src, i) => (
              <button
                key={i}
                onClick={() => setLightboxIndex(i)}
                className="block w-full aspect-square bg-background-grey overflow-hidden group cursor-pointer text-left"
                aria-label={`Instagram post ${i + 1}`}
              >
                <div
                  className="w-full h-full bg-cover bg-center group-hover:scale-110 transition-transform duration-500"
                  style={{ backgroundImage: `url(${src})` }}
                />
              </button>
            ))}
          </div>
        </div>
      </div>

      {lightboxIndex !== null && (
        <InstagramLightbox
          images={instagramPosts}
          currentIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onNext={nextImage}
          onPrev={prevImage}
        />
      )}

      <div className="bg-[#F5F5F5] py-[30px] md:py-[50px]">
        <div className="max-w-[1510px] mx-auto px-4 md:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            <div>
              <h4 className="text-lg font-semibold text-heading mb-4">Şirket</h4>
              <Link href="/">
                <span className="text-2xl font-bold font-heading text-heading tracking-wider block mb-4">
                  SOMNI
                </span>
              </Link>

              <ul className="space-y-2">
                <li>
                  <a href="mailto:hello@domain.com" className="text-sm text-text hover:text-primary transition-colors">
                    hello@domain.com
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-heading mb-4">Bilgiler</h4>
              <ul className="space-y-2">
                {footerLinks.information.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-sm text-text hover:text-primary transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-heading mb-4">Hizmetler</h4>
              <ul className="space-y-2">
                {footerLinks.services.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-sm text-text hover:text-primary transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-heading mb-4">Bülten</h4>
              <p className="text-sm text-text leading-relaxed mb-5">
                Yeni koleksiyonlardan ve ürün lansmanlarından ilk siz haberdar olun.
              </p>
              <form className="flex">
                <div className="relative flex-1">
                  <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-lighter" fill="currentColor" viewBox="0 0 512 512">
                    <path d="M502.3 190.8c3.9-3.1 9.7-.2 9.7 4.7V400c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V195.6c0-5 5.7-7.8 9.7-4.7 22.4 17.4 52.1 39.5 154.1 113.6 21.1 15.4 56.7 47.8 92.2 47.6 35.7.3 72-32.8 92.3-47.6 102-74.1 131.6-96.3 154.1-113.7zM256 320c23.2.4 56.6-29.2 73.4-41.4 132.7-96.3 142.8-104.7 173.4-128.7 5.8-4.5 9.2-11.5 9.2-18.9v-19c0-26.5-21.5-48-48-48H48C21.5 64 0 85.5 0 112v19c0 7.4 3.4 14.3 9.2 18.9 30.6 23.9 40.7 32.4 173.4 128.7 16.8 12.2 50.2 41.8 73.4 41.4z" />
                  </svg>
                  <input
                    type="email"
                    placeholder="E-posta adresiniz"
                    required
                    className="w-full pl-10 pr-4 py-3 text-sm border border-border rounded-l bg-white text-heading placeholder:text-text-lighter focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
                <button
                  type="submit"
                  className="px-5 py-3 bg-heading text-white text-sm font-medium hover:bg-primary transition-colors rounded-r"
                >
                  Kaydol
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#F5F5F5] border-t border-[#DEDEDE]">
        <div className="max-w-[1510px] mx-auto px-4 md:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 py-4">
            <div className="flex items-center gap-4">
              <span className="text-xs text-text-lighter uppercase tracking-wider font-medium">Bizi Takip Edin</span>
              <div className="flex items-center gap-2">
                <a href="#" aria-label="Pinterest" className="w-8 h-8 flex items-center justify-center rounded-full border border-border text-text hover:text-heading hover:border-heading transition-colors">
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 384 512">
                    <path d="M204 6.5C101.4 6.5 0 74.9 0 185.6 0 256 39.6 296 63.6 296c9.9 0 15.6-27.6 15.6-35.4 0-9.3-23.7-29.1-23.7-67.8 0-80.4 61.2-137.4 140.4-137.4 68.1 0 118.5 38.7 118.5 109.8 0 53.1-21.3 152.7-90.3 152.7-24.9 0-46.2-18-46.2-43.8 0-37.8 26.4-74.4 26.4-113.4 0-66.2-93.9-54.2-93.9 25.8 0 16.8 2.1 35.4 9.6 50.7-13.8 59.4-42 147.9-42 209.1 0 18.9 2.7 37.5 4.5 56.4 3.4 3.8 1.7 3.4 6.9 1.5 50.4-69 48.6-82.5 71.4-172.8 12.3 23.4 44.1 36 69.3 36 106.2 0 153.9-103.5 153.9-196.8C384 71.3 298.2 6.5 204 6.5z" />
                  </svg>
                </a>
                <a href="#" aria-label="Facebook" className="w-8 h-8 flex items-center justify-center rounded-full border border-border text-text hover:text-heading hover:border-heading transition-colors">
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 320 512">
                    <path d="M279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.43 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z" />
                  </svg>
                </a>
                <a href="#" aria-label="Instagram" className="w-8 h-8 flex items-center justify-center rounded-full border border-border text-text hover:text-heading hover:border-heading transition-colors">
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 448 512">
                    <path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z" />
                  </svg>
                </a>
                <a href="#" aria-label="Twitter" className="w-8 h-8 flex items-center justify-center rounded-full border border-border text-text hover:text-heading hover:border-heading transition-colors">
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 512 512">
                    <path d="M459.37 151.716c.325 4.548.325 9.097.325 13.645 0 138.72-105.583 298.558-298.558 298.558-59.452 0-114.68-17.219-161.137-47.106 8.447.974 16.568 1.299 25.34 1.299 49.055 0 94.213-16.568 130.274-44.832-46.132-.975-84.792-31.188-98.112-72.772 6.498.974 12.995 1.624 19.818 1.624 9.421 0 18.843-1.3 27.614-3.573-48.081-9.747-84.143-51.98-84.143-102.985v-1.299c13.969 7.797 30.214 12.67 47.431 13.319-28.264-18.843-46.781-51.005-46.781-87.391 0-19.492 5.197-37.36 14.294-52.954 51.655 63.675 129.3 105.258 216.365 109.807-1.624-7.797-2.599-15.918-2.599-24.04 0-57.828 46.782-104.934 104.934-104.934 30.213 0 57.502 12.67 76.67 33.137 23.715-4.548 46.456-13.32 66.599-25.34-7.798 24.366-24.366 44.833-46.132 57.827 21.117-2.273 41.584-8.122 60.426-16.243-14.292 20.791-32.161 39.308-52.628 54.253z" />
                  </svg>
                </a>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs text-text-lighter uppercase tracking-wider font-medium">Ödeme</span>
              <div className="flex items-center gap-2">
                <div className="w-10 h-7 bg-white rounded border border-border flex items-center justify-center px-1">
                  <svg viewBox="0 0 50 30" className="w-full h-full">
                    <rect width="50" height="30" fill="#1A1F71" rx="3" />
                    <text x="10" y="20" fill="white" fontSize="8" fontWeight="bold">VISA</text>
                  </svg>
                </div>
                <div className="w-10 h-7 bg-white rounded border border-border flex items-center justify-center px-1">
                  <svg viewBox="0 0 50 30" className="w-full h-full">
                    <rect width="50" height="30" fill="#F79E1B" rx="3" />
                    <text x="8" y="20" fill="white" fontSize="7" fontWeight="bold" letterSpacing="-0.5">MC</text>
                  </svg>
                </div>
                <div className="w-10 h-7 bg-white rounded border border-border flex items-center justify-center px-1">
                  <svg viewBox="0 0 50 30" className="w-full h-full">
                    <rect width="50" height="30" fill="#003087" rx="3" />
                    <text x="4" y="20" fill="white" fontSize="6" fontWeight="bold">PayPal</text>
                  </svg>
                </div>
                <div className="w-10 h-7 bg-white rounded border border-border flex items-center justify-center px-1 hidden sm:flex">
                  <svg viewBox="0 0 50 30" className="w-full h-full">
                    <rect width="50" height="30" fill="#2C2C2C" rx="3" />
                    <text x="8" y="20" fill="white" fontSize="7" fontWeight="bold">AMEX</text>
                  </svg>
                </div>
                <div className="w-10 h-7 bg-white rounded border border-border flex items-center justify-center px-1 hidden sm:flex">
                  <svg viewBox="0 0 50 30" className="w-full h-full">
                    <rect width="50" height="30" fill="black" rx="3" />
                    <text x="4" y="20" fill="white" fontSize="6" fontWeight="bold">Apple</text>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-[#DEDEDE] py-6">
        <div className="max-w-[1510px] mx-auto px-4 md:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-center gap-x-8 md:gap-x-16 gap-y-4 mb-6">
            {trustBadges.map((badge) => (
                <div key={badge.label} className="flex items-center gap-1.5">
                  <span className="w-5 h-5 flex items-center justify-center rounded-full bg-primary/10 text-primary">
                    {badge.icon === "lock" ? (
                      <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    ) : badge.icon === "check" ? (
                      <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : badge.icon === "return" ? (
                      <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                    ) : (
                      <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    )}
                  </span>
                  <span className="text-[11px] text-text uppercase tracking-wider font-medium">
                    {badge.label}
                  </span>
                </div>
              ))}
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-4 border-t border-border">
            <p className="text-xs text-text-lighter">
              &copy; somni {new Date().getFullYear()} — Tüm hakları saklıdır
            </p>
            <div className="flex items-center gap-4 text-[11px] text-text-lighter">
              <Link href="/gizlilik-politikasi" className="hover:text-primary transition-colors">Gizlilik Politikası</Link>
              <Link href="/kullanim-kosullari" className="hover:text-primary transition-colors">Kullanım Koşulları</Link>
              <Link href="/cerez-politikasi" className="hover:text-primary transition-colors">Çerez Politikası</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
