"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import type { ProductCategory as Category } from "@/data/products";
import type { Product } from "@/data/products";
import type { NavMenuItem, CollectionCount } from "@/data/shopify.server";
import { ProductCard } from "./ProductCard";

interface Props {
  category: Category;
  navItems: NavMenuItem[];
  collectionCounts: CollectionCount[];
}

function findNavChildren(slug: string, items: NavMenuItem[]): NavMenuItem[] {
  for (const item of items) {
    if (item.href === `/product-category/${slug}`) {
      return item.children;
    }
    if (item.children.length > 0) {
      const found = findNavChildren(slug, item.children);
      if (found.length > 0) return found;
    }
  }
  return [];
}

export function ProductCategoryClient({ category, navItems, collectionCounts }: Props) {
  const [allProducts, setAllProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetch("/api/products")
      .then((r) => r.json())
      .then(setAllProducts);
  }, []);

  const collectionMap = useMemo(() => {
    const map = new Map<string, CollectionCount>();
    for (const c of collectionCounts) {
      map.set(c.handle, c);
    }
    return map;
  }, [collectionCounts]);

  function extractHandle(href: string): string {
    const clean = href.split("?")[0].replace(/\/+$/, "");
    const segments = clean.split("/");
    return segments[segments.length - 1] || "";
  }

  const subCategories = useMemo(() => findNavChildren(category.slug, navItems), [category.slug, navItems]);
  const isParent = subCategories.length > 0;

  const products = allProducts.filter((p) => 
    p.categories?.includes(category.name) || p.tags?.includes(category.slug)
  );
  const popularProducts = useMemo(() => [...products].sort((a, b) => b.rating - a.rating).slice(0, 8), [products]);

  const [sortBy, setSortBy] = useState("menu_order");
  const [sortOpen, setSortOpen] = useState(false);
  const [layout, setLayout] = useState("grid-four");

  if (isParent) {
    return (
      <>
        <div className="bg-background-grey/30 border-b border-border">
          <div className="max-w-[1510px] mx-auto px-4 md:px-6 lg:px-8 py-10 md:py-14">
            <div className="text-center max-w-2xl mx-auto">
              <div className="flex items-center justify-center gap-2 text-sm text-text-lighter mb-4">
                <Link href="/" className="hover:text-primary transition-colors">Ana Sayfa</Link>
                <span>/</span>
                <span className="text-heading font-medium">{category.name}</span>
              </div>
              <h1 className="text-3xl md:text-5xl font-bold text-heading mb-3">{category.name}</h1>
              {category.description && (
                <p className="text-text text-base leading-relaxed">{category.description}</p>
              )}
            </div>
          </div>
        </div>

        <div className="max-w-[1510px] mx-auto px-4 md:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-6">
            {subCategories.map((sub) => (
              <Link
                key={sub.href}
                href={sub.href}
                className="group relative overflow-hidden rounded-xl bg-white border border-border hover:border-primary/30 hover:shadow-lg transition-all duration-300"
              >
                <div className={`aspect-[4/5] ${sub.image ? "" : "bg-gradient-to-br from-primary/5 to-primary/10"} overflow-hidden`}>
                  {sub.image ? (
                    <Image
                      src={sub.image}
                      alt={sub.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <svg className="w-16 h-16 text-primary/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                </div>
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-4 pt-12">
                  <h3 className="text-white text-lg font-semibold">{sub.name}</h3>
                  <p className="text-white/70 text-sm mt-0.5">
                    {(() => {
                      const handle = extractHandle(sub.href);
                      const col = collectionMap.get(handle);
                      return col ? `${col.productCount} ürün` : "Alışverişe Başla →";
                    })()}
                  </p>
                </div>
              </Link>
            ))}
          </div>

          {popularProducts.length > 0 && (
            <div className="mt-16">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-heading">Popüler Ürünler</h2>
                  <p className="text-text-lighter text-sm mt-1">{category.name} kategorisinden öne çıkan ürünler</p>
                </div>
                <Link
                  href={`/product-category/${category.slug}?view=all`}
                  className="hidden md:inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                >
                  Tümünü Gör
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
                {popularProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          )}
        </div>
      </>
    );
  }

  const layoutCols: Record<string, { desktop: number; tablet: number; mobile: number }> = {
    "grid-one": { desktop: 1, tablet: 1, mobile: 1 },
    "grid-two": { desktop: 2, tablet: 2, mobile: 2 },
    "grid-three": { desktop: 3, tablet: 2, mobile: 2 },
    "grid-four": { desktop: 4, tablet: 3, mobile: 2 },
    "grid-five": { desktop: 5, tablet: 3, mobile: 2 },
  };

  return (
    <>
      <div id="page-title-bar" className="page-title-bar page-title-bar-standard-01">
        <div className="page-title-bar-bg" />
        <div className="page-title-bar-inner">
          <div className="page-title-bar-content">
            <div className="container-wide">
              <div className="page-title-bar-heading">
                <h1 className="heading text-3xl md:text-4xl font-medium text-heading pb-2">{category.name}</h1>
              </div>
              <div id="page-breadcrumb" className="page-breadcrumb">
                <div className="container-wide">
                  <div className="page-breadcrumb-wrap">
                    <ul className="flex items-center gap-1 md:gap-2 text-xs md:text-sm text-text">
                      <li className="level-1 top item-home">
                        <Link href="/" className="hover:text-primary transition-colors">Ana Sayfa</Link>
                      </li>
                      <li className="level-2 sub item-archive">
                        <Link href="/" className="hover:text-primary transition-colors">Ürünler</Link>
                      </li>
                      {category.parent && (
                        <li className="level-3 sub item-term_ancestor">
                          <Link href={`/product-category/${category.parent}`} className="hover:text-primary transition-colors">{category.parent}</Link>
                        </li>
                      )}
                      <li className="level-4 sub item-current tail current text-heading font-medium">
                        <span>{category.name}</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div id="page-content" className="page-content py-10">
        <div className="container-wide">
          <div className="page-main-content">
            <div className="shop-archive-block">
            <div className="woocommerce-notices-wrapper" />

            <div id="archive-shop-actions" className="archive-shop-actions mb-6">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="shop-actions-toolbar shop-actions-toolbar-left">
                  <div className="inner">
                    <div className="woocommerce-result-count archive-result-count text-sm text-text" role="alert">
                      <p>{products.length} sonuç gösteriliyor</p>
                    </div>
                  </div>
                </div>
                <div className="shop-actions-toolbar shop-actions-toolbar-right">
                  <div className="inner flex items-center gap-4">
                    <div className="relative">
                      <button
                        onClick={() => setSortOpen(!sortOpen)}
                        onBlur={() => setTimeout(() => setSortOpen(false), 150)}
                        className="minimog-nice-select-current flex items-center gap-2 text-sm text-text border border-border px-3 py-2 min-w-[180px]"
                      >
                        <span className="value">Default sorting</span>
                        <svg className="ml-auto" width="10" height="6" viewBox="0 0 10 6" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <path d="M1 1L5 5L9 1" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </button>
                      {sortOpen && (
                        <ul className="absolute top-full right-0 mt-0 bg-white border border-border z-20 shadow-md whitespace-nowrap min-w-full">
                          {[
                            { value: "menu_order", label: "Varsayılan sıralama" },
                            { value: "popularity", label: "Popülerlik" },
                            { value: "rating", label: "Ortalama puan" },
                            { value: "date", label: "En yeni" },
                            { value: "price", label: "Fiyat: düşükten yükseğe" },
                            { value: "price-desc", label: "Fiyat: yüksekten düşüğe" },
                          ].map((opt) => (
                            <li
                              key={opt.value}
                              onClick={() => { setSortBy(opt.value); setSortOpen(false); }}
                              className={`px-3 py-2 text-sm cursor-pointer hover:bg-background-grey transition-colors ${
                                sortBy === opt.value ? "bg-background-grey font-medium" : "text-text"
                              }`}
                            >
                              {opt.label}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>

                    <div id="archive-layout-switcher" className="archive-layout-switcher">
                      <div className="inner flex items-center gap-1">
                        {(["grid-three", "grid-four", "grid-five"] as const).map((l) => (
                          <button
                            key={l}
                            onClick={() => setLayout(l)}
                            className={`switcher-item p-1.5 border transition-colors ${
                              layout === l
                                ? "border-heading bg-background-grey"
                                : "border-border hover:border-heading"
                            }`}
                            title={
                              l === "grid-three" ? "3 sütun" :
                              l === "grid-four" ? "4 sütun" : "5 sütun"
                            }
                          >
                            {l === "grid-three" && (
                              <svg width="16" height="16" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect x="4.25" y="2.75" width="1.5" height="12.5" rx="0.75" fill="currentColor"/>
                                <rect x="8.25" y="2.75" width="1.5" height="12.5" rx="0.75" fill="currentColor"/>
                                <rect x="12.25" y="2.75" width="1.5" height="12.5" rx="0.75" fill="currentColor"/>
                              </svg>
                            )}
                            {l === "grid-four" && (
                              <svg width="16" height="16" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect x="2.25" y="2.75" width="1.5" height="12.5" rx="0.75" fill="currentColor"/>
                                <rect x="6.25" y="2.75" width="1.5" height="12.5" rx="0.75" fill="currentColor"/>
                                <rect x="10.25" y="2.75" width="1.5" height="12.5" rx="0.75" fill="currentColor"/>
                                <rect x="14.25" y="2.75" width="1.5" height="12.5" rx="0.75" fill="currentColor"/>
                              </svg>
                            )}
                            {l === "grid-five" && (
                              <svg width="16" height="16" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect x="0.25" y="2.75" width="1.5" height="12.5" rx="0.75" fill="currentColor"/>
                                <rect x="4.25" y="2.75" width="1.5" height="12.5" rx="0.75" fill="currentColor"/>
                                <rect x="8.25" y="2.75" width="1.5" height="12.5" rx="0.75" fill="currentColor"/>
                                <rect x="12.25" y="2.75" width="1.5" height="12.5" rx="0.75" fill="currentColor"/>
                                <rect x="16.25" y="2.75" width="1.5" height="12.5" rx="0.75" fill="currentColor"/>
                              </svg>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div id="active-filters-bar" className="active-filters-bar mb-4">
              <div className="active-filters-list" />
            </div>

            <div
              id="minimog-main-post"
              className="minimog-main-post minimog-grid-wrapper minimog-product group-style-01 style-grid-01 caption-style-01"
              style={{
                "--grid-columns-desktop": String(layoutCols[layout].desktop),
                "--grid-columns-tablet-extra": String(layoutCols[layout].tablet),
                "--grid-columns-mobile-extra": String(layoutCols[layout].mobile),
                "--grid-gutter-desktop": "15px",
                "--grid-gutter-tablet-extra": "10px",
                "--grid-gutter-mobile-extra": "8px",
              } as React.CSSProperties}
            >
              <div key={layout} className="minimog-grid grid gap-[--grid-gutter-mobile-extra] md:gap-[--grid-gutter-tablet-extra] lg:gap-[--grid-gutter-desktop]"
                style={{
                  gridTemplateColumns: `repeat(var(--grid-columns-mobile-extra), 1fr)`,
                } as React.CSSProperties}
              >
                <style>{`
                  .minimog-grid > .grid-item {
                    animation: gridFadeIn 0.35s ease-out both;
                  }
                  .minimog-grid > .grid-item:nth-child(1) { animation-delay: 0s; }
                  .minimog-grid > .grid-item:nth-child(2) { animation-delay: 0.03s; }
                  .minimog-grid > .grid-item:nth-child(3) { animation-delay: 0.06s; }
                  .minimog-grid > .grid-item:nth-child(4) { animation-delay: 0.09s; }
                  .minimog-grid > .grid-item:nth-child(5) { animation-delay: 0.12s; }
                  .minimog-grid > .grid-item:nth-child(6) { animation-delay: 0.15s; }
                  .minimog-grid > .grid-item:nth-child(7) { animation-delay: 0.18s; }
                  .minimog-grid > .grid-item:nth-child(8) { animation-delay: 0.21s; }
                  .minimog-grid > .grid-item:nth-child(9) { animation-delay: 0.24s; }
                  .minimog-grid > .grid-item:nth-child(10) { animation-delay: 0.27s; }
                  .minimog-grid > .grid-item:nth-child(n+11) { animation-delay: 0.3s; }
                  @keyframes gridFadeIn {
                    from { opacity: 0; transform: scale(0.92) translateY(8px); }
                    to { opacity: 1; transform: scale(1) translateY(0); }
                  }
                  @media (min-width: 768px) {
                    .minimog-grid {
                      grid-template-columns: repeat(var(--grid-columns-tablet-extra), 1fr) !important;
                    }
                  }
                  @media (min-width: 1024px) {
                    .minimog-grid {
                      grid-template-columns: repeat(var(--grid-columns-desktop), 1fr) !important;
                    }
                  }
                `}</style>
                {products.map((product) => (
                  <div key={product.id} className="grid-item">
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            </div>

            <nav className="woocommerce-pagination mt-10" data-type="load-more">
            </nav>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
