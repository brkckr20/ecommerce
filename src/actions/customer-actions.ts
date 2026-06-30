"use server";

import { cookies } from "next/headers";
import { shopifyFetch } from "@/lib/shopify";
import {
  CUSTOMER_ACCESS_TOKEN_CREATE_MUTATION,
  CUSTOMER_CREATE_MUTATION,
  CUSTOMER_ACCESS_TOKEN_DELETE_MUTATION,
  CUSTOMER_QUERY,
  CUSTOMER_UPDATE_MUTATION,
  CUSTOMER_ADDRESS_CREATE_MUTATION,
  CUSTOMER_ADDRESS_UPDATE_MUTATION,
  CUSTOMER_ADDRESS_DELETE_MUTATION,
} from "@/lib/shopify-queries";
import type {
  CustomerAccessTokenCreateResponse,
  CustomerCreateResponse,
  CustomerQueryResponse,
  ShopifyCustomer,
} from "@/lib/shopify-types";

const COOKIE_NAME = "shopify_customer_token";

function getTokenFromCookies(): string | undefined {
  return cookies().get(COOKIE_NAME)?.value;
}

function setTokenCookie(token: string) {
  cookies().set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60 * 24 * 30,
    path: "/",
  });
}

function deleteTokenCookie() {
  cookies().delete(COOKIE_NAME);
}

export async function shopifyLogin(email: string, password: string) {
  const data = await shopifyFetch<CustomerAccessTokenCreateResponse>(
    CUSTOMER_ACCESS_TOKEN_CREATE_MUTATION,
    { input: { email, password } }
  );

  const errors = data.customerAccessTokenCreate.customerUserErrors;
  if (errors.length > 0) {
    return { error: errors[0].message };
  }

  const token = data.customerAccessTokenCreate.customerAccessToken;
  if (!token) return { error: "Giriş başarısız." };

  setTokenCookie(token.accessToken);

  const customerData = await shopifyFetch<CustomerQueryResponse>(CUSTOMER_QUERY, {
    customerAccessToken: token.accessToken,
  });

  return { customer: customerData.customer };
}

export async function shopifyRegister(
  email: string,
  password: string,
  firstName: string,
  lastName?: string,
  phone?: string
) {
  const input: Record<string, unknown> = { email, password, firstName, lastName };
  if (phone) {
    const cleaned = phone.replace(/[^+\d]/g, "");
    input.phone = cleaned.startsWith("05")
      ? "+90" + cleaned.slice(1)
      : cleaned.startsWith("5")
        ? "+90" + cleaned
        : cleaned;
  }
  const data = await shopifyFetch<CustomerCreateResponse>(
    CUSTOMER_CREATE_MUTATION,
    { input }
  );

  const errors = data.customerCreate.customerUserErrors;
  if (errors.length > 0) {
    return { error: errors[0].message };
  }

  return { success: true };
}

export async function shopifyLogout() {
  const token = getTokenFromCookies();
  if (token) {
    await shopifyFetch(CUSTOMER_ACCESS_TOKEN_DELETE_MUTATION, {
      customerAccessToken: token,
    }).catch(() => {});
  }
  deleteTokenCookie();
}

export async function getAuthCustomer() {
  const token = getTokenFromCookies();
  if (!token) return null;
  try {
    const data = await shopifyFetch<CustomerQueryResponse>(CUSTOMER_QUERY, {
      customerAccessToken: token,
    });
    return data.customer;
  } catch {
    deleteTokenCookie();
    return null;
  }
}

export async function shopifyUpdateCustomer(
  customer: { firstName?: string; lastName?: string; phone?: string }
) {
  const token = getTokenFromCookies();
  if (!token) return { error: "Oturum bulunamadı." };

  const data = await shopifyFetch<any>(CUSTOMER_UPDATE_MUTATION, {
    customerAccessToken: token,
    customer,
  });

  const errors = data.customerUpdate?.customerUserErrors;
  if (errors?.length > 0) {
    return { error: errors[0].message };
  }

  return { success: true };
}

export async function shopifyCreateAddress(
  address: {
    address1: string;
    address2?: string;
    city: string;
    province?: string;
    zip?: string;
    country?: string;
    phone?: string;
    firstName?: string;
    lastName?: string;
  }
) {
  const token = getTokenFromCookies();
  if (!token) return { error: "Oturum bulunamadı." };

  const data = await shopifyFetch<any>(CUSTOMER_ADDRESS_CREATE_MUTATION, {
    customerAccessToken: token,
    address,
  });

  const errors = data.customerAddressCreate?.customerUserErrors;
  if (errors?.length > 0) {
    return { error: errors[0].message };
  }

  return { success: true };
}

export async function shopifyUpdateAddress(
  addressId: string,
  address: {
    address1?: string;
    address2?: string;
    city?: string;
    province?: string;
    zip?: string;
    country?: string;
    phone?: string;
    firstName?: string;
    lastName?: string;
  }
) {
  const token = getTokenFromCookies();
  if (!token) return { error: "Oturum bulunamadı." };

  const data = await shopifyFetch<any>(CUSTOMER_ADDRESS_UPDATE_MUTATION, {
    customerAccessToken: token,
    addressId,
    address,
  });

  const errors = data.customerAddressUpdate?.customerUserErrors;
  if (errors?.length > 0) {
    return { error: errors[0].message };
  }

  return { success: true };
}

export async function shopifyDeleteAddress(addressId: string) {
  const token = getTokenFromCookies();
  if (!token) return { error: "Oturum bulunamadı." };

  const data = await shopifyFetch<any>(CUSTOMER_ADDRESS_DELETE_MUTATION, {
    customerAccessToken: token,
    id: addressId,
  });

  const errors = data.customerAddressDelete?.userErrors;
  if (errors?.length > 0) {
    return { error: errors[0].message };
  }

  return { success: true };
}
