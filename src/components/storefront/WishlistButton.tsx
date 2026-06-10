"use client";

import { useWishlist } from "@/providers/WishlistProvider";
import type { WishlistItem } from "@/types/wishlist";

interface Props {
  item: WishlistItem;
  className?: string;
  iconClass?: string;
}

export function WishlistButton({ item, className = "", iconClass = "" }: Props) {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const inWishlist = isInWishlist(item.id);

  return (
    <button
      onClick={() => toggleWishlist(item)}
      className={className}
      title={inWishlist ? "Favorilerden çıkar" : "Favorilere ekle"}
    >
      <svg
        className={iconClass}
        viewBox="0 0 24 24"
        fill={inWishlist ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
        />
      </svg>
    </button>
  );
}
