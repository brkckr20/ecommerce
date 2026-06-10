"use client";

import { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import type { SwiperClass } from "swiper/react";
import Link from "next/link";

import "swiper/css";
import "swiper/css/pagination";

interface Slide {
  id: number | string;
  title: string;
  subtitle: string;
  cta: string;
  href: string;
  bgColor: string;
  image: string;
  order: number;
}

function SlideBackground({ image, bgColor, isActive }: { image: string; bgColor: string; isActive: boolean }) {
  return (
    <div
      className="absolute inset-0 bg-cover bg-center"
      style={{
        backgroundColor: bgColor,
        backgroundImage: `url(${image})`,
        transform: isActive ? "scale(1.08)" : "scale(1)",
        transition: isActive ? "transform 8s ease-in-out" : "none",
      }}
    />
  );
}

export function BannerSlider({ slides = [] }: { slides?: Slide[] }) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (slides.length === 0) return null;

  return (
    <section className="relative">
      <Swiper
        modules={[Autoplay, Pagination]}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        loop
        className="select-none"
        onSlideChange={(swiper: SwiperClass) => setActiveIndex(swiper.realIndex)}
      >
        {slides.sort((a, b) => (a.order || 0) - (b.order || 0)).map((slide, i) => (
          <SwiperSlide key={slide.id}>
            <div className="relative flex items-center min-h-[400px] md:min-h-[500px] lg:min-h-[600px] overflow-hidden">
              <SlideBackground image={slide.image} bgColor={slide.bgColor} isActive={i === activeIndex} />
              <div className="relative z-10 max-w-[1510px] mx-auto px-4 md:px-8 w-full">
                <div className="max-w-lg">
                  <span className="text-heading/60 text-sm uppercase tracking-[0.2em] mb-4 block">
                    {slide.subtitle}
                  </span>
                  <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8 leading-tight text-heading">
                    {slide.title}
                  </h2>
                  {slide.cta && (
                    <Link
                      href={slide.href}
                      className="inline-flex items-center gap-2 bg-heading text-white font-medium px-8 py-3 hover:bg-primary hover:text-white transition-colors duration-200"
                    >
                      {slide.cta}
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M6 12L10 8L6 4" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
