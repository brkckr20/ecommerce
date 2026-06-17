"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useCustomer } from "@/providers/ShopifyCustomerProvider";
import { Header, Footer } from "@/components/storefront";
import OrderTrackingTimeline from "@/components/storefront/OrderTrackingTimeline";
import { simulateFulfillments, getPaymentStatusLabel, getFulfillmentStatusLabel } from "@/lib/tracking-simulation";
import { getDemoOrders } from "@/lib/demo-orders";
import type { ShopifyOrder } from "@/lib/shopify-types";

function parsePrice(amount: string): number {
  return parseFloat(amount.replace(",", ""));
}

export default function OrderDetailPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const { customer, isLoading } = useCustomer();
  const [order, setOrder] = useState<ShopifyOrder | null>(null);

  useEffect(() => {
    const allOrders = [
      ...(customer?.orders?.edges?.map((e: any) => e.node as ShopifyOrder) || []),
      ...getDemoOrders(),
    ];

    const found = allOrders.find((o: ShopifyOrder) => {
      const orderId = o.id.split("/").pop();
      return orderId === id || o.name.replace("#", "") === id;
    });

    if (found) {
      const enriched = {
        ...found,
        fulfillments: simulateFulfillments(found.fulfillmentStatus, found.processedAt),
      };
      setOrder(enriched);
    }
  }, [customer, isLoading, id]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-text">Yükleniyor...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-background-grey py-10 md:py-16">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h1 className="text-2xl font-bold text-heading mb-4">Sipariş Bulunamadı</h1>
            <Link href="/siparislerim" className="text-primary hover:underline text-sm">
              Siparişlerime Dön
            </Link>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const items = order.lineItems?.edges?.map((e: any) => e.node) || [];
  const statusColor = (status: string) =>
    status === "FULFILLED" || status === "PAID"
      ? "bg-green-100 text-green-700"
      : "bg-yellow-100 text-yellow-700";

  return (
    <>
      <Header />
      <div className="min-h-screen bg-background-grey py-10 md:py-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center gap-2 mb-8">
            <Link href="/siparislerim" className="text-sm text-primary hover:underline">
              Siparişlerim
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
                          <img src={item.variant.image.url} alt={item.title} className="w-full h-full object-cover" />
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
                  {(order as any).subtotalPrice && (
                    <div className="flex justify-between pt-3 border-t border-border">
                      <span className="text-text">Ara Toplam</span>
                      <span className="text-heading">
                        {parsePrice((order as any).subtotalPrice.amount).toFixed(2)} {(order as any).subtotalPrice.currencyCode}
                      </span>
                    </div>
                  )}
                  {(order as any).totalShippingPrice && parsePrice((order as any).totalShippingPrice.amount) > 0 && (
                    <div className="flex justify-between">
                      <span className="text-text">Kargo</span>
                      <span className="text-heading">
                        {parsePrice((order as any).totalShippingPrice.amount).toFixed(2)} {(order as any).totalShippingPrice.currencyCode}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between pt-3 border-t border-border">
                    <span className="text-text font-semibold">Toplam</span>
                    <span className="text-heading font-bold">
                      {parsePrice(order.totalPrice.amount).toFixed(2)} {order.totalPrice.currencyCode}
                    </span>
                  </div>
                </div>
              </div>

              {order.fulfillments && order.fulfillments.length > 0 && (
                <div className="bg-white rounded-lg border border-border p-6">
                  <h2 className="text-lg font-semibold text-heading mb-4">Kargo Bilgisi</h2>
                  {order.fulfillments.map((f, i) => (
                    <div key={i} className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-text">Kargo Firması</span>
                        <span className="text-heading font-medium">{f.trackingCompany || "Belirtilmemiş"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-text">Takip No</span>
                        <span className="text-heading font-medium">{f.trackingNumber || "—"}</span>
                      </div>
                      {f.trackingUrl && (
                        <a
                          href={f.trackingUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-block mt-2 text-sm text-primary hover:underline"
                        >
                          Kargoyu Takip Et →
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {order.shippingAddress && (
                <div className="bg-white rounded-lg border border-border p-6">
                  <h2 className="text-lg font-semibold text-heading mb-4">Teslimat Adresi</h2>
                  <div className="text-sm text-text space-y-1">
                    {order.shippingAddress.firstName && order.shippingAddress.lastName && (
                      <p className="text-heading font-medium">
                        {order.shippingAddress.firstName} {order.shippingAddress.lastName}
                      </p>
                    )}
                    {order.shippingAddress.address1 && <p>{order.shippingAddress.address1}</p>}
                    {order.shippingAddress.address2 && <p>{order.shippingAddress.address2}</p>}
                    <p>
                      {[order.shippingAddress.city, order.shippingAddress.province, order.shippingAddress.zip]
                        .filter(Boolean)
                        .join(" / ")}
                    </p>
                    {order.shippingAddress.phone && <p>{order.shippingAddress.phone}</p>}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
