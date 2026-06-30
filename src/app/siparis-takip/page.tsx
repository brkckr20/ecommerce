"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Header, Footer } from "@/components/storefront";
import PageMeta from "@/components/storefront/PageMeta";
import { useCustomer } from "@/providers/ShopifyCustomerProvider";

export default function SiparisTakipPage() {
  const { customer } = useCustomer();
  const router = useRouter();
  const [orderNo, setOrderNo] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderNo.trim()) {
      setError("Lütfen sipariş numaranızı girin.");
      return;
    }
    if (!customer && !email.trim()) {
      setError("Lütfen e-posta adresinizi girin.");
      return;
    }
    setError("");
    const params = new URLSearchParams();
    if (!customer && email.trim()) {
      params.set("email", email.trim());
    }
    const qs = params.toString();
    router.push(`/siparis-takip/${orderNo.trim().replace("#", "")}${qs ? `?${qs}` : ""}`);
  };

  return (
    <>
      <PageMeta title="Sipariş Takip" description="Sipariş numaranızla siparişinizin durumunu sorgulayın ve iade/değişim işlemlerinizi yönetin." />
      <Header />
      <div className="min-h-screen bg-background-grey py-10 md:py-16">
        <div className="max-w-lg mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-heading mb-3">Sipariş Takip</h1>
            <p className="text-text text-sm">
              Sipariş numaranızı girerek siparişinizin durumunu sorgulayabilirsiniz.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-border p-8">
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-heading mb-1.5">Sipariş Numarası</label>
                <input
                  type="text"
                  value={orderNo}
                  onChange={(e) => setOrderNo(e.target.value)}
                  placeholder="#1001"
                  className="w-full px-4 py-2.5 text-sm border border-border rounded-lg focus:outline-none focus:border-primary transition-colors text-heading placeholder:text-text-lighter"
                />
              </div>

              {!customer && (
                <div>
                  <label className="block text-sm font-medium text-heading mb-1.5">E-posta Adresi</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ornek@email.com"
                    className="w-full px-4 py-2.5 text-sm border border-border rounded-lg focus:outline-none focus:border-primary transition-colors text-heading placeholder:text-text-lighter"
                  />
                </div>
              )}

              {error && (
                <p className="text-sm text-red-500">{error}</p>
              )}

              <button
                type="submit"
                className="w-full py-3 bg-heading text-white text-sm font-medium rounded-lg hover:bg-primary transition-colors"
              >
                Siparişi Sorgula
              </button>
            </div>
          </form>

          <div className="mt-8 text-center">
            <h2 className="text-lg font-semibold text-heading mb-2">Hızlı Sorgulama</h2>
            <p className="text-xs text-text mb-4">Demo siparişlerle test edebilirsiniz:</p>
            <div className="flex flex-wrap justify-center gap-2">
              {["1001", "1002", "1003"].map((no) => (
                <button
                  key={no}
                  onClick={() => router.push(`/siparis-takip/${no}`)}
                  className="px-4 py-2 text-xs font-medium bg-white border border-border rounded-lg hover:border-primary hover:text-primary transition-colors"
                >
                  #{no}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
