"use client";

import { useRef, useMemo } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import type { SwiperClass } from "swiper/react";
import Link from "next/link";
import type { NavMenuItem, CollectionCount } from "@/data/shopify.server";

import "swiper/css";
import "swiper/css/navigation";

interface Props {
  navItems: NavMenuItem[];
  collectionCounts: CollectionCount[];
}

function extractHandle(href: string): string {
  const clean = href.split("?")[0].replace(/\/+$/, "");
  const segments = clean.split("/");
  return segments[segments.length - 1] || "";
}

const BG_COLORS = [
  "#F5E6E8", "#E8F0F5", "#F0F5E8", "#F5F0E8",
  "#E8E8F5", "#F5E8F0", "#E8F5F0", "#F0E8F5",
  "#F5F0F0", "#F0F0E8",
];

export function SeasonCollection({ navItems, collectionCounts }: Props) {
  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);

  const collectionMap = useMemo(() => {
    const map = new Map<string, CollectionCount>();
    for (const c of collectionCounts) {
      map.set(c.handle, c);
    }
    return map;
  }, [collectionCounts]);

  const slides = useMemo(() => {
    const result: { name: string; href: string; count: number; image: string | null; bgColor: string }[] = [];
    for (let i = 0; i < navItems.length; i++) {
      const nav = navItems[i];
      let totalCount = 0;
      let firstImage: string | null = nav.image;
      for (const child of nav.children) {
        const handle = extractHandle(child.href);
        const col = collectionMap.get(handle);
        if (col) {
          totalCount += col.productCount;
          if (!firstImage && col.image) firstImage = col.image;
        }
      }
      result.push({
        name: nav.name,
        href: nav.href,
        count: totalCount,
        image: firstImage,
        bgColor: BG_COLORS[i % BG_COLORS.length],
      });
    }
    return result;
  }, [navItems, collectionMap]);

  return (
    <section className="py-16 md:py-24">
      <div className="container-wide">
        <div className="flex items-center justify-between mb-10 md:mb-14">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-heading">
            Kategoriler
          </h2>
          <div className="flex items-center gap-2">
            <button
              ref={prevRef}
              className="flex items-center justify-center w-11 h-11 border border-border rounded-full hover:bg-heading hover:text-white hover:border-heading transition-all duration-200 text-heading"
              aria-label="Önceki"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M10 12L6 8L10 4" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <button
              ref={nextRef}
              className="flex items-center justify-center w-11 h-11 border border-border rounded-full hover:bg-heading hover:text-white hover:border-heading transition-all duration-200 text-heading"
              aria-label="Sonraki"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 12L10 8L6 4" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>

        {slides.length === 0 ? (
          <p className="text-text text-center py-10">Henüz kategori bulunmuyor.</p>
        ) : (
          <Swiper
            modules={[Navigation]}
            navigation={{
              prevEl: prevRef.current,
              nextEl: nextRef.current,
            }}
            onInit={(swiper: SwiperClass) => {
              if (swiper.params.navigation && typeof swiper.params.navigation !== "boolean") {
                swiper.params.navigation.prevEl = prevRef.current;
                swiper.params.navigation.nextEl = nextRef.current;
                swiper.navigation.init();
                swiper.navigation.update();
              }
            }}
            spaceBetween={20}
            breakpoints={{
              640: { slidesPerView: 2, spaceBetween: 20 },
              768: { slidesPerView: 3, spaceBetween: 24 },
              1024: { slidesPerView: 4, spaceBetween: 30 },
            }}
            loop={slides.length > 4}
            className="select-none"
          >
            {slides.map((slide, i) => (
              <SwiperSlide key={`${slide.href}-${i}`}>
                <Link href={slide.href} className="group block">
                  <div className="relative overflow-hidden" style={{ paddingBottom: "135%" }}>
                    <div
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                      style={{
                        backgroundImage: slide.image ? `url(${slide.image})` : undefined,
                        backgroundColor: slide.bgColor,
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-5 md:p-6">
                      <h3 className="text-white text-base md:text-lg font-semibold mb-1">
                        {slide.name}
                      </h3>
                      <span className="text-white/80 text-sm">
                        {slide.count} ürün
                      </span>
                    </div>
                  </div>
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </div>
    </section>
  );
}
