"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
  type ReactNode,
} from "react";
import type { CartItem } from "@/types/cart";
import { useCustomer } from "./ShopifyCustomerProvider";

type FlyPhase = "idle" | "start" | "animate";

interface FlyState {
  phase: FlyPhase;
  fromRect: DOMRect | null;
  toRect: DOMRect | null;
  imageUrl: string;
}

const FIRST_ORDER_DISCOUNT_CODE = "ILK15";

interface CartContextValue {
  items: CartItem[];
  cartCount: number;
  isDrawerOpen: boolean;
  cartIconRef: React.RefObject<HTMLButtonElement | null>;
  openDrawer: () => void;
  closeDrawer: () => void;
  addToCartWithFly: (
    data: Omit<CartItem, "id"> & { productId: number; variantId?: string },
    fromRect: DOMRect,
    imageUrl: string,
  ) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, qty: number) => void;
  fly: FlyState;
  addingProductId: number | null;
  checkoutUrl: string | null;
  discountApplied: boolean;
  isFirstOrderEligible: boolean;
}

const CartContext = createContext<CartContextValue | null>(null);

function generateId(productId: number, size: string, color: string): string {
  return `${productId}-${size}-${color}`;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [fly, setFly] = useState<FlyState>({
    phase: "idle",
    fromRect: null,
    toRect: null,
    imageUrl: "",
  });
  const [addingProductId, setAddingProductId] = useState<number | null>(null);
  const [shopifyCartId, setShopifyCartId] = useState<string | null>(null);
  const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null);
  const [discountApplied, setDiscountApplied] = useState(false);
  const cartIconRef = useRef<HTMLButtonElement | null>(null);
  const pendingItemRef = useRef<(Omit<CartItem, "id"> & { productId: number; variantId?: string }) | null>(null);
  const { customer } = useCustomer();

  const isFirstOrderEligible = !!(customer && (customer.numberOfOrders ?? 0) === 0);

  useEffect(() => {
    setMounted(true);
    try {
      const stored = localStorage.getItem("cart");
      if (stored) {
        setItems(JSON.parse(stored));
      }
      const storedCartId = localStorage.getItem("shopifyCartId");
      if (storedCartId) {
        setShopifyCartId(storedCartId);
      }
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem("cart", JSON.stringify(items));
    }
  }, [items, mounted]);

  useEffect(() => {
    if (shopifyCartId) {
      localStorage.setItem("shopifyCartId", shopifyCartId);
    }
  }, [shopifyCartId]);

  const openDrawer = useCallback(() => setIsDrawerOpen(true), []);
  const closeDrawer = useCallback(() => setIsDrawerOpen(false), []);

  const applyDiscount = useCallback(
    async (cartId: string) => {
      if (!isFirstOrderEligible) return;
      try {
        const { applyDiscountCodeToShopifyCart } = await import("@/actions/shopify-cart-actions");
        const result = await applyDiscountCodeToShopifyCart(cartId, [FIRST_ORDER_DISCOUNT_CODE]);
        setCheckoutUrl(result.checkoutUrl);
        setDiscountApplied(true);
      } catch {
        // Discount application failed silently
      }
    },
    [isFirstOrderEligible]
  );

  const syncToShopify = useCallback(
    async (currentItems: CartItem[]) => {
      try {
        const { createShopifyCart } = await import("@/actions/shopify-cart-actions");

        const lines = currentItems
          .filter((item) => item.variantId)
          .map((item) => ({
            merchandiseId: item.variantId!,
            quantity: item.quantity,
          }));

        const cart = await createShopifyCart(lines.length > 0 ? lines : undefined);
        setShopifyCartId(cart.id);
        setCheckoutUrl(cart.checkoutUrl);
        setDiscountApplied(false);
      } catch {
        // Shopify sync failed silently
      }
    },
    []
  );

  useEffect(() => {
    if (mounted && items.length > 0) {
      syncToShopify(items);
    }
  }, [items, mounted, syncToShopify]);

  useEffect(() => {
    if (shopifyCartId && isFirstOrderEligible) {
      applyDiscount(shopifyCartId);
    }
  }, [shopifyCartId, isFirstOrderEligible, applyDiscount]);

  const removeFromCart = useCallback(
    (id: string) => {
      setItems((prev) => prev.filter((i) => i.id !== id));
    },
    []
  );

  const updateQuantity = useCallback(
    (id: string, qty: number) => {
      setItems((prev) =>
        prev.map((i) => (i.id === id ? { ...i, quantity: qty } : i))
      );
    },
    []
  );

  const finalizeAddToCart = useCallback(() => {
    const pending = pendingItemRef.current;
    if (!pending) return;
    const id = generateId(pending.productId, pending.size, pending.color);
    setItems((prev) => {
      const existing = prev.find((i) => i.id === id);
      if (existing) {
        return prev.map((i) =>
          i.id === id ? { ...i, quantity: i.quantity + pending.quantity } : i,
        );
      }
      return [...prev, { ...pending, id }];
    });
    pendingItemRef.current = null;
    setAddingProductId(null);
    setIsDrawerOpen(true);
    setFly({ phase: "idle", fromRect: null, toRect: null, imageUrl: "" });
  }, []);

  const addToCartWithFly = useCallback(
    (
      data: Omit<CartItem, "id"> & { productId: number; variantId?: string },
      fromRect: DOMRect,
      imageUrl: string,
    ) => {
      setAddingProductId(data.productId);
      pendingItemRef.current = data;

      setFly({ phase: "start", fromRect, toRect: null, imageUrl });

      requestAnimationFrame(() => {
        const iconEl = cartIconRef.current;
        const toRect = iconEl ? iconEl.getBoundingClientRect() : null;
        setFly({ phase: "animate", fromRect, toRect, imageUrl });
      });

      setTimeout(() => {
        finalizeAddToCart();
      }, 600);
    },
    [finalizeAddToCart],
  );

  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
      <CartContext.Provider
      value={{
        items,
        cartCount,
        isDrawerOpen,
        cartIconRef,
        openDrawer,
        closeDrawer,
        addToCartWithFly,
        removeFromCart,
        updateQuantity,
        fly,
        addingProductId,
        checkoutUrl,
        discountApplied,
        isFirstOrderEligible,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
