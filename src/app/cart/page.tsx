"use client";

import Link from "next/link";
import { useCart } from "@/providers/CartProvider";
import { Header, Footer } from "@/components/storefront";

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, cartCount, checkoutUrl, discountApplied, isFirstOrderEligible } = useCart();

  const subtotal = items.reduce((sum, item) => sum + parseFloat(item.price) * item.quantity, 0);

  if (cartCount === 0) {
    return (
      <>
        <Header />
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-center px-4">
            <svg className="w-20 h-20 mx-auto text-text-lighter mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <h1 className="text-2xl md:text-3xl font-bold text-heading mb-3">Sepetiniz Boş</h1>
            <p className="text-text mb-8 max-w-md mx-auto">
              Sepetinizde henüz ürün bulunmuyor. Alışverişe başlamak için aşağıdaki butona tıklayın.
            </p>
            <Link
              href="/"
              className="inline-block bg-heading text-white text-sm font-medium py-3 px-8 hover:bg-primary transition-colors"
            >
              Alışverişe Başla
            </Link>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="bg-background-grey min-h-screen py-8 md:py-16">
        <div className="max-w-[1510px] mx-auto px-4 md:px-8">
          <h1 className="text-2xl md:text-3xl font-bold text-heading mb-8">Sepetim</h1>

          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-1">
              <div className="bg-white rounded-lg border border-border overflow-hidden">
                <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-4 bg-background-grey text-xs text-text-lighter uppercase tracking-wider font-medium">
                  <div className="col-span-6">Ürün</div>
                  <div className="col-span-2 text-center">Fiyat</div>
                  <div className="col-span-2 text-center">Adet</div>
                  <div className="col-span-2 text-right">Toplam</div>
                </div>
                {items.map((item) => (
                  <div key={item.id} className="grid grid-cols-1 md:grid-cols-12 gap-4 px-4 md:px-6 py-5 border-b border-border items-center">
                    <div className="md:col-span-6 flex items-center gap-4">
                      <div className="w-20 h-20 md:w-24 md:h-24 bg-background-grey rounded overflow-hidden shrink-0">
                        <div
                          className="w-full h-full bg-cover bg-center"
                          style={{ backgroundImage: `url(${item.image})` }}
                        />
                      </div>
                      <div className="min-w-0">
                        <Link
                          href={`/products/${item.slug}`}
                          className="text-sm md:text-base text-heading font-medium hover:text-primary transition-colors line-clamp-2"
                        >
                          {item.name}
                        </Link>
                        {item.size && (
                          <p className="text-xs text-text mt-1">Beden: {item.size}</p>
                        )}
                        {item.color && (
                          <p className="text-xs text-text">Renk: {item.color}</p>
                        )}
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-xs text-red-500 hover:text-red-700 mt-2 transition-colors md:hidden"
                        >
                          Kaldır
                        </button>
                      </div>
                    </div>
                    <div className="md:col-span-2 flex items-center justify-between md:justify-center">
                      <span className="md:hidden text-xs text-text-lighter">Fiyat:</span>
                      <span className="text-sm text-heading font-medium">
                        {parseFloat(item.price).toLocaleString("tr-TR")} TL
                      </span>
                    </div>
                    <div className="md:col-span-2 flex items-center justify-between md:justify-center">
                      <span className="md:hidden text-xs text-text-lighter">Adet:</span>
                      <div className="flex items-center border border-border rounded">
                        <button
                          onClick={() => {
                            if (item.quantity <= 1) {
                              removeFromCart(item.id);
                            } else {
                              updateQuantity(item.id, item.quantity - 1);
                            }
                          }}
                          className="w-8 h-8 flex items-center justify-center text-heading hover:bg-background-grey transition-colors text-sm"
                        >
                          -
                        </button>
                        <span className="w-10 h-8 flex items-center justify-center text-sm text-heading font-medium border-x border-border">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-8 h-8 flex items-center justify-center text-heading hover:bg-background-grey transition-colors text-sm"
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <div className="md:col-span-2 flex items-center justify-between md:justify-end">
                      <span className="md:hidden text-xs text-text-lighter">Toplam:</span>
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-heading font-semibold">
                          {(parseFloat(item.price) * item.quantity).toLocaleString("tr-TR")} TL
                        </span>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="hidden md:block text-text-lighter hover:text-red-500 transition-colors"
                          aria-label="Kaldır"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6">
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 text-sm text-heading hover:text-primary transition-colors font-medium"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Alışverişe Devam Et
                </Link>
              </div>
            </div>

            <div className="lg:w-96 shrink-0">
              <div className="bg-white rounded-lg border border-border p-6 md:p-8 sticky top-24">
                <h2 className="text-lg font-bold text-heading mb-6">Sipariş Özeti</h2>
                <div className="space-y-3 mb-6">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-text">Ara Toplam</span>
                    <span className="text-heading font-medium">
                      {subtotal.toLocaleString("tr-TR")} TL
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-text">Kargo</span>
                    <span className="text-green-600 font-medium">
                      {subtotal >= 499 ? "Ücretsiz" : "49,99 TL"}
                    </span>
                  </div>
                  {discountApplied && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-green-600 font-medium">İlk Sipariş İndirimi (%15)</span>
                      <span className="text-green-600 font-medium">
                        -{(subtotal * 0.15).toLocaleString("tr-TR")} TL
                      </span>
                    </div>
                  )}
                  {isFirstOrderEligible && !discountApplied && (
                    <div className="bg-green-50 rounded-lg p-3">
                      <p className="text-xs text-green-700 font-medium flex items-center gap-1.5">
                        <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        İlk siparişinize %15 indirim uygulanacak
                      </p>
                    </div>
                  )}
                  <div className="border-t border-border pt-3 flex items-center justify-between">
                    <span className="text-base font-bold text-heading">Toplam</span>
                    <span className="text-lg font-bold text-heading">
                      {(() => {
                        const total = subtotal >= 499 ? subtotal : subtotal + 49.99;
                        return total.toLocaleString("tr-TR");
                      })()}{" "}
                      TL
                    </span>
                  </div>
                </div>
                <a
                  href={checkoutUrl ?? "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full py-3 bg-primary text-white text-sm font-medium text-center rounded-lg hover:bg-primary-dark transition-colors"
                >
                  Ödemeye Geç
                </a>
                <div className="mt-4 flex items-center justify-center gap-2 text-xs text-text-lighter">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 512 512">
                    <path d="M502.3 190.8c3.9-3.1 9.7-.2 9.7 4.7V400c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V195.6c0-5 5.7-7.8 9.7-4.7 22.4 17.4 52.1 39.5 154.1 113.6 21.1 15.4 56.7 47.8 92.2 47.6 35.7.3 72-32.8 92.3-47.6 102-74.1 131.6-96.3 154.1-113.7zM256 320c23.2.4 56.6-29.2 73.4-41.4 132.7-96.3 142.8-104.7 173.4-128.7 5.8-4.5 9.2-11.5 9.2-18.9v-19c0-26.5-21.5-48-48-48H48C21.5 64 0 85.5 0 112v19c0 7.4 3.4 14.3 9.2 18.9 30.6 23.9 40.7 32.4 173.4 128.7 16.8 12.2 50.2 41.8 73.4 41.4z" />
                  </svg>
                  Güvenli ödeme
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
