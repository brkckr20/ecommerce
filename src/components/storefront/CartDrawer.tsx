"use client";

import { useState, useEffect } from "react";
import { useCart } from "@/providers/CartProvider";
import { getSiteSettingsAction } from "@/actions/settings-actions";
import Link from "next/link";

function parsePrice(price: string): number {
  return parseFloat(price.replace(/[^0-9.,]/g, ""));
}

export function CartDrawer() {
  const { items, cartCount, isDrawerOpen, closeDrawer, removeFromCart, updateQuantity, checkoutUrl } = useCart();
  const [freeShippingLimit, setFreeShippingLimit] = useState(499);

  useEffect(() => {
    getSiteSettingsAction().then((s) => {
      if (s) setFreeShippingLimit(s.freeShippingLimit);
    });
  }, []);

  const subtotal = items.reduce((sum, item) => sum + parsePrice(item.price) * item.quantity, 0);
  const remaining = Math.max(0, freeShippingLimit - subtotal);
  const progress = Math.min(100, (subtotal / freeShippingLimit) * 100);

  return (
    <>
      {isDrawerOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/40"
          onClick={closeDrawer}
        />
      )}

      <div
        className={`fixed top-0 right-0 z-50 h-full w-full max-w-md bg-white shadow-2xl transition-transform duration-300 ease-out ${
          isDrawerOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between px-6 py-5 border-b border-border">
            <h2 className="text-lg font-medium text-heading">
              Sepet ({cartCount})
            </h2>
            <button
              onClick={closeDrawer}
              className="p-1 hover:text-primary transition-colors"
              aria-label="Sepeti kapat"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {items.length > 0 && (
          <div className="px-6 pt-4 pb-2">
            {remaining > 0 ? (
              <div className="bg-background-grey rounded-lg p-3">
                <p className="text-xs text-text mb-2">
                  <span className="font-medium text-heading">{remaining.toLocaleString("tr-TR", { minimumFractionDigits: 2 })} TL</span> daha harcayın, <span className="text-primary font-semibold">ücretsiz kargo</span> kazanın!
                </p>
                <div className="w-full h-1.5 bg-border rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            ) : (
              <div className="bg-green-50 rounded-lg p-3">
                <p className="text-xs text-green-700 font-medium flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Ücretsiz kargo hakkı kazandınız!
                </p>
              </div>
            )}
          </div>
          )}

          <div className="flex-1 overflow-y-auto px-6 py-4">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <svg className="w-16 h-16 text-border mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                <p className="text-text mb-2">Sepetiniz boş</p>
                <Link
                  href="/"
                  onClick={closeDrawer}
                  className="text-sm text-primary hover:underline"
                >
                  Alışverişe başla
                </Link>
              </div>
            ) : (
              <ul className="space-y-4">
                {items.map((item) => (
                  <li key={item.id} className="flex gap-4 pb-4 border-b border-border">
                    <div className="w-20 h-24 shrink-0 bg-background-grey">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <Link
                        href={`/products/${item.slug}`}
                        onClick={closeDrawer}
                        className="text-sm font-medium text-heading hover:text-primary transition-colors line-clamp-2"
                      >
                        {item.name}
                      </Link>
                      <p className="text-xs text-text-light mt-1">
                        {item.size} / {item.color}
                      </p>
                      <p className="text-sm font-medium text-heading mt-1">
                        {item.price}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center border border-border">
                          <button
                            onClick={() => {
                              if (item.quantity <= 1) {
                                removeFromCart(item.id);
                              } else {
                                updateQuantity(item.id, item.quantity - 1);
                              }
                            }}
                            className="w-8 h-8 md:w-7 md:h-7 flex items-center justify-center text-xs text-heading hover:bg-background-grey transition-colors"
                          >
                            <svg className="w-3 h-3 md:w-2.5 md:h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                            </svg>
                          </button>
                          <span className="w-10 md:w-8 text-center text-xs text-heading font-medium">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-8 h-8 md:w-7 md:h-7 flex items-center justify-center text-xs text-heading hover:bg-background-grey transition-colors"
                          >
                            <svg className="w-3 h-3 md:w-2.5 md:h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                          </button>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-text-lighter hover:text-primary transition-colors"
                          aria-label="Ürünü kaldır"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {items.length > 0 && (
            <div className="border-t border-border px-6 py-5 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-text">Ara Toplam</span>
                <span className="font-medium text-heading">
                  {subtotal.toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " TL"}
                </span>
              </div>
              <a
                href={checkoutUrl || "#"}
                onClick={closeDrawer}
                className="block w-full text-center bg-heading text-white text-sm font-medium py-3 hover:bg-primary transition-colors"
              >
                Ödemeye Geç
              </a>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
