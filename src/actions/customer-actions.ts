"use server";

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

  const customerData = await shopifyFetch<CustomerQueryResponse>(CUSTOMER_QUERY, {
    customerAccessToken: token.accessToken,
  });

  return {
    accessToken: token.accessToken,
    expiresAt: token.expiresAt,
    customer: customerData.customer,
  };
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

export async function shopifyLogout(accessToken: string) {
  await shopifyFetch(CUSTOMER_ACCESS_TOKEN_DELETE_MUTATION, {
    customerAccessToken: accessToken,
  });
}

export async function shopifyGetCustomer(accessToken: string) {
  try {
    const data = await shopifyFetch<CustomerQueryResponse>(CUSTOMER_QUERY, {
      customerAccessToken: accessToken,
    });
    return data.customer;
  } catch {
    return null;
  }
}

export async function shopifyUpdateCustomer(
  accessToken: string,
  customer: { firstName?: string; lastName?: string; phone?: string }
) {
  const data = await shopifyFetch<any>(CUSTOMER_UPDATE_MUTATION, {
    customerAccessToken: accessToken,
    customer,
  });

  const errors = data.customerUpdate?.customerUserErrors;
  if (errors?.length > 0) {
    return { error: errors[0].message };
  }

  return { success: true };
}

export async function shopifyCreateAddress(
  accessToken: string,
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
  const data = await shopifyFetch<any>(CUSTOMER_ADDRESS_CREATE_MUTATION, {
    customerAccessToken: accessToken,
    address,
  });

  const errors = data.customerAddressCreate?.customerUserErrors;
  if (errors?.length > 0) {
    return { error: errors[0].message };
  }

  return { success: true };
}

export async function shopifyUpdateAddress(
  accessToken: string,
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
  const data = await shopifyFetch<any>(CUSTOMER_ADDRESS_UPDATE_MUTATION, {
    customerAccessToken: accessToken,
    addressId,
    address,
  });

  const errors = data.customerAddressUpdate?.customerUserErrors;
  if (errors?.length > 0) {
    return { error: errors[0].message };
  }

  return { success: true };
}

export async function shopifyDeleteAddress(accessToken: string, addressId: string) {
  const data = await shopifyFetch<any>(CUSTOMER_ADDRESS_DELETE_MUTATION, {
    customerAccessToken: accessToken,
    id: addressId,
  });

  const errors = data.customerAddressDelete?.userErrors;
  if (errors?.length > 0) {
    return { error: errors[0].message };
  }

  return { success: true };
}
