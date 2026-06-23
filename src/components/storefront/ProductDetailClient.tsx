"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import type { Product } from "@/data/products";
import { useCart } from "@/providers/CartProvider";
import { WishlistButton } from "./WishlistButton";
import ProductReviews from "./ProductReviews";
import { fetchReviewStats } from "@/lib/reviews";
import StarRating from "./StarRating";

interface Props {
  product: Product;
}

export function ProductDetailClient({ product }: Props) {
  const [activeImage, setActiveImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [selectedSize, setSelectedSize] = useState(product.sizes[0]);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<
    "details" | "shipping" | "reviews"
  >("details");

  const [reviewRating, setReviewRating] = useState(product.rating);
  const [reviewCount, setReviewCount] = useState(product.reviewCount);

  useEffect(() => {
    fetchReviewStats(product.href.replace("/products/", "")).then((s) => {
      if (s.count > 0) {
        setReviewRating(s.rating);
        setReviewCount(s.count);
      }
    });
  }, [product.href]);

  const handleReviewStatsUpdate = useCallback((rating: number, count: number) => {
    setReviewRating(rating);
    setReviewCount(count);
  }, []);

  const [zoom, setZoom] = useState({ show: false, x: 50, y: 50, lensX: 0, lensY: 0 });
  const imageRef = useRef<HTMLDivElement>(null);
  const addToCartBtnRef = useRef<HTMLButtonElement>(null);
  const { addToCartWithFly, addingProductId } = useCart();
  const LENS_SIZE = 180;

  const selectedVariant = product.variants.find(
    (v) => v.color === selectedColor && v.size === selectedSize
  );
  const variantStock = selectedVariant?.stock ?? 0;
  const variantId = selectedVariant?.variantId;

  const handleAddToCart = useCallback(() => {
    if (addingProductId === product.id || !addToCartBtnRef.current) return;
    const fromRect = addToCartBtnRef.current.getBoundingClientRect();
    addToCartWithFly(
      {
        productId: product.id,
        name: product.name,
        price: product.price,
        image: product.images[activeImage],
        size: selectedSize,
        color: selectedColor,
        quantity,
        slug: product.href.replace("/products/", ""),
        variantId,
      },
      fromRect,
      product.images[activeImage],
    );
  }, [product, activeImage, selectedSize, selectedColor, quantity, variantId, addToCartWithFly, addingProductId]);

  const isLoading = addingProductId === product.id;

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageRef.current) return;
    const rect = imageRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    const lensX = Math.max(0, Math.min(rect.width - LENS_SIZE, e.clientX - rect.left - LENS_SIZE / 2));
    const lensY = Math.max(0, Math.min(rect.height - LENS_SIZE, e.clientY - rect.top - LENS_SIZE / 2));
    setZoom({ show: true, x, y, lensX, lensY });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setZoom((prev) => ({ ...prev, show: false }));
  }, []);

  const decreaseQty = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };
  const increaseQty = () => {
    if (quantity < variantStock) setQuantity(quantity + 1);
  };

  return (
    <div className="entry-product-page-content">
      <div className="container-wide">
        <div className="page-breadcrumb py-4">
          <ul className="flex items-center gap-2 text-sm text-text">
            <li>
              <Link href="/" className="hover:text-primary transition-colors">
                Ana Sayfa
              </Link>
            </li>
            <li className="text-text-lighter">/</li>
            <li>
              <Link href="/" className="hover:text-primary transition-colors">
                Ürünler
              </Link>
            </li>
            <li className="text-text-lighter">/</li>
            <li>
              <Link
                href={`/product-category/${product.categories[0]?.toLowerCase().replace(/[^a-z0-9çğıöşü]+/g, "-").replace(/(^-|-$)/g, "") ?? ""}`}
                className="hover:text-primary transition-colors"
              >
                {product.categories[0]}
              </Link>
            </li>
            <li className="text-text-lighter">/</li>
            <li className="text-heading font-medium">{product.name}</li>
          </ul>
        </div>

        <div className="flex flex-col md:flex-row gap-8 md:gap-12 pb-16">
          <div className="w-full md:w-1/2">
              <div className="md:sticky md:top-24">
              <div className="woo-single-gallery thumbs-slider-vertical flex flex-col md:flex-row gap-3">
                <div className="order-1 md:order-none flex flex-row md:flex-col gap-2 overflow-x-auto md:overflow-visible shrink-0">
                  {product.images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImage(i)}
                      className={`w-14 h-[18px] md:w-[72px] md:h-[94px] flex-shrink-0 bg-background-grey border-2 transition-colors ${
                        activeImage === i
                          ? "border-heading"
                          : "border-border hover:border-text-lighter"
                      }`}
                    >
                      <Image
                        src={img}
                        alt={`${product.name} - ${i + 1}`}
                        width={56}
                        height={94}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>

                <div className="relative w-full md:w-[70%] aspect-[3/4]">
                  <div className="relative w-full h-full bg-background-grey group overflow-hidden" ref={imageRef}>
                    <div
                      className="flex h-full transition-transform duration-500 ease-out"
                      style={{ transform: `translateX(-${activeImage * 100}%)` }}
                      onMouseMove={handleMouseMove}
                      onMouseLeave={handleMouseLeave}
                    >
                      {product.images.map((img, i) => (
                        <div key={i} className="w-full h-full flex-shrink-0">
                          <Image
                            src={img}
                            alt={`${product.name} - ${i + 1}`}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ))}
                    </div>
                    {product.originalPrice && (
                      <span className="absolute top-4 left-4 bg-primary text-white text-xs font-semibold px-2.5 py-1 z-10">
                        İNDİRİM
                      </span>
                    )}

                    <button
                      onClick={() => setActiveImage(Math.max(0, activeImage - 1))}
                      disabled={activeImage === 0}
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full bg-white/80 hover:bg-white text-heading shadow-sm opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-0"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <button
                      onClick={() => setActiveImage(Math.min(product.images.length - 1, activeImage + 1))}
                      disabled={activeImage === product.images.length - 1}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full bg-white/80 hover:bg-white text-heading shadow-sm opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-0"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                    {zoom.show && (
                      <div
                        className="absolute z-20 hidden lg:block pointer-events-none border-2 border-white shadow-lg"
                        style={{
                          left: zoom.lensX,
                          top: zoom.lensY,
                          width: LENS_SIZE,
                          height: LENS_SIZE,
                          borderRadius: "50%",
                          backgroundImage: `url(${product.images[activeImage]})`,
                          backgroundSize: "500%",
                          backgroundRepeat: "no-repeat",
                          backgroundPosition: `${zoom.x}% ${zoom.y}%`,
                        }}
                      />
                    )}
                  </div>
                </div>
              </div>
              </div>
          </div>

          <div className="w-full md:w-1/2">
            <div className="sticky top-24">
              <h1 className="text-2xl md:text-3xl font-medium text-heading mb-3">
                {product.name}
              </h1>

              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center gap-1">
                  <StarRating rating={reviewRating} size="sm" />
                  <span className="text-sm text-text ml-1">
                    ({reviewCount} yorum)
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 mb-6">
                {product.originalPrice ? (
                  <>
                    <span className="text-2xl md:text-3xl font-semibold text-primary">
                      {product.price}
                    </span>
                    <span className="text-lg text-text-lighter line-through">
                      {product.originalPrice}
                    </span>
                  </>
                ) : (
                  <span className="text-2xl md:text-3xl font-semibold text-heading">
                    {product.price}
                  </span>
                )}
              </div>

              <div
                className="text-text text-sm leading-relaxed mb-8 prose"
                dangerouslySetInnerHTML={{ __html: product.description }}
              />

              <div className="mb-6">
                <label className="block text-sm font-medium text-heading mb-3">
                  Renk:{" "}
                  <span className="font-normal text-text">{selectedColor}</span>
                </label>
                <div className="flex items-center gap-3">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => {
                        setSelectedColor(color);
                        const hasCurrentSize = product.variants.some(
                          (v) => v.color === color && v.size === selectedSize && v.stock > 0
                        );
                        if (!hasCurrentSize) {
                          const firstAvailable = product.variants.find(
                            (v) => v.color === color && v.stock > 0
                          );
                          if (firstAvailable) setSelectedSize(firstAvailable.size);
                        }
                      }}
                      className={`w-8 h-8 rounded-full border-2 transition-all ${
                        selectedColor === color
                          ? "border-heading scale-110"
                          : "border-border-light-03 hover:border-text-lighter"
                      }`}
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                </div>
              </div>

              <div className="mb-8">
                <label className="block text-sm font-medium text-heading mb-3">
                  Beden:{" "}
                  <span className="font-normal text-text">{selectedSize}</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => {
                    const hasStock = product.variants.some(
                      (v) => v.color === selectedColor && v.size === size && v.stock > 0
                    );
                    return (
                      <button
                        key={size}
                        onClick={() => hasStock && setSelectedSize(size)}
                        disabled={!hasStock}
                        className={`px-4 py-2 text-sm border transition-all ${
                          selectedSize === size
                            ? "border-heading bg-heading text-white"
                            : !hasStock
                            ? "border-border text-[#ccc] line-through cursor-not-allowed"
                            : "border-border text-heading hover:border-heading"
                        }`}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center gap-4 mb-8">
                <div className="flex items-center border border-border">
                  <button
                    onClick={decreaseQty}
                    className="w-10 h-10 flex items-center justify-center text-heading hover:bg-background-grey transition-colors"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                    </svg>
                  </button>
                  <span className="w-14 text-center text-heading font-medium text-sm">
                    {quantity}
                  </span>
                  <button
                    onClick={increaseQty}
                    className="w-10 h-10 flex items-center justify-center text-heading hover:bg-background-grey transition-colors"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                </div>

                <button
                  ref={addToCartBtnRef}
                  onClick={handleAddToCart}
                  disabled={isLoading || variantStock === 0}
                  className="flex-1 bg-heading text-white text-sm font-medium py-2.5 px-6 hover:bg-primary transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {variantStock === 0 ? (
                    <span>Stokta Yok</span>
                  ) : isLoading ? (
                    <>
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      <span>Ekleniyor...</span>
                    </>
                  ) : (
                    <span>Sepete Ekle</span>
                  )}
                </button>

                <WishlistButton
                  item={{
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    originalPrice: product.originalPrice,
                    image: product.images[activeImage],
                    slug: product.href.replace("/products/", ""),
                  }}
                  className="w-10 h-10 flex items-center justify-center border border-border text-heading hover:bg-heading hover:text-white transition-all"
                  iconClass="w-4 h-4"
                />
              </div>

              <div className="border-t border-border pt-6 space-y-4 text-sm">
                <div className="flex items-center gap-3 text-text">
                  <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                  </svg>
                  <span>
                    Tahmini Teslimat:{" "}
                    <span className="text-heading font-medium">23 - 30 Mayıs 2026</span>
                  </span>
                </div>
                <div className="flex items-center gap-3 text-text">
                  <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 15v-1a4 4 0 00-4-4H8m0 0l3 3m-3-3l3-3m9 14V5a2 2 0 00-2-2H6a2 2 0 00-2 2v16l4-2 4 2 4-2 4 2z" />
                  </svg>
                  <span>
                    Ücretsiz Kargo & İade:{" "}
                    <span className="text-heading font-medium">
                      200 $ ve üzeri alışverişlerde
                    </span>
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-text">Stok Kodu:</span>
                  <span className="text-sm text-heading">{product.sku}</span>
                  <span className="text-text-lighter">|</span>
                  <span className="text-sm text-text">Kategori:</span>
                  <Link href="/" className="text-sm text-heading hover:text-primary transition-colors">
                    {product.categories.join(", ")}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-border mb-16">
          <div className="flex border-b border-border">
            {[
              { id: "details" as const, label: "Ürün Detayları" },
              { id: "shipping" as const, label: "Kargo ve İade" },
              { id: "reviews" as const, label: "Yorumlar" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-4 text-sm font-medium transition-colors relative ${
                  activeTab === tab.id
                    ? "text-heading"
                    : "text-text-lighter hover:text-heading"
                }`}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-heading" />
                )}
              </button>
            ))}
          </div>

          <div className="py-8">
            {activeTab === "details" && (
              <div className="max-w-3xl">
                <div className="text-text leading-relaxed prose" dangerouslySetInnerHTML={{ __html: product.description }} />
                <div className="grid grid-cols-2 gap-8 mt-8">
                  <div>
                    <h4 className="text-sm font-medium text-heading mb-4">
                      Bilgiler
                    </h4>
                    <ul className="space-y-2 text-sm text-text">
                      <li className="flex gap-2">
                        <span className="text-heading">•</span> Premium kalite pamuk
                      </li>
                      <li className="flex gap-2">
                        <span className="text-heading">•</span> Makinede yıkanabilir
                      </li>
                      <li className="flex gap-2">
                        <span className="text-heading">•</span> Hipoalerjenik malzeme
                      </li>
                      <li className="flex gap-2">
                        <span className="text-heading">•</span> Cilt dostu kumaş
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-heading mb-4">
                      Özellikler
                    </h4>
                    <ul className="space-y-2 text-sm text-text">
                      <li>
                        <span className="text-heading font-medium">Malzeme:</span> %100 Pamuk
                      </li>
                      <li>
                        <span className="text-heading font-medium">Ağırlık:</span> 150g
                      </li>
                      <li>
                        <span className="text-heading font-medium">Bakım:</span> 30°C&rsquo;de makinede yıkanabilir
                      </li>
                      <li>
                        <span className="text-heading font-medium">Menşei:</span> Türkiye
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
            {activeTab === "shipping" && (
              <div className="max-w-3xl">
                <h4 className="text-base font-medium text-heading mb-4">
                  Kargo Bilgisi
                </h4>
                <p className="text-text text-sm leading-relaxed mb-6">
                  200 $ ve üzeri alışverişlerde ücretsiz kargo. Siparişler 1-2 iş günü
                  içinde işlenir ve 5-7 iş günü içinde teslim edilir. Satın alma
                  tarihinden itibaren 30 gün içinde kolay iade imkanı.
                </p>
                <h4 className="text-base font-medium text-heading mb-4">
                  İade Politikası
                </h4>
                <p className="text-text text-sm leading-relaxed">
                  Ürünler teslimattan itibaren 30 gün içinde orijinal durumda iade
                  edilebilir. İadeler, ürünlerin bize ulaşmasından sonra 5-7 iş
                  günü içinde işleme alınır.
                </p>
              </div>
            )}
            {activeTab === "reviews" && (
              <div className="max-w-3xl">
                <ProductReviews
                  productSlug={product.href.replace("/products/", "")}
                  variantIds={product.variants.map((v) => v.variantId).filter(Boolean) as string[]}
                  onStatsUpdate={handleReviewStatsUpdate}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
