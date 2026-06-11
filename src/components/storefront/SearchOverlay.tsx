"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import Link from "next/link";
import type { Product } from "@/data/products";

interface Props {
  open: boolean;
  onClose: () => void;
}

export function SearchOverlay({ open, onClose }: Props) {
  const [query, setQuery] = useState("");
  const [animIn, setAnimIn] = useState(false);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch("/api/products")
      .then((r) => r.json())
      .then(setAllProducts);
  }, []);

  useEffect(() => {
    if (open) {
      setAnimIn(true);
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setAnimIn(false);
    }
  }, [open]);

  useEffect(() => {
    if (!open) {
      setQuery("");
    }
  }, [open]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) {
        onClose();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase().trim();
    return allProducts.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.categories?.some((c) => c.toLowerCase().includes(q)) ||
        p.tags?.some((t) => t.toLowerCase().includes(q)),
    ).slice(0, 8);
  }, [query, allProducts]);

  return (
    <div
      className={`fixed inset-0 z-[70] transition-opacity duration-300 ${open ? "pointer-events-auto" : "pointer-events-none"}`}
    >
      <div
        className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${animIn ? "opacity-100" : "opacity-0"}`}
        onClick={onClose}
      />
      <div
        className={`bg-white transition-all duration-300 ${animIn ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-full"}`}
      >
        <div className="max-w-[800px] mx-auto px-4 py-8 md:py-12">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <svg
                className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-lighter"
                fill="none" stroke="currentColor" viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ürün ara..."
                className="w-full border-b-2 border-heading text-2xl md:text-3xl text-heading py-3 pl-14 pr-4 focus:outline-none placeholder:text-text-lighter/50"
              />
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:text-primary transition-colors shrink-0"
              aria-label="Kapat"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {query.trim() && (
            <div className="mt-6">
              {results.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-text text-sm">
                    &quot;{query}&quot; ile eşleşen ürün bulunamadı.
                  </p>
                </div>
              ) : (
                <>
                  <p className="text-xs text-text-lighter mb-4">
                    {results.length} sonuç bulundu
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                    {results.map((product) => (
                      <Link
                        key={product.id}
                        href={product.href}
                        onClick={onClose}
                        className="group flex gap-3 md:flex-col bg-background-grey/50 hover:bg-background-grey transition-colors p-2 md:p-0"
                      >
                        <div className="w-16 h-20 md:w-full md:aspect-[3/4] shrink-0 md:mb-2">
                          <div
                            className="w-full h-full bg-cover bg-center"
                            style={{ backgroundImage: `url(${product.image})` }}
                          />
                        </div>
                        <div className="min-w-0 flex-1 md:p-3">
                          <h4 className="text-xs md:text-sm text-heading font-medium line-clamp-2 group-hover:text-primary transition-colors">
                            {product.name}
                          </h4>
                          <div className="flex items-center gap-1.5 mt-1">
                            <span className="text-xs md:text-sm font-semibold text-heading">
                              {product.price}
                            </span>
                            {product.originalPrice && (
                              <span className="text-[10px] md:text-xs text-text-lighter line-through">
                                {product.originalPrice}
                              </span>
                            )}
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
