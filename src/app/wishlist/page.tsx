"use client";

import Link from "next/link";
import { useWishlist } from "@/providers/WishlistProvider";
import { WishlistButton } from "@/components/storefront/WishlistButton";
import { Header, Footer } from "@/components/storefront";
import PageMeta from "@/components/storefront/PageMeta";

export default function WishlistPage() {
  const { items, wishlistIds } = useWishlist();

  return (
    <div className="min-h-screen bg-white">
      <PageMeta title="Favorilerim" description="Beğendiğiniz ürünleri favorilerinize ekleyin ve daha sonra satın alın." />
      <Header />
      <div className="max-w-[1510px] mx-auto px-4 md:px-8 py-8 md:py-16">
        <h1 className="text-2xl md:text-3xl font-medium text-heading mb-2">
          Favorilerim
        </h1>
        <p className="text-text text-sm mb-8">
          {items.length === 0
            ? "Henüz favori ürününüz bulunmuyor."
            : `${items.length} ürün`}
        </p>

        {items.length === 0 ? (
          <div className="text-center py-20">
            <svg
              className="w-16 h-16 mx-auto text-text-lighter mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
            <p className="text-text text-sm mb-6">
              Favori listenizi oluşturmak için ürünlerin yanındaki kalp
              ikonuna tıklayın.
            </p>
            <Link
              href="/"
              className="inline-block bg-heading text-white text-sm font-medium py-2.5 px-6 hover:bg-primary transition-colors"
            >
              Alışverişe Başla
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {items.map((item) => (
              <div key={item.id} className="group bg-white">
                <div className="relative overflow-hidden bg-background-grey">
                  <Link
                    href={`/products/${item.slug}`}
                    className="block"
                    style={{ paddingBottom: "133.33%" }}
                  >
                    <div
                      className="absolute inset-0 bg-cover bg-center"
                      style={{ backgroundImage: `url(${item.image})` }}
                    />
                  </Link>
                  <div className="absolute top-3 right-3 z-10">
                    <WishlistButton
                      item={item}
                      className="flex items-center justify-center w-[38px] h-[38px] bg-white rounded-full text-heading hover:bg-heading hover:text-white transition-all duration-300"
                      iconClass="w-[14px] h-[14px]"
                    />
                  </div>
                  {item.originalPrice && (
                    <span className="absolute top-3 left-3 bg-primary text-white text-xs font-semibold px-2.5 py-1 z-10">
                      İNDİRİM
                    </span>
                  )}
                </div>
                <div className="p-3 md:p-4">
                  <Link href={`/products/${item.slug}`}>
                    <h3 className="text-sm md:text-base text-heading font-medium leading-snug mb-2 line-clamp-2 hover:text-primary transition-colors">
                      {item.name}
                    </h3>
                  </Link>
                  <div className="flex items-center gap-2">
                    {item.originalPrice ? (
                      <>
                        <span className="text-primary text-sm md:text-base font-semibold">
                          {item.price}
                        </span>
                        <span className="text-text-lighter text-xs md:text-sm line-through">
                          {item.originalPrice}
                        </span>
                      </>
                    ) : (
                      <span className="text-heading text-sm md:text-base font-semibold">
                        {item.price}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
