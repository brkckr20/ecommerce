import type { ShopifyFulfillment } from "@/lib/shopify-types";

const cargoCompanies = [
  { name: "Yurtiçi Kargo", url: "https://www.yurticikargo.com/tr/online-servisler/gonderi-sorgula?code=" },
  { name: "MNG Kargo", url: "https://www.mngkargo.com.tr/gonderi-takip?code=" },
  { name: "Aras Kargo", url: "https://www.araskargo.com.tr/tr/takip?code=" },
  { name: "PTT Kargo", url: "https://gonderitakip.ptt.gov.tr/?code=" },
];

function randomCargo() {
  return cargoCompanies[Math.floor(Math.random() * cargoCompanies.length)];
}

function randomTrackingNumber() {
  const prefix = String.fromCharCode(65 + Math.floor(Math.random() * 26)) + String.fromCharCode(65 + Math.floor(Math.random() * 26));
  const num = Math.floor(1000000000 + Math.random() * 9000000000);
  return `${prefix}${num}`;
}

export function simulateFulfillments(fulfillmentStatus: string, processedAt: string): ShopifyFulfillment[] {
  const cargo = randomCargo();
  const trackingNo = randomTrackingNumber();

  if (fulfillmentStatus === "FULFILLED") {
    return [
      { trackingCompany: cargo.name, trackingNumber: trackingNo, trackingUrl: cargo.url + trackingNo, status: "delivered" },
    ];
  }

  if (fulfillmentStatus === "PARTIALLY_FULFILLED" || fulfillmentStatus === "IN_PROGRESS") {
    return [
      { trackingCompany: cargo.name, trackingNumber: trackingNo, trackingUrl: cargo.url + trackingNo, status: "in_transit" },
    ];
  }

  return [];
}

export function getTimelineEvents(
  order: {
    processedAt: string;
    fulfillmentStatus: string;
    financialStatus: string;
    fulfillments?: ShopifyFulfillment[];
  }
) {
  const events: { label: string; date: Date; completed: boolean; detail?: string }[] = [];
  const orderDate = new Date(order.processedAt);

  events.push({
    label: "Sipariş Alındı",
    date: orderDate,
    completed: true,
    detail: `Siparişiniz ${orderDate.toLocaleDateString("tr-TR")} tarihinde oluşturuldu.`,
  });

  const preparingDate = new Date(orderDate);
  preparingDate.setHours(preparingDate.getHours() + 4);
  const now = new Date();
  events.push({
    label: "Hazırlanıyor",
    date: preparingDate,
    completed: now >= preparingDate,
    detail: "Siparişiniz hazırlanıyor.",
  });

  const fulfillment = order.fulfillments?.[0];
  if (order.fulfillmentStatus !== "UNFULFILLED") {
    const shippedDate = new Date(orderDate);
    shippedDate.setDate(shippedDate.getDate() + 1);
    events.push({
      label: "Kargoya Verildi",
      date: shippedDate,
      completed: true,
      detail: fulfillment
        ? `${fulfillment.trackingCompany} - ${fulfillment.trackingNumber}`
        : "Kargoya verildi.",
    });
  } else {
    const futureShip = new Date(orderDate);
    futureShip.setDate(futureShip.getDate() + 1);
    events.push({
      label: "Kargoya Verilecek",
      date: futureShip,
      completed: false,
    });
  }

  if (order.fulfillmentStatus === "FULFILLED") {
    const deliveredDate = new Date(orderDate);
    deliveredDate.setDate(deliveredDate.getDate() + 3);
    events.push({
      label: "Teslim Edildi",
      date: deliveredDate,
      completed: true,
      detail: "Siparişiniz teslim edildi.",
    });
  } else {
    const futureDel = new Date(orderDate);
    futureDel.setDate(futureDel.getDate() + 3);
    events.push({
      label: "Teslim Edilecek",
      date: futureDel,
      completed: false,
    });
  }

  return events;
}

export function getPaymentStatusLabel(status: string) {
  const map: Record<string, string> = {
    PAID: "Ödendi",
    PENDING: "Ödeme Bekliyor",
    AUTHORIZED: "Onaylandı",
    REFUNDED: "İade Edildi",
    PARTIALLY_REFUNDED: "Kısmi İade",
    VOIDED: "İptal Edildi",
  };
  return map[status] || status;
}

export function getFulfillmentStatusLabel(status: string) {
  const map: Record<string, string> = {
    FULFILLED: "Teslim Edildi",
    UNFULFILLED: "Hazırlanıyor",
    PARTIALLY_FULFILLED: "Kısmen Gönderildi",
    IN_PROGRESS: "Hazırlanıyor",
  };
  return map[status] || status;
}
