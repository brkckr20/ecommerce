"use client";

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import { shopifyLogin, shopifyRegister, shopifyLogout, shopifyGetCustomer } from "@/actions/customer-actions";
import type { ShopifyCustomer } from "@/lib/shopify-types";

interface CustomerContextValue {
  customer: ShopifyCustomer | null;
  accessToken: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ error?: string }>;
  register: (email: string, password: string, firstName: string, lastName?: string, phone?: string) => Promise<{ error?: string }>;
  logout: () => Promise<void>;
  refreshCustomer: () => Promise<void>;
}

const CustomerContext = createContext<CustomerContextValue | null>(null);

export function ShopifyCustomerProvider({ children }: { children: ReactNode }) {
  const [customer, setCustomer] = useState<ShopifyCustomer | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("shopify_customer_token");
    if (token) {
      setAccessToken(token);
      shopifyGetCustomer(token).then((c) => {
        if (c) {
          setCustomer(c);
          localStorage.setItem("shopify_customer_token", token);
        } else {
          localStorage.removeItem("shopify_customer_token");
          setAccessToken(null);
        }
        setIsLoading(false);
      });
    } else {
      setIsLoading(false);
    }
  }, []);

  const refreshCustomer = useCallback(async () => {
    if (!accessToken) return;
    const c = await shopifyGetCustomer(accessToken);
    if (c) setCustomer(c);
  }, [accessToken]);

  const login = useCallback(async (email: string, password: string) => {
    const result = await shopifyLogin(email, password);
    if (result.error) return { error: result.error };
    if (result.accessToken) {
      setAccessToken(result.accessToken);
      setCustomer(result.customer);
      localStorage.setItem("shopify_customer_token", result.accessToken);
    }
    return {};
  }, []);

  const register = useCallback(async (email: string, password: string, firstName: string, lastName?: string, phone?: string) => {
    return await shopifyRegister(email, password, firstName, lastName, phone);
  }, []);

  const logout = useCallback(async () => {
    if (accessToken) {
      await shopifyLogout(accessToken).catch(() => {});
    }
    setCustomer(null);
    setAccessToken(null);
    localStorage.removeItem("shopify_customer_token");
  }, [accessToken]);

  return (
    <CustomerContext.Provider value={{ customer, accessToken, isLoading, login, register, logout, refreshCustomer }}>
      {children}
    </CustomerContext.Provider>
  );
}

export function useCustomer() {
  const ctx = useContext(CustomerContext);
  if (!ctx) throw new Error("useCustomer must be used within ShopifyCustomerProvider");
  return ctx;
}
