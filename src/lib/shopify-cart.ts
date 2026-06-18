import { shopifyFetch } from "./shopify";
import { CART_DISCOUNT_CODES_UPDATE_MUTATION } from "./shopify-queries";

const CART_CREATE_MUTATION = `#graphql
mutation CartCreate($input: CartInput!) {
  cartCreate(input: $input) {
    cart {
      id
      checkoutUrl
      totalQuantity
      cost {
        subtotalAmount { amount currencyCode }
        totalAmount { amount currencyCode }
      }
      lines(first: 100) {
        edges {
          node {
            id
            quantity
            merchandise {
              ... on ProductVariant {
                id
                title
                sku
                price { amount currencyCode }
                product {
                  handle
                  title
                  images(first: 1) {
                    edges { node { url } }
                  }
                }
              }
            }
          }
        }
      }
    }
    userErrors {
      field
      message
    }
  }
}`;

const CART_LINES_ADD_MUTATION = `#graphql
mutation CartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
  cartLinesAdd(cartId: $cartId, lines: $lines) {
    cart {
      id
      checkoutUrl
      totalQuantity
      cost {
        subtotalAmount { amount currencyCode }
        totalAmount { amount currencyCode }
      }
      lines(first: 100) {
        edges {
          node {
            id
            quantity
            merchandise {
              ... on ProductVariant {
                id
                title
                sku
                price { amount currencyCode }
                product {
                  handle
                  title
                  images(first: 1) {
                    edges { node { url } }
                  }
                }
              }
            }
          }
        }
      }
    }
    userErrors {
      field
      message
    }
  }
}`;

const CART_LINES_REMOVE_MUTATION = `#graphql
mutation CartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
  cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
    cart {
      id
      checkoutUrl
      totalQuantity
      lines(first: 100) {
        edges {
          node { id quantity }
        }
      }
    }
    userErrors {
      field
      message
    }
  }
}`;

const CART_LINES_UPDATE_MUTATION = `#graphql
mutation CartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
  cartLinesUpdate(cartId: $cartId, lines: $lines) {
    cart {
      id
      checkoutUrl
      totalQuantity
      lines(first: 100) {
        edges {
          node { id quantity }
        }
      }
    }
    userErrors {
      field
      message
    }
  }
}`;

const CART_QUERY = `#graphql
query Cart($cartId: ID!) {
  cart(id: $cartId) {
    id
    checkoutUrl
    totalQuantity
    cost {
      subtotalAmount { amount currencyCode }
      totalAmount { amount currencyCode }
    }
    lines(first: 100) {
      edges {
        node {
          id
          quantity
          merchandise {
            ... on ProductVariant {
              id
              title
              sku
              price { amount currencyCode }
              product {
                handle
                title
                images(first: 1) {
                  edges { node { url } }
                }
              }
            }
          }
        }
      }
    }
  }
}`;

export interface CartLineInput {
  merchandiseId: string;
  quantity: number;
}

interface CartResponse {
  cart: {
    id: string;
    checkoutUrl: string;
    totalQuantity: number;
    cost: {
      subtotalAmount: { amount: string; currencyCode: string };
      totalAmount: { amount: string; currencyCode: string };
    };
    lines: {
      edges: Array<{
        node: {
          id: string;
          quantity: number;
          merchandise: {
            id: string;
            title: string;
            sku: string;
            price: { amount: string; currencyCode: string };
            product: {
              handle: string;
              title: string;
              images: { edges: Array<{ node: { url: string } }> };
            };
          };
        };
      }>;
    };
  };
}

export async function createCart(lines?: CartLineInput[]): Promise<CartResponse["cart"]> {
  const variables: { input?: { lines?: CartLineInput[] } } = {};
  if (lines && lines.length > 0) {
    variables.input = { lines };
  } else {
    variables.input = {};
  }

  const data = await shopifyFetch<{
    cartCreate: CartResponse & { userErrors: Array<{ field: string; message: string }> };
  }>(CART_CREATE_MUTATION, variables);

  if (data.cartCreate.userErrors.length > 0) {
    throw new Error(data.cartCreate.userErrors[0].message);
  }

  return data.cartCreate.cart;
}

export async function addToCart(
  cartId: string,
  lines: CartLineInput[]
): Promise<CartResponse["cart"]> {
  const data = await shopifyFetch<{
    cartLinesAdd: CartResponse & { userErrors: Array<{ field: string; message: string }> };
  }>(CART_LINES_ADD_MUTATION, {
    cartId,
    lines,
  });

  if (data.cartLinesAdd.userErrors.length > 0) {
    throw new Error(data.cartLinesAdd.userErrors[0].message);
  }

  return data.cartLinesAdd.cart;
}

export async function removeFromCart(
  cartId: string,
  lineIds: string[]
): Promise<CartResponse["cart"]> {
  const data = await shopifyFetch<{
    cartLinesRemove: CartResponse & { userErrors: Array<{ field: string; message: string }> };
  }>(CART_LINES_REMOVE_MUTATION, {
    cartId,
    lineIds,
  });

  if (data.cartLinesRemove.userErrors.length > 0) {
    throw new Error(data.cartLinesRemove.userErrors[0].message);
  }

  return data.cartLinesRemove.cart;
}

export async function updateCartLines(
  cartId: string,
  lines: Array<{ id: string; quantity: number }>
): Promise<CartResponse["cart"]> {
  const data = await shopifyFetch<{
    cartLinesUpdate: CartResponse & { userErrors: Array<{ field: string; message: string }> };
  }>(CART_LINES_UPDATE_MUTATION, {
    cartId,
    lines,
  });

  if (data.cartLinesUpdate.userErrors.length > 0) {
    throw new Error(data.cartLinesUpdate.userErrors[0].message);
  }

  return data.cartLinesUpdate.cart;
}

export async function getCart(cartId: string): Promise<CartResponse["cart"] | null> {
  try {
    const data = await shopifyFetch<{ cart: CartResponse["cart"] | null }>(CART_QUERY, {
      cartId,
    });
    return data.cart;
  } catch {
    return null;
  }
}

export async function applyDiscountCode(
  cartId: string,
  discountCodes: string[]
): Promise<CartResponse["cart"]> {
  const data = await shopifyFetch<{
    cartDiscountCodesUpdate: CartResponse & { userErrors: Array<{ field: string; message: string }> };
  }>(CART_DISCOUNT_CODES_UPDATE_MUTATION, {
    cartId,
    discountCodes,
  });

  if (data.cartDiscountCodesUpdate.userErrors.length > 0) {
    throw new Error(data.cartDiscountCodesUpdate.userErrors[0].message);
  }

  return data.cartDiscountCodesUpdate.cart;
}
