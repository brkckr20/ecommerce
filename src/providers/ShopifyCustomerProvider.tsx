"use client";

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import { shopifyLogin, shopifyRegister, shopifyLogout, getAuthCustomer } from "@/actions/customer-actions";
import type { ShopifyCustomer } from "@/lib/shopify-types";

interface CustomerContextValue {
  customer: ShopifyCustomer | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ error?: string }>;
  register: (email: string, password: string, firstName: string, lastName?: string, phone?: string) => Promise<{ error?: string }>;
  logout: () => Promise<void>;
  refreshCustomer: () => Promise<void>;
}

const CustomerContext = createContext<CustomerContextValue | null>(null);

export function ShopifyCustomerProvider({ children }: { children: ReactNode }) {
  const [customer, setCustomer] = useState<ShopifyCustomer | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getAuthCustomer().then((c) => {
      if (c) setCustomer(c);
      setIsLoading(false);
    });
  }, []);

  const refreshCustomer = useCallback(async () => {
    const c = await getAuthCustomer();
    if (c) setCustomer(c);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const result = await shopifyLogin(email, password);
    if (result.error) return { error: result.error };
    if (result.customer) setCustomer(result.customer);
    return {};
  }, []);

  const register = useCallback(async (email: string, password: string, firstName: string, lastName?: string, phone?: string) => {
    return await shopifyRegister(email, password, firstName, lastName, phone);
  }, []);

  const logout = useCallback(async () => {
    await shopifyLogout();
    setCustomer(null);
  }, []);

  return (
    <CustomerContext.Provider value={{ customer, isLoading, login, register, logout, refreshCustomer }}>
      {children}
    </CustomerContext.Provider>
  );
}

export function useCustomer() {
  const ctx = useContext(CustomerContext);
  if (!ctx) throw new Error("useCustomer must be used within ShopifyCustomerProvider");
  return ctx;
}
