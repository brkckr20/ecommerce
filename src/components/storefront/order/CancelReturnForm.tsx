"use client";

import { useState } from "react";

const CANCEL_WINDOW_HOURS = 2;

const reasons = [
  { value: "vazgectim", label: "Vazgeçtim / İhtiyacım kalmadı" },
  { value: "yanlis-urun", label: "Yanlış ürün sipariş ettim" },
  { value: "fiyat", label: "Daha uygun fiyat buldum" },
  { value: "kargo-suresi", label: "Kargo süresi çok uzun" },
  { value: "kusurlu", label: "Ürün kusurlu/hasarlı çıktı" },
  { value: "diger", label: "Diğer" },
];

interface OrderItem {
  title: string;
  quantity: number;
  variant?: {
    title?: string;
    price?: { amount: string; currencyCode: string };
    image?: { url: string };
  };
}

interface Props {
  order: {
    id: string;
    name: string;
    processedAt: string;
    fulfillmentStatus: string;
    financialStatus: string;
  };
  items?: OrderItem[];
}

export function CancelReturnForm({ order, items: orderItems = [] }: Props) {
  const [showForm, setShowForm] = useState(false);
  const [type, setType] = useState<"cancel" | "return">("cancel");
  const [reason, setReason] = useState("");
  const [customReason, setCustomReason] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [selectedItems, setSelectedItems] = useState<number[]>([]);

  const now = Date.now();
  const orderTime = new Date(order.processedAt).getTime();
  const hoursSinceOrder = (now - orderTime) / (1000 * 60 * 60);
  const isInCancelWindow = hoursSinceOrder < CANCEL_WINDOW_HOURS;
  const isShipped = order.fulfillmentStatus === "FULFILLED";
  const isRefunded = order.financialStatus === "REFUNDED";

  if (isRefunded) {
    return (
      <div className="bg-white rounded-lg border border-border p-6">
        <h2 className="text-lg font-semibold text-heading mb-4">İşlem Durumu</h2>
        <div className="bg-green-50 rounded-lg p-4 text-center">
          <p className="text-sm text-green-700 font-medium">Bu sipariş iade edilmiştir.</p>
        </div>
      </div>
    );
  }

  if (!showForm) {
    return (
      <div className="bg-white rounded-lg border border-border p-6">
        <h2 className="text-lg font-semibold text-heading mb-4">İşlem Yap</h2>
        {!isShipped ? (
          <div>
            {isInCancelWindow ? (
              <button
                onClick={() => { setType("cancel"); setShowForm(true); }}
                className="w-full py-3 bg-red-500 text-white text-sm font-medium rounded-lg hover:bg-red-600 transition-colors"
              >
                Siparişi İptal Et
              </button>
            ) : (
              <div className="text-center">
                <p className="text-sm text-text mb-3">
                  İptal süresi geçmiştir ({CANCEL_WINDOW_HOURS} saat içinde iptal edilebilir).
                </p>
                <button
                  onClick={() => { setType("cancel"); setShowForm(true); }}
                  className="w-full py-3 bg-heading text-white text-sm font-medium rounded-lg hover:bg-primary transition-colors"
                >
                  İptal Talebi Oluştur
                </button>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={() => { setType("return"); setShowForm(true); }}
            className="w-full py-3 bg-heading text-white text-sm font-medium rounded-lg hover:bg-primary transition-colors"
          >
            İade Talep Et
          </button>
        )}
      </div>
    );
  }

  if (success) {
    return (
      <div className="bg-white rounded-lg border border-border p-6">
        <h2 className="text-lg font-semibold text-heading mb-4">İşlem Durumu</h2>
        <div className="bg-green-50 rounded-lg p-4 text-center">
          <svg className="w-10 h-10 text-green-500 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-sm text-green-700 font-medium mb-1">
            {type === "cancel" ? "İptal" : "İade"} talebiniz alındı!
          </p>
          <p className="text-xs text-green-600">
            Talebiniz incelenecek ve en kısa sürede size bilgi verilecektir.
          </p>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalReason = reason === "diger" ? customReason : reason;

    if (!finalReason) {
      setError("Lütfen bir sebep seçin.");
      return;
    }

    if (type === "return" && selectedItems.length === 0) {
      setError("Lütfen iade etmek istediğiniz ürünleri seçin.");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/orders/cancel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: order.id, type, reason: finalReason, items: selectedItems, totalItems: orderItems.length }),
      });

      if (!res.ok) {
        throw new Error("Bir hata oluştu");
      }

      setSuccess(true);
    } catch {
      setError("Bir hata oluştu. Lütfen daha sonra tekrar deneyin.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg border border-border p-6">
      <h2 className="text-lg font-semibold text-heading mb-4">
        {type === "cancel" ? "Siparişi İptal Et" : "İade Talebi Oluştur"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {type === "return" && orderItems.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-heading mb-2">İade Edilecek Ürünler</label>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {orderItems.map((item, i) => (
                <label
                  key={i}
                  className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                    selectedItems.includes(i) ? "border-primary bg-primary/5" : "border-border hover:border-text-lighter"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedItems.includes(i)}
                    onChange={() => {
                      setSelectedItems((prev) =>
                        prev.includes(i) ? prev.filter((idx) => idx !== i) : [...prev, i]
                      );
                    }}
                    className="w-4 h-4 accent-primary"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-heading truncate">{item.title}</p>
                    {item.variant?.title && (
                      <p className="text-xs text-text">{item.variant.title}</p>
                    )}
                  </div>
                  <span className="text-xs text-text whitespace-nowrap">{item.quantity} adet</span>
                </label>
              ))}
            </div>
          </div>
        )}
        <div>
          <label className="block text-sm font-medium text-heading mb-1.5">Sebep</label>
          <select
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full px-3 py-2.5 text-sm border border-border rounded-lg focus:outline-none focus:border-primary transition-colors text-heading"
          >
            <option value="">Sebep seçin</option>
            {reasons.map((r) => (
              <option key={r.value} value={r.value}>{r.label}</option>
            ))}
          </select>
        </div>

        {reason === "diger" && (
          <div>
            <label className="block text-sm font-medium text-heading mb-1.5">Açıklama</label>
            <textarea
              value={customReason}
              onChange={(e) => setCustomReason(e.target.value)}
              rows={3}
              placeholder="Sebebinizi açıklayın..."
              className="w-full px-3 py-2.5 text-sm border border-border rounded-lg focus:outline-none focus:border-primary transition-colors text-heading placeholder:text-text-lighter resize-none"
            />
          </div>
        )}

        {error && <p className="text-sm text-red-500">{error}</p>}

        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => setShowForm(false)}
            className="flex-1 py-2.5 text-sm font-medium text-heading border border-border rounded-lg hover:bg-background-grey transition-colors"
          >
            Vazgeç
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="flex-1 py-2.5 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? "Gönderiliyor..." : "Gönder"}
          </button>
        </div>
      </form>
    </div>
  );
}
