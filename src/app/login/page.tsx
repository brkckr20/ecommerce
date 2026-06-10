"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCustomer } from "@/providers/ShopifyCustomerProvider";

export default function LoginPage() {
  const router = useRouter();
  const { customer, isLoading } = useCustomer();

  useEffect(() => {
    if (!isLoading && customer) {
      router.replace("/hesabim");
    }
  }, [customer, isLoading, router]);

  return null;
}
