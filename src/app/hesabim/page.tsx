"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCustomer } from "@/providers/ShopifyCustomerProvider";
import { Header, Footer } from "@/components/storefront";
import PageMeta from "@/components/storefront/PageMeta";
import { shopifyUpdateCustomer, shopifyCreateAddress, shopifyUpdateAddress, shopifyDeleteAddress } from "@/actions/customer-actions";
import type { ShopifyAddress } from "@/lib/shopify-types";

type Tab = "profil" | "adresler" | "siparisler";

export default function ProfilePage() {
  const { customer, accessToken, isLoading } = useCustomer();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>("profil");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!isLoading && !customer) router.replace("/");
  }, [customer, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <PageMeta title="Hesabım" description="Profil bilgilerinizi görüntüleyin ve düzenleyin." />
        <p className="text-text">Yükleniyor...</p>
      </div>
    );
  }

  if (!customer || !accessToken) return null;

  const tabs: { id: Tab; label: string }[] = [
    { id: "profil", label: "Profil Bilgileri" },
    { id: "adresler", label: "Adreslerim" },
    { id: "siparisler", label: "Siparişlerim" },
  ];

  return (
    <>
      <PageMeta title="Hesabım" description="Profil bilgilerinizi görüntüleyin ve düzenleyin." />
      <Header />
      <div className="min-h-screen bg-background-grey py-10 md:py-16">
        <div className="max-w-5xl mx-auto px-4">
          <h1 className="text-3xl font-bold text-heading mb-8">Hesabım</h1>

        <div className="md:hidden mb-6 relative">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="w-full flex items-center justify-between px-4 py-3 bg-white border border-border rounded-lg text-heading font-medium"
          >
            {tabs.find((t) => t.id === activeTab)?.label}
            <svg className={`w-4 h-4 transition-transform ${mobileMenuOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {mobileMenuOpen && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-border rounded-lg shadow-lg z-10 py-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => { setActiveTab(tab.id); setMobileMenuOpen(false); }}
                  className={`w-full text-left px-4 py-3 text-sm transition-colors ${
                    activeTab === tab.id ? "text-primary font-medium" : "text-heading"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex gap-8">
          <div className="hidden md:block w-64 shrink-0">
            <div className="bg-white rounded-lg border border-border overflow-hidden">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full text-left px-5 py-3.5 text-sm font-medium transition-colors border-l-2 ${
                    activeTab === tab.id
                      ? "border-primary text-primary bg-primary/5"
                      : "border-transparent text-heading hover:bg-background-grey"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 min-w-0">
            {activeTab === "profil" && <ProfileInfo customer={customer} accessToken={accessToken} />}
            {activeTab === "adresler" && <AddressList customer={customer} accessToken={accessToken} />}
            {activeTab === "siparisler" && <OrdersSection customer={customer} />}
          </div>
        </div>
      </div>
    </div>
      <Footer />
    </>
  );
}

function ProfileInfo({ customer, accessToken }: { customer: any; accessToken: string }) {
  const [firstName, setFirstName] = useState(customer.firstName || "");
  const [lastName, setLastName] = useState(customer.lastName || "");
  const [phone, setPhone] = useState(customer.phone || "");
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    setLoading(true);
    const result = await shopifyUpdateCustomer(accessToken, { firstName, lastName, phone });
    setLoading(false);
    if (result.error) {
      setMessage({ type: "error", text: result.error });
    } else {
      setMessage({ type: "success", text: "Profil bilgileriniz güncellendi." });
    }
  }

  return (
    <div className="bg-white rounded-lg border border-border p-6 md:p-8">
      <h2 className="text-xl font-bold text-heading mb-6">Profil Bilgileri</h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-heading mb-1.5">Ad</label>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
            className="w-full max-w-md px-4 py-2.5 text-sm border border-border rounded-lg focus:outline-none focus:border-primary transition-colors text-heading"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-heading mb-1.5">Soyad</label>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="w-full max-w-md px-4 py-2.5 text-sm border border-border rounded-lg focus:outline-none focus:border-primary transition-colors text-heading"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-heading mb-1.5">Telefon</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full max-w-md px-4 py-2.5 text-sm border border-border rounded-lg focus:outline-none focus:border-primary transition-colors text-heading"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-heading mb-1.5">E-posta</label>
          <input
            type="email"
            value={customer.email || ""}
            disabled
            className="w-full max-w-md px-4 py-2.5 text-sm border border-border rounded-lg bg-background-grey text-text cursor-not-allowed"
          />
          <p className="text-xs text-text mt-1">E-posta adresi değiştirilemez.</p>
        </div>
        {message && (
          <p className={`text-sm ${message.type === "success" ? "text-green-600" : "text-red-500"}`}>
            {message.text}
          </p>
        )}
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2.5 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50"
        >
          {loading ? "Kaydediliyor..." : "Kaydet"}
        </button>
      </form>
    </div>
  );
}

function AddressList({ customer, accessToken }: { customer: any; accessToken: string }) {
  const [addresses, setAddresses] = useState<ShopifyAddress[]>(customer.addresses?.edges?.map((e: any) => e.node) || []);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    address1: "", address2: "", city: "", province: "", zip: "", phone: "", firstName: "", lastName: "",
  });
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [saving, setSaving] = useState(false);

  function resetForm() {
    setFormData({ address1: "", address2: "", city: "", province: "", zip: "", phone: "", firstName: "", lastName: "" });
    setEditingId(null);
    setShowForm(false);
    setMessage(null);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    setSaving(true);

    const result = editingId
      ? await shopifyUpdateAddress(accessToken, editingId, formData)
      : await shopifyCreateAddress(accessToken, formData);

    setSaving(false);

    if (result.error) {
      setMessage({ type: "error", text: result.error });
    } else {
      setMessage({ type: "success", text: editingId ? "Adres güncellendi." : "Adres eklendi." });
      resetForm();
    }
  }

  function editAddress(addr: ShopifyAddress) {
    setFormData({
      address1: addr.address1 || "", address2: addr.address2 || "", city: addr.city || "",
      province: addr.province || "", zip: addr.zip || "", phone: addr.phone || "",
      firstName: addr.firstName || "", lastName: addr.lastName || "",
    });
    setEditingId(addr.id);
    setShowForm(true);
    setMessage(null);
  }

  async function handleDelete(id: string) {
    const result = await shopifyDeleteAddress(accessToken, id);
    if (result.error) {
      setMessage({ type: "error", text: result.error });
    } else {
      setMessage({ type: "success", text: "Adres silindi." });
      setAddresses((prev) => prev.filter((a) => a.id !== id));
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-heading">Adreslerim</h2>
        {!showForm && (
          <button
            onClick={() => { resetForm(); setShowForm(true); }}
            className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-dark transition-colors"
          >
            Yeni Adres Ekle
          </button>
        )}
      </div>

      {message && (
        <p className={`text-sm ${message.type === "success" ? "text-green-600" : "text-red-500"}`}>
          {message.text}
        </p>
      )}

      {showForm && (
        <div className="bg-white rounded-lg border border-border p-6">
          <h3 className="text-lg font-semibold text-heading mb-4">
            {editingId ? "Adresi Düzenle" : "Yeni Adres"}
          </h3>
          <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-heading mb-1">Ad</label>
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                required
                className="w-full px-4 py-2.5 text-sm border border-border rounded-lg focus:outline-none focus:border-primary transition-colors text-heading"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-heading mb-1">Soyad</label>
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                required
                className="w-full px-4 py-2.5 text-sm border border-border rounded-lg focus:outline-none focus:border-primary transition-colors text-heading"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-heading mb-1">Telefon</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-2.5 text-sm border border-border rounded-lg focus:outline-none focus:border-primary transition-colors text-heading"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-heading mb-1">Şehir</label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                required
                className="w-full px-4 py-2.5 text-sm border border-border rounded-lg focus:outline-none focus:border-primary transition-colors text-heading"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-heading mb-1">İlçe / Semt</label>
              <input
                type="text"
                value={formData.province}
                onChange={(e) => setFormData({ ...formData, province: e.target.value })}
                className="w-full px-4 py-2.5 text-sm border border-border rounded-lg focus:outline-none focus:border-primary transition-colors text-heading"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-heading mb-1">Posta Kodu</label>
              <input
                type="text"
                value={formData.zip}
                onChange={(e) => setFormData({ ...formData, zip: e.target.value })}
                className="w-full px-4 py-2.5 text-sm border border-border rounded-lg focus:outline-none focus:border-primary transition-colors text-heading"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-heading mb-1">Açık Adres</label>
              <textarea
                value={formData.address1}
                onChange={(e) => setFormData({ ...formData, address1: e.target.value })}
                required
                rows={3}
                className="w-full px-4 py-2.5 text-sm border border-border rounded-lg focus:outline-none focus:border-primary transition-colors text-heading resize-none"
              />
            </div>
            <div className="md:col-span-2 flex gap-3">
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2.5 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50"
              >
                {saving ? "Kaydediliyor..." : "Kaydet"}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-2.5 border border-border text-heading text-sm font-medium rounded-lg hover:bg-background-grey transition-colors"
              >
                İptal
              </button>
            </div>
          </form>
        </div>
      )}

      {addresses.length === 0 && !showForm && (
        <div className="bg-white rounded-lg border border-border p-8 text-center">
          <svg className="w-12 h-12 mx-auto text-text-lighter mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <p className="text-text">Henüz kayıtlı adresiniz yok.</p>
        </div>
      )}

      {addresses.map((addr) => (
        <div key={addr.id} className="bg-white rounded-lg border border-border p-5">
          <div className="flex items-start justify-between">
            <div className="mb-2">
              <span className="text-sm font-semibold text-heading">
                {addr.firstName} {addr.lastName}
              </span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => editAddress(addr)}
                className="text-xs text-primary hover:underline"
              >
                Düzenle
              </button>
              <button
                onClick={() => handleDelete(addr.id)}
                className="text-xs text-red-500 hover:underline"
              >
                Sil
              </button>
            </div>
          </div>
          <p className="text-sm text-text">{addr.phone}</p>
          <p className="text-sm text-text">
            {addr.address1}, {addr.city} {addr.province} {addr.zip}
          </p>
        </div>
      ))}
    </div>
  );
}

