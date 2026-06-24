"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import type { Product } from "@/data/products";

interface Props {
  products: Product[];
  initialQuery: string;
}

export function SearchPageClient({ products, initialQuery }: Props) {
  const [query, setQuery] = useState(initialQuery);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase().trim();
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.categories?.some((c) => c.toLowerCase().includes(q)) ||
        p.tags?.some((t) => t.toLowerCase().includes(q)),
    );
  }, [query, products]);

  return (
    <div>
      <div className="relative mb-8">
        <svg
          className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-lighter"
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ürün ara..."
          className="w-full border-b-2 border-heading text-xl md:text-2xl text-heading py-3 pl-14 pr-4 focus:outline-none placeholder:text-text-lighter/50"
        />
      </div>

      {query.trim() ? (
        results.length === 0 ? (
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
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {results.map((product) => (
                <Link
                  key={product.id}
                  href={product.href}
                  className="group"
                >
                  <div className="aspect-[3/4] bg-background-grey mb-3 overflow-hidden">
                    <div
                      className="w-full h-full bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
                      style={{ backgroundImage: `url(${product.image})` }}
                    />
                  </div>
                  <h3 className="text-sm text-heading font-medium line-clamp-2 mb-1 group-hover:text-primary transition-colors">
                    {product.name}
                  </h3>
                  <span className="text-sm font-semibold text-heading">
                    {product.price}
                  </span>
                </Link>
              ))}
            </div>
          </>
        )
      ) : (
        <div className="text-center py-12">
          <p className="text-text text-sm">Aramaya başlamak için yukarıya bir kelime yazın.</p>
        </div>
      )}
    </div>
  );
}
