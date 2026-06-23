"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Header, Footer } from "@/components/storefront";
import PageMeta from "@/components/storefront/PageMeta";
import OrderTrackingTimeline from "@/components/storefront/OrderTrackingTimeline";
import { CancelReturnForm } from "@/components/storefront/order/CancelReturnForm";
import { simulateFulfillments, getFulfillmentStatusLabel, getPaymentStatusLabel } from "@/lib/tracking-simulation";
import { getDemoOrders } from "@/lib/demo-orders";
import type { ShopifyOrder } from "@/lib/shopify-types";

function parsePrice(amount: string): number {
  return parseFloat(amount.replace(",", ""));
}

export default function GuestOrderDetailPage() {
  const params = useParams();
  const no = params.no as string;
  const [order, setOrder] = useState<ShopifyOrder | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const allOrders = getDemoOrders();
    const found = allOrders.find((o) => o.name.replace("#", "") === no);

    if (found) {
      const enriched = {
        ...found,
        fulfillments: simulateFulfillments(found.fulfillmentStatus, found.processedAt),
      };
      setOrder(enriched);
    } else {
      setNotFound(true);
    }
  }, [no]);

  if (notFound) {
    return (
      <>
        <PageMeta title="Sipariş Bulunamadı" description="Geçersiz sipariş numarası." />
        <Header />
        <div className="min-h-screen bg-background-grey py-10 md:py-16">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h1 className="text-2xl font-bold text-heading mb-4">Sipariş Bulunamadı</h1>
            <p className="text-text text-sm mb-6">
              Bu numaraya ait bir sipariş bulunamadı. Lütfen sipariş numaranızı kontrol edin.
            </p>
            <Link href="/siparis-takip" className="text-primary hover:underline text-sm">
              Tekrar Sorgula
            </Link>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <PageMeta title="Sipariş Detayı" />
        <p className="text-text">Yükleniyor...</p>
      </div>
    );
  }

  const items = order.lineItems?.edges?.map((e: any) => e.node) || [];
  const statusColor = (s: string) =>
    s === "FULFILLED" || s === "PAID"
      ? "bg-green-100 text-green-700"
      : "bg-yellow-100 text-yellow-700";

  return (
    <>
      <PageMeta title={`Sipariş ${order.name}`} description={`${order.name} numaralı siparişinizin detayları.`} />
      <Header />
      <div className="min-h-screen bg-background-grey py-10 md:py-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center gap-2 mb-6">
            <Link href="/siparis-takip" className="text-sm text-primary hover:underline">
              Sipariş Takip
            </Link>
            <span className="text-sm text-text-lighter">/</span>
            <span className="text-sm text-text">{order.name}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-lg border border-border p-6">
                <h2 className="text-lg font-semibold text-heading mb-6">Sipariş Takibi</h2>
                <OrderTrackingTimeline order={order} />
              </div>

              <div className="bg-white rounded-lg border border-border p-6">
                <h2 className="text-lg font-semibold text-heading mb-4">Ürünler</h2>
                <div className="space-y-4">
                  {items.map((item: any, i: number) => (
                    <div key={i} className="flex gap-4">
                      <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                        {item.variant?.image?.url ? (
                          <Image src={item.variant.image.url} alt={item.title} width={64} height={64} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">Yok</div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-heading truncate">{item.title}</p>
                        {item.variant?.title && (
                          <p className="text-xs text-text">{item.variant.title}</p>
                        )}
                        <p className="text-xs text-text">{item.quantity} adet</p>
                      </div>
                      {item.variant?.price && (
                        <p className="text-sm font-medium text-heading flex-shrink-0">
                          {parsePrice(item.variant.price.amount).toFixed(2)} {item.variant.price.currencyCode}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white rounded-lg border border-border p-6">
                <h2 className="text-lg font-semibold text-heading mb-4">Sipariş Özeti</h2>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-text">Sipariş No</span>
                    <span className="text-heading font-medium">{order.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text">Tarih</span>
                    <span className="text-heading">
                      {new Date(order.processedAt).toLocaleDateString("tr-TR")}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text">Durum</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${statusColor(order.fulfillmentStatus)}`}>
                      {getFulfillmentStatusLabel(order.fulfillmentStatus)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text">Ödeme</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${statusColor(order.financialStatus)}`}>
                      {getPaymentStatusLabel(order.financialStatus)}
                    </span>
                  </div>
                  <div className="flex justify-between pt-3 border-t border-border">
                    <span className="text-text font-semibold">Toplam</span>
                    <span className="text-heading font-bold">
                      {parsePrice(order.totalPrice.amount).toFixed(2)} {order.totalPrice.currencyCode}
                    </span>
                  </div>
                </div>
              </div>

              <CancelReturnForm order={order} />
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