function OrdersSection({ customer }: { customer: any }) {
  const orders = customer.orders?.edges?.map((e: any) => e.node) || [];

  if (orders.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-border p-12 text-center">
        <svg className="w-16 h-16 mx-auto text-text-lighter mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        <h2 className="text-xl font-semibold text-heading mb-2">Henüz siparişiniz yok</h2>
        <p className="text-text mb-6">Alışverişe başlayarak ilk siparişinizi oluşturabilirsiniz.</p>
        <Link
          href="/"
          className="inline-block px-6 py-3 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-dark transition-colors"
        >
          Alışverişe Başla
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-heading mb-6">Siparişlerim</h2>
      {orders.map((order: any) => (
        <div key={order.id} className="bg-white rounded-lg border border-border p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm font-semibold text-heading">{order.name}</p>
              <p className="text-xs text-text">{new Date(order.processedAt).toLocaleDateString("tr-TR")}</p>
            </div>
            <span className="text-sm font-medium text-heading">
              {parseFloat(order.totalPrice.amount).toFixed(2)} {order.totalPrice.currencyCode}
            </span>
          </div>
          <div className="flex gap-2">
            <span className={`text-xs px-2 py-1 rounded-full ${
              order.fulfillmentStatus === "FULFILLED" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
            }`}>
              {order.fulfillmentStatus === "FULFILLED" ? "Teslim Edildi" : "Hazırlanıyor"}
            </span>
            <span className={`text-xs px-2 py-1 rounded-full ${
              order.financialStatus === "PAID" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
            }`}>
              {order.financialStatus === "PAID" ? "Ödendi" : "Bekliyor"}
            </span>
          </div>
          <div className="mt-3 space-y-1">
            {order.lineItems.edges.map((item: any, i: number) => (
              <p key={i} className="text-xs text-text">
                {item.node.title} x {item.node.quantity}
              </p>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
