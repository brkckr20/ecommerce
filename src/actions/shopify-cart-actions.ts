"use server";

import { createCart, addToCart, removeFromCart, updateCartLines, getCart, applyDiscountCode } from "@/lib/shopify-cart";

export async function createShopifyCart(lines?: Array<{ merchandiseId: string; quantity: number }>) {
  const cart = await createCart(lines);
  return {
    id: cart.id,
    checkoutUrl: cart.checkoutUrl,
    totalQuantity: cart.totalQuantity,
  };
}

export async function addToShopifyCart(
  cartId: string,
  lines: Array<{ merchandiseId: string; quantity: number }>
) {
  const cart = await addToCart(cartId, lines);
  return {
    id: cart.id,
    checkoutUrl: cart.checkoutUrl,
    totalQuantity: cart.totalQuantity,
  };
}

export async function removeFromShopifyCart(cartId: string, lineIds: string[]) {
  const cart = await removeFromCart(cartId, lineIds);
  return {
    id: cart.id,
    checkoutUrl: cart.checkoutUrl,
    totalQuantity: cart.totalQuantity,
  };
}

export async function updateShopifyCartLines(
  cartId: string,
  lines: Array<{ id: string; quantity: number }>
) {
  const cart = await updateCartLines(cartId, lines);
  return {
    id: cart.id,
    checkoutUrl: cart.checkoutUrl,
    totalQuantity: cart.totalQuantity,
  };
}

export async function getShopifyCart(cartId: string) {
  const cart = await getCart(cartId);
  if (!cart) return null;
  return {
    id: cart.id,
    checkoutUrl: cart.checkoutUrl,
    totalQuantity: cart.totalQuantity,
  };
}

export async function applyDiscountCodeToShopifyCart(cartId: string, discountCodes: string[]) {
  const cart = await applyDiscountCode(cartId, discountCodes);
  return {
    id: cart.id,
    checkoutUrl: cart.checkoutUrl,
    totalQuantity: cart.totalQuantity,
    cost: cart.cost,
  };
}
