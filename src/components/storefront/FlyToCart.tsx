"use client";

import { useCart } from "@/providers/CartProvider";

export function FlyToCart() {
  const { fly } = useCart();

  if (fly.phase === "idle" || !fly.fromRect) return null;

  const startSize = 50;
  const endSize = 24;
  const r = fly.fromRect;
  const isAnimate = fly.phase === "animate";
  const to = fly.toRect;

  const left =
    isAnimate && to
      ? to.left + (to.width - endSize) / 2
      : r.left + (r.width - startSize) / 2;
  const top =
    isAnimate && to
      ? to.top + (to.height - endSize) / 2
      : r.top + (r.height - startSize) / 2;
  const size = isAnimate ? endSize : startSize;

  return (
    <div
      className={`fixed z-[999] pointer-events-none ${
        isAnimate ? "transition-all duration-500 ease-out" : ""
      }`}
      style={{
        left,
        top,
        width: size,
        height: size,
        opacity: isAnimate && to ? 0 : 1,
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={fly.imageUrl}
        alt=""
        className="w-full h-full object-cover rounded-full border-2 border-primary shadow-lg"
      />
    </div>
  );
}
