"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCustomer } from "@/providers/ShopifyCustomerProvider";
import { Header, Footer } from "@/components/storefront";

export default function OrdersPage() {
  const { customer, isLoading } = useCustomer();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !customer) {
      router.replace("/");
    }
  }, [customer, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-text">Yükleniyor...</p>
      </div>
    );
  }

  if (!customer) return null;

  const orders = customer.orders?.edges?.map((e: any) => e.node) || [];

  return (
    <>
      <Header />
      <div className="min-h-screen bg-background-grey py-10 md:py-16">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-3xl font-bold text-heading mb-8">Siparişlerim</h1>

          {orders.length === 0 ? (
            <div className="bg-white rounded-lg border border-border p-12 text-center">
              <svg className="w-16 h-16 mx-auto text-text-lighter mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <h2 className="text-xl font-semibold text-heading mb-2">Henüz siparişiniz yok</h2>
              <p className="text-text mb-6">Alışverişe başlayarak ilk siparişinizi oluşturabilirsiniz.</p>
              <Link
                href="/"
                className="inline-block px-6 py-3 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-dark transition-colors"
              >
                Alışverişe Başla
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order: any) => (
                <div key={order.id} className="bg-white rounded-lg border border-border p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-sm font-semibold text-heading">{order.name}</p>
                      <p className="text-xs text-text">{new Date(order.processedAt).toLocaleDateString("tr-TR")}</p>
                    </div>
                    <span className="text-sm font-medium text-heading">
                      {parseFloat(order.totalPrice.amount).toFixed(2)} {order.totalPrice.currencyCode}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      order.fulfillmentStatus === "FULFILLED" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                    }`}>
                      {order.fulfillmentStatus === "FULFILLED" ? "Teslim Edildi" : "Hazırlanıyor"}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      order.financialStatus === "PAID" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                    }`}>
                      {order.financialStatus === "PAID" ? "Ödendi" : "Bekliyor"}
                    </span>
                  </div>
                  <div className="mt-3 space-y-1">
                    {order.lineItems.edges.map((item: any, i: number) => (
                      <p key={i} className="text-xs text-text">
                        {item.node.title} x {item.node.quantity}
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
