"use client";

import { useState, useEffect } from "react";
import { ProductCard } from "./ProductCard";
import type { Product } from "@/data/products";

interface Tab {
  id: string;
  label: string;
}

const tabs: Tab[] = [
  { id: "best-sellers", label: "çok satanlar" },
  { id: "on-sale", label: "indirimdekiler" },
  { id: "top-rated", label: "en çok beğenilenler" },
];

export function BestSellers() {
  const [activeTab, setActiveTab] = useState("best-sellers");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [allProducts, setAllProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetch("/api/products")
      .then((r) => r.json())
      .then(setAllProducts);
  }, []);

  const productMap: Record<string, Product[]> = {
    "best-sellers": allProducts,
    "on-sale": allProducts.filter((p) => p.originalPrice),
    "top-rated": [...allProducts].sort((a, b) => b.rating - a.rating),
  };

  const products = productMap[activeTab];
  const activeLabel = tabs.find((t) => t.id === activeTab)?.label ?? "çok satanlar";

  return (
    <section className="py-16 md:py-24 bg-background-grey">
      <div className="container-wide">
        <div className="flex items-center gap-0 mb-10 md:mb-14">
          <span className="text-heading text-sm md:text-base font-medium">
            Kategoriler
          </span>
          <div className="relative ml-2">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              onBlur={() => setTimeout(() => setDropdownOpen(false), 150)}
              className="flex items-center gap-2 px-3 md:px-4 py-2.5 text-sm md:text-base font-medium text-heading bg-white border border-border cursor-pointer min-w-[140px]"
            >
              <span className="value">{activeLabel}</span>
              <svg
                className={`ml-auto transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`}
                width="10" height="6" viewBox="0 0 10 6" fill="none" stroke="currentColor" strokeWidth="1.5"
              >
                <path d="M1 1L5 5L9 1" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            {dropdownOpen && (
              <ul
                className="absolute top-full left-0 w-full bg-white border border-border border-t-0 z-20 shadow-md whitespace-nowrap"
              >
                {tabs.map((tab) => (
                  <li
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id);
                      setDropdownOpen(false);
                    }}
                    className={`px-4 py-2.5 text-sm md:text-base font-medium cursor-pointer hover:bg-background-grey transition-colors duration-200 ${
                      activeTab === tab.id ? "bg-background-grey font-semibold" : "text-heading"
                    }`}
                  >
                    {tab.label}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4 lg:gap-5">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
