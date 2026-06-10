"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import type { Product } from "@/data/products";
import { useCart } from "@/providers/CartProvider";
import { WishlistButton } from "./WishlistButton";

interface Props {
  product: Product;
  open: boolean;
  onClose: () => void;
}

export function QuickViewModal({ product, open, onClose }: Props) {
  const [mounted, setMounted] = useState(false);
  const [animIn, setAnimIn] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [selectedSize, setSelectedSize] = useState(product.sizes[0]);
  const [quantity, setQuantity] = useState(1);
  const btnRef = useRef<HTMLButtonElement>(null);
  const { addToCartWithFly, addingProductId } = useCart();
  const isLoading = addingProductId === product.id;

  const selectedVariant = product.variants.find(
    (v) => v.color === selectedColor && v.size === selectedSize
  );
  const variantStock = selectedVariant?.stock ?? 0;

  useEffect(() => {
    if (open) {
      setActiveImage(0);
      setSelectedColor(product.colors[0]);
      setSelectedSize(product.sizes[0]);
      setQuantity(1);
      setMounted(true);
      requestAnimationFrame(() => setAnimIn(true));
      document.body.style.overflow = "hidden";
    } else if (mounted) {
      setAnimIn(false);
      const timer = setTimeout(() => setMounted(false), 250);
      document.body.style.overflow = "";
      return () => clearTimeout(timer);
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (open) window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  const handleAddToCart = useCallback(() => {
    if (isLoading || !btnRef.current) return;
    const fromRect = btnRef.current.getBoundingClientRect();
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
        variantId: selectedVariant?.variantId,
      },
      fromRect,
      product.images[activeImage],
    );
  }, [product, activeImage, selectedSize, selectedColor, quantity, selectedVariant, addToCartWithFly, isLoading]);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <div
        className={`absolute inset-0 bg-black/50 transition-opacity duration-250 ${animIn ? "opacity-100" : "opacity-0"}`}
        onClick={onClose}
      />
      <div
        className={`relative w-full max-w-[880px] mx-4 max-h-[90vh] overflow-y-auto bg-white shadow-2xl transition-all duration-250 ${animIn ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 md:w-8 md:h-8 flex items-center justify-center bg-white rounded-full text-heading hover:text-primary transition-colors shadow-md"
          aria-label="Close"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="flex flex-col md:flex-row">
          <div className="w-full md:w-1/2 bg-background-grey">
            <div className="aspect-[3/4] relative">
              <img
                src={product.images[activeImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {product.originalPrice && (
                <span className="absolute top-4 left-4 bg-primary text-white text-xs font-semibold px-2.5 py-1">
                  İNDİRİM
                </span>
              )}
            </div>
            {product.images.length > 1 && (
              <div className="flex gap-2 p-3">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={`w-14 h-[18px] shrink-0 border-2 transition-colors ${activeImage === i ? "border-heading" : "border-border hover:border-text-lighter"}`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col justify-center">
            <h2 className="text-xl md:text-2xl font-medium text-heading mb-2">
              {product.name}
            </h2>

            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg
                    key={i}
                    className={`w-3.5 h-3.5 ${i < Math.floor(product.rating) ? "text-yellow-400" : "text-gray-300"}`}
                    fill="currentColor" viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
                <span className="text-xs text-text ml-1">({product.reviewCount})</span>
              </div>
            </div>

            <div className="flex items-center gap-3 mb-5">
              {product.originalPrice ? (
                <>
                  <span className="text-xl font-semibold text-primary">{product.price}</span>
                  <span className="text-sm text-text-lighter line-through">{product.originalPrice}</span>
                </>
              ) : (
                <span className="text-xl font-semibold text-heading">{product.price}</span>
              )}
            </div>

            <div
              className="text-sm text-text leading-relaxed mb-6 line-clamp-3 prose"
              dangerouslySetInnerHTML={{ __html: product.description }}
            />

            {product.colors.length > 0 && (
              <div className="mb-4">
                <label className="block text-xs font-medium text-heading mb-2">
                  Renk: <span className="font-normal text-text">{selectedColor}</span>
                </label>
                <div className="flex items-center gap-2">
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
                      className={`w-7 h-7 rounded-full border-2 transition-all ${selectedColor === color ? "border-heading scale-110" : "border-border-light-03 hover:border-text-lighter"}`}
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                </div>
              </div>
            )}

            {product.sizes.length > 0 && (
              <div className="mb-6">
                <label className="block text-xs font-medium text-heading mb-2">
                  Beden: <span className="font-normal text-text">{selectedSize}</span>
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
                        className={`px-3 py-1.5 text-xs border transition-all ${
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
            )}

            <div className="flex items-center gap-3">
              <div className="flex items-center border border-border">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 md:w-9 md:h-9 flex items-center justify-center text-heading hover:bg-background-grey transition-colors"
                >
                  <svg className="w-3.5 h-3.5 md:w-3 md:h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                  </svg>
                </button>
                <span className="w-12 text-center text-sm text-heading font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(variantStock, quantity + 1))}
                  className="w-10 h-10 md:w-9 md:h-9 flex items-center justify-center text-heading hover:bg-background-grey transition-colors"
                >
                  <svg className="w-3.5 h-3.5 md:w-3 md:h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </button>
              </div>

                <button
                  ref={btnRef}
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
                className="w-10 h-10 md:w-9 md:h-9 flex items-center justify-center border border-border text-heading hover:bg-heading hover:text-white transition-all shrink-0"
                iconClass="w-4 h-4"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
