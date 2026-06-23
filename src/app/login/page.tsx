"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCustomer } from "@/providers/ShopifyCustomerProvider";
import PageMeta from "@/components/storefront/PageMeta";

export default function LoginPage() {
  return (
    <>
      <PageMeta title="Giriş Yap" description="Hesabınıza giriş yaparak siparişlerinizi takip edin." />
      <LoginContent />
    </>
  );
}

function LoginContent() {
  const router = useRouter();
  const { customer, isLoading } = useCustomer();

  useEffect(() => {
    if (!isLoading && customer) {
      router.replace("/hesabim");
    }
  }, [customer, isLoading, router]);

  return null;
}
