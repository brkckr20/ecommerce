"use server";

import { createCart, addToCart, removeFromCart, updateCartLines, getCart } from "@/lib/shopify-cart";

export async function createShopifyCart() {
  const cart = await createCart();
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
