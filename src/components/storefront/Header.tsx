"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

import { useCustomer } from "@/providers/ShopifyCustomerProvider";
import { useCart } from "@/providers/CartProvider";
import { useWishlist } from "@/providers/WishlistProvider";
import { SearchOverlay } from "./SearchOverlay";
import { AuthModal } from "./AuthModal";
import { getSiteSettingsAction, getMainMenuAction } from "@/actions/settings-actions";
import type { NavMenuItem } from "@/data/shopify.server";


export function Header({ navItems: initialItems }: { navItems?: NavMenuItem[] }) {
  const [isSticky, setIsSticky] = useState(false);
  const stickyRef = useRef<HTMLDivElement>(null);
  const { customer } = useCustomer();

  useEffect(() => {
    const handleScroll = () => {
      if (stickyRef.current) {
        const offset = stickyRef.current.offsetTop;
        setIsSticky(window.scrollY > offset);
      }
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <FreeDeliveryBar />
      <HeaderAbove />
      <div ref={stickyRef}>
        <MainHeader isSticky={isSticky} initialItems={initialItems} />
      </div>
      {isSticky && <div className="h-[73px] md:h-[73px]" />}
    </>
  );
}

function FreeDeliveryBar() {
  const [limit, setLimit] = useState<number | null>(null);
  const [bannerText, setBannerText] = useState<string | null>(null);

  useEffect(() => {
    getSiteSettingsAction().then((s) => {
      if (s) {
        setLimit(s.freeShippingLimit);
        setBannerText(s.freeShippingBannerText ?? null);
      }
    });
  }, []);

  if (limit === null) return null;

  const text = bannerText
    ? bannerText.replace("{limit}", limit.toLocaleString("tr-TR"))
    : `${limit.toLocaleString("tr-TR")} TL ve üzeri alışverişlerde ücretsiz kargo. Fırsatı kaçırmayın!`;

  const segment = (
    <>
      <span>{text}</span>
      <span className="ml-24">{text}</span>
      <span className="ml-24">{text}</span>
    </>
  );

  return (
    <div className="bg-primary text-heading text-xs sm:text-sm py-2 overflow-hidden">
      <div className="whitespace-nowrap marquee-animate">
        {segment}
        {segment}
      </div>
    </div>
  );
}

function HeaderAbove() {
  return (
    <div className="bg-white text-sm py-3 border-b border-border hidden md:block">
      <div className="max-w-[1510px] mx-auto px-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6 text-text">
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-primary transition-colors">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
              <span>100k Takipçi</span>
            </a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-primary transition-colors">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              <span>300k Takipçi</span>
            </a>
          </div>

          {/* Dil değiştirici (şimdilik kullanılmıyor)
          <div className="relative group z-50">
            <button className="flex items-center gap-1 cursor-pointer hover:text-primary text-heading">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
              </svg>
              <span>Türkçe</span>
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <div className="absolute right-0 top-full mt-1 bg-white border border-border rounded shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 translate-y-2 transition-all duration-200 z-50 min-w-[140px] py-1">
              {[{ code: "tr", name: "Türkçe" }, { code: "en", name: "English" }].map((lang) => (
                <button
                  key={lang.code}
                  className="w-full text-left px-4 py-2 text-sm text-heading hover:bg-background-grey transition-colors"
                >
                  {lang.name}
                </button>
              ))}
            </div>
          </div>
          */}
        </div>
      </div>
    </div>
  );
}

function MainHeader({ isSticky, initialItems }: { isSticky: boolean; initialItems?: NavMenuItem[] }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const { customer, logout, isLoading } = useCustomer();
  const [activeSubCategory, setActiveSubCategory] = useState<string | null>(null);
  const [navItems, setNavItems] = useState<NavMenuItem[]>(initialItems || []);
  const headerRef = useRef<HTMLElement>(null);
  const { cartCount, openDrawer, cartIconRef } = useCart();
  const { items: wishlistItems } = useWishlist();

  useEffect(() => {
    if (!initialItems) {
      getMainMenuAction().then(setNavItems);
    }
  }, [initialItems]);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    if (!isUserMenuOpen) return;
    function handleClick(e: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setIsUserMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [isUserMenuOpen]);

  const isLoggedIn = !!customer;

  return (
    <header ref={headerRef} className={`bg-white border-b border-border transition-all duration-300 ${isSticky ? "fixed top-0 left-0 right-0 z-50 shadow-md" : "relative"}`}>
      <div className="max-w-[1510px] mx-auto px-4 md:px-8">
        <div className="header-wrap flex items-center justify-between py-2 gap-2">
          <div className="header-left flex items-center gap-4 shrink-0">
            <button
              className="md:hidden p-2 hover:bg-background-grey rounded-lg transition-colors shrink-0"
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Menüyü aç"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            <Link href="/" className="flex-shrink-0">
              <Image src="/icon.svg" alt="Somni" width={140} height={27} priority className="w-[100px] md:w-[140px] h-auto" />
            </Link>
          </div>

          <div className="hidden md:flex items-center justify-center flex-1 min-w-0">
            <nav>
              <ul className="flex items-center justify-center gap-6">
                {navItems.map((item) => {
                  const hasDropdown = item.children.length > 0;
                  return (
                    <li
                      key={item.name}
                      className={`py-4 ${hasDropdown ? "group relative" : ""}`}
                    >
                      <Link
                        href={item.href}
                        className="flex items-center gap-1 text-heading hover:text-primary font-medium relative transition-colors whitespace-nowrap"
                      >
                        {item.name}
                        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary-red transition-all duration-300 hover:w-full"></span>
                        {hasDropdown && (
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        )}
                      </Link>

                      {hasDropdown && (
                        <div
                          className="absolute left-1/2 -translate-x-1/2 top-full z-50 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity duration-200 pt-4"
                          style={{ marginTop: "-4px" }}
                        >
                          <div className="bg-white border border-border rounded-lg shadow-xl relative">
                            <div className="w-52 py-2">
                              {item.children.map((child) => (
                                <Link
                                  key={child.href}
                                  href={child.href}
                                  className="flex items-center justify-between px-4 py-2.5 text-sm text-heading hover:bg-gray-50 hover:text-primary transition-all"
                                >
                                  <span>{child.name}</span>
                                </Link>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
            </nav>
          </div>

          <div className="header-right flex items-center gap-3">
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => {
                  if (isLoggedIn) {
                    setIsUserMenuOpen((prev) => !prev);
                  } else {
                    setIsAuthOpen(true);
                  }
                }}
                className="p-2 hover:text-primary transition-colors"
                aria-label={isLoggedIn ? "Hesabım" : "Giriş Yap"}
              >
                {isLoggedIn && customer?.firstName ? (
                  <span className="w-5 h-5 flex items-center justify-center bg-primary text-white text-xs font-bold rounded-full">
                    {customer.firstName.charAt(0).toUpperCase()}
                  </span>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                )}
              </button>

              {isUserMenuOpen && (
                <div className="absolute right-0 top-full mt-2 bg-white border border-border rounded-lg shadow-xl z-50 min-w-[200px] py-2">
                  <div className="px-4 py-2 border-b border-border">
                    <p className="text-sm font-medium text-heading truncate">
                      {customer?.firstName ? `${customer.firstName} ${customer.lastName || ""}` : "Kullanıcı"}
                    </p>
                    <p className="text-xs text-text truncate">
                      {customer?.email || ""}
                    </p>
                  </div>
                  <Link
                    href="/hesabim"
                    onClick={() => setIsUserMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-heading hover:bg-background-grey transition-colors"
                  >
                    <svg className="w-4 h-4 text-text" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Profilim
                  </Link>
                  <Link
                    href="/siparislerim"
                    onClick={() => setIsUserMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-heading hover:bg-background-grey transition-colors"
                  >
                    <svg className="w-4 h-4 text-text" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    Siparişlerim
                  </Link>
                  <div className="border-t border-border mt-1 pt-1">
                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        logout();
                      }}
                      className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-500 hover:bg-background-grey transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Çıkış Yap
                    </button>
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-2 hover:text-primary transition-colors"
              aria-label="Ara"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

            <Link
              href="/wishlist"
              className="p-2 hover:text-primary transition-colors relative"
              aria-label="Favorilerim"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              {wishlistItems.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-white text-[10px] font-medium rounded-full flex items-center justify-center">
                  {wishlistItems.length}
                </span>
              )}
            </Link>

            <button
               ref={cartIconRef as React.RefObject<HTMLButtonElement>}
              onClick={openDrawer}
              className="p-2 hover:text-primary transition-colors relative"
              aria-label="Sepet"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-white text-[10px] font-medium rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      <div
        className={`fixed inset-0 z-[60] md:hidden pointer-events-none transition-opacity duration-300 ${
          isMobileMenuOpen ? "pointer-events-auto opacity-100" : "opacity-0"
        }`}
        onClick={() => setIsMobileMenuOpen(false)}
      >
        <div className="absolute inset-0 bg-black/40" />
        <div
          className={`absolute top-0 left-0 h-full w-80 max-w-[85vw] bg-white shadow-xl overflow-y-auto transition-transform duration-300 ease-out ${
            isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between px-4 py-4 border-b border-border">
            <span className="font-semibold text-heading">Menü</span>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-1 hover:text-primary transition-colors"
              aria-label="Menüyü kapat"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <nav className="px-4 py-4">
            <ul className="space-y-1">
              {navItems.map((item) => {
                const hasDropdown = item.children.length > 0;
                return (
                  <li key={item.name}>
                    {hasDropdown ? (
                      <>
                        <button
                          onClick={() =>
                            setActiveSubCategory(
                              activeSubCategory === item.name ? null : item.name
                            )
                          }
                          className="flex items-center justify-between w-full px-3 py-3 text-sm font-medium text-heading hover:bg-background-grey rounded-lg transition-colors"
                        >
                          {item.name}
                          <svg
                            className={`w-3.5 h-3.5 transition-transform ${
                              activeSubCategory === item.name ? "rotate-180" : ""
                            }`}
                            fill="none" stroke="currentColor" viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                        {activeSubCategory === item.name && (
                          <ul className="ml-4 mt-1 space-y-0.5 border-l border-border pl-3">
                            {item.children.map((child) => (
                              <li key={child.href}>
                                <Link
                                  href={child.href}
                                  onClick={() => setIsMobileMenuOpen(false)}
                                  className="block px-3 py-2 text-sm text-text hover:text-primary hover:bg-background-grey rounded-lg transition-colors"
                                >
                                  {child.name}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        )}
                      </>
                    ) : (
                      <Link
                        href={item.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="block px-3 py-3 text-sm font-medium text-heading hover:bg-background-grey rounded-lg transition-colors"
                      >
                        {item.name}
                      </Link>
                    )}
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      </div>
      <SearchOverlay open={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      <AuthModal open={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </header>
  );
}
