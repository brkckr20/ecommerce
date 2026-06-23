"use client";

import { useState, useRef, useCallback } from "react";
import Link from "next/link";
import type { Product } from "@/data/products";
import { useCart } from "@/providers/CartProvider";
import { QuickViewModal } from "./QuickViewModal";
import { WishlistButton } from "./WishlistButton";

interface Props {
  product: Product;
}

export function ProductCard({ product }: Props) {
  const [quickViewOpen, setQuickViewOpen] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);
  const { addToCartWithFly, addingProductId } = useCart();
  const isLoading = addingProductId === product.id;
  const hasOptions = product.sizes.length > 1;
  const defaultVariant = product.variants.find(
    (v) => v.color === product.colors[0] && v.size === product.sizes[0]
  );

  const handleAddToCart = useCallback(() => {
    if (isLoading || !btnRef.current || hasOptions) return;
    const fromRect = btnRef.current.getBoundingClientRect();
    addToCartWithFly(
      {
        productId: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        size: product.sizes[0],
        color: product.colors[0],
        quantity: 1,
        slug: product.href.replace("/products/", ""),
        variantId: defaultVariant?.variantId,
      },
      fromRect,
      product.image,
    );
  }, [product, addToCartWithFly, isLoading, hasOptions, defaultVariant]);

  return (
    <div className="group bg-white">
      <div className="product-thumbnail relative overflow-hidden bg-background-grey">
        <Link href={product.href} className="woocommerce-LoopProduct-link block" style={{ paddingBottom: "133.33%" }}>
          <div
            className="product-main-image absolute inset-0 bg-cover bg-center transition-opacity duration-500 group-hover:opacity-0"
            style={{ backgroundImage: `url(${product.image})` }}
          />
          <div
            className="product-hover-image absolute inset-0 bg-cover bg-center opacity-0 transition-all duration-500 group-hover:opacity-100 group-hover:scale-110"
            style={{ backgroundImage: `url(${product.hoverImage})` }}
          />
        </Link>

        {product.originalPrice && (
          <span className="absolute top-3 left-3 bg-primary text-white text-xs font-semibold px-2.5 py-1 z-10">
            İNDİRİM
          </span>
        )}

        <div className="product-actions absolute right-3 top-3 z-[3] flex flex-col">
          <WishlistButton
            item={{
              id: product.id,
              name: product.name,
              price: product.price,
              originalPrice: product.originalPrice,
              image: product.image,
              slug: product.href.replace("/products/", ""),
            }}
            className="product-action wishlist-btn flex items-center justify-center w-[38px] h-[38px] bg-white rounded-full text-heading hover:bg-heading hover:text-white transition-all duration-300 md:opacity-0 md:translate-x-[150%] md:group-hover:opacity-100 md:group-hover:translate-x-0"
            iconClass="w-[14px] h-[14px]"
          />
          <button className="product-action compare-btn flex items-center justify-center w-[38px] h-[38px] bg-white rounded-full text-heading hover:bg-heading hover:text-white transition-all duration-300 md:opacity-0 md:translate-x-[150%] md:group-hover:opacity-100 md:group-hover:translate-x-0 mt-[8px]" title="Karşılaştır" style={{ transitionDelay: "100ms" }}>
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="1" y="3" width="5" height="11" rx="1" strokeLinecap="round" strokeLinejoin="round"/>
              <rect x="10" y="1" width="5" height="13" rx="1" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <button
            onClick={() => setQuickViewOpen(true)}
            className="product-action quick-view-btn flex items-center justify-center w-[38px] h-[38px] bg-white rounded-full text-heading hover:bg-heading hover:text-white transition-all duration-300 md:opacity-0 md:translate-x-[150%] md:group-hover:opacity-100 md:group-hover:translate-x-0 mt-[8px]" title="Hızlı Görünüm" style={{ transitionDelay: "200ms" }}
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M8 3C4.5 3 1.5 6 1.5 8C1.5 10 4.5 13 8 13C11.5 13 14.5 10 14.5 8C14.5 6 11.5 3 8 3Z" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="8" cy="8" r="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        <div className="woocommerce_loop_add_to_cart_wrap absolute bottom-3 left-3 right-3 z-[4] md:opacity-0 md:translate-y-[150%] transition-all duration-300 md:group-hover:opacity-100 md:group-hover:translate-y-0">
          {hasOptions ? (
            <Link
              href={product.href}
              className="block w-full bg-heading text-white text-xs font-medium py-2.5 text-center transition-colors duration-200 hover:bg-primary"
            >
              Seçenekler
            </Link>
          ) : (
            <button
              ref={btnRef}
              onClick={handleAddToCart}
              disabled={isLoading}
              className="w-full bg-heading text-white text-xs font-medium py-2.5 transition-colors duration-200 hover:bg-primary disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  <span>Ekleniyor...</span>
                </>
              ) : (
                <span>Sepete Ekle</span>
              )}
            </button>
          )}
        </div>
      </div>

      <div className="p-3 md:p-3 lg:p-4">
        <Link href={product.href}>
          <h3 className="text-sm md:text-base text-heading font-medium leading-snug mb-2 line-clamp-2 hover:text-primary transition-colors duration-200">
            {product.name}
          </h3>
        </Link>
        <div className="flex items-center gap-2 mb-3">
          {product.originalPrice ? (
            <>
              <span className="text-primary text-sm md:text-base font-semibold">
                {product.price}
              </span>
              <span className="text-text-lighter text-xs md:text-sm line-through">
                {product.originalPrice}
              </span>
            </>
          ) : (
            <span className="text-heading text-sm md:text-base font-semibold">
              {product.price}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1.5">
          {product.colors.map((color, i) => (
            <span
              key={i}
              className="w-3.5 h-3.5 md:w-4 md:h-4 rounded-full border border-border-light-03"
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      </div>
      <QuickViewModal
        product={product}
        open={quickViewOpen}
        onClose={() => setQuickViewOpen(false)}
      />
    </div>
  );
}
