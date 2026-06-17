"use client";

import { getTimelineEvents } from "@/lib/tracking-simulation";
import type { ShopifyOrder } from "@/lib/shopify-types";

interface Props {
  order: ShopifyOrder;
}

export default function OrderTrackingTimeline({ order }: Props) {
  const events = getTimelineEvents(order);

  return (
    <div className="relative">
      {events.map((event, i) => (
        <div key={i} className="flex gap-4 pb-8 last:pb-0 relative">
          <div className="flex flex-col items-center">
            <div
              className={`w-5 h-5 rounded-full border-2 flex-shrink-0 z-10 ${
                event.completed
                  ? "bg-primary border-primary"
                  : "bg-white border-gray-300"
              }`}
            >
              {event.completed && (
                <svg className="w-full h-full text-white p-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
            {i < events.length - 1 && (
              <div
                className={`w-0.5 h-full absolute top-5 ${
                  event.completed ? "bg-primary" : "bg-gray-200"
                }`}
              />
            )}
          </div>
          <div className={`pt-0.5 ${!event.completed ? "opacity-50" : ""}`}>
            <p className="text-sm font-semibold text-heading">{event.label}</p>
            <p className="text-xs text-text mt-0.5">
              {event.date.toLocaleDateString("tr-TR", {
                day: "numeric",
                month: "long",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
            {event.detail && (
              <p className="text-xs text-text mt-1">{event.detail}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
