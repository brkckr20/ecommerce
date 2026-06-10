"use client";

import { useState, useEffect } from "react";
import { useCustomer } from "@/providers/ShopifyCustomerProvider";

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
}

export function AuthModal({ open, onClose }: AuthModalProps) {
  const { login, register } = useCustomer();
  const [mounted, setMounted] = useState(false);
  const [animIn, setAnimIn] = useState(false);
  const [mode, setMode] = useState<"login" | "register">("login");
  const [transitioning, setTransitioning] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      setMounted(true);
      setMode("login");
      setError("");
      requestAnimationFrame(() => setAnimIn(true));
    } else {
      setAnimIn(false);
      const timer = setTimeout(() => setMounted(false), 250);
      return () => clearTimeout(timer);
    }
  }, [open]);

  useEffect(() => {
    if (!mounted) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [mounted, onClose]);

  useEffect(() => {
    if (mounted && open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mounted, open]);

  function switchMode(newMode: "login" | "register") {
    if (newMode === mode || transitioning) return;
    setTransitioning(true);
    setTimeout(() => {
      setMode(newMode);
      setError("");
      setTimeout(() => setTransitioning(false), 50);
    }, 200);
  }

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const form = new FormData(e.currentTarget);
    const res = await login(form.get("email") as string, form.get("password") as string);

    setLoading(false);

    if (res?.error) {
      setError(res.error);
    } else {
      onClose();
    }
  }

  async function handleRegister(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const form = new FormData(e.currentTarget);
    const firstName = form.get("firstName") as string;
    const lastName = form.get("lastName") as string;
    const email = form.get("email") as string;
    const password = form.get("password") as string;
    const confirm = form.get("confirm") as string;
    const phone = form.get("phone") as string;

    if (password !== confirm) {
      setError("Şifreler eşleşmiyor.");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Şifre en az 6 karakter olmalıdır.");
      setLoading(false);
      return;
    }

    const result = await register(email, password, firstName, lastName, phone || undefined);

    setLoading(false);

    if (result.error) {
      setError(result.error);
    } else {
      switchMode("login");
    }
  }

  if (!mounted) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center transition-all duration-250 ${
        animIn ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />
      <div
        className={`relative w-full max-w-md mx-4 bg-white rounded-lg shadow-2xl transition-all duration-250 ${
          animIn ? "scale-100 translate-y-0" : "scale-95 translate-y-4"
        }`}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 text-text hover:text-heading transition-colors z-10"
          aria-label="Close"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="p-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-heading">
              {mode === "login" ? "Giriş Yap" : "Kaydol"}
            </h2>
            <p className="text-text text-sm mt-1">
              {mode === "login"
                ? "Hesabına giriş yap"
                : "Yeni hesap oluştur"}
            </p>
          </div>

          <div className="relative overflow-hidden">
            <div
              className={`transition-all duration-200 ${
                transitioning
                  ? "opacity-0 -translate-y-2"
                  : "opacity-100 translate-y-0"
              }`}
            >
              {mode === "login" ? (
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-heading mb-1.5">
                      E-posta
                    </label>
                    <input
                      name="email"
                      type="email"
                      required
                      className="w-full px-4 py-2.5 text-sm border border-border rounded-lg focus:outline-none focus:border-primary transition-colors text-heading placeholder:text-text-lighter"
                      placeholder="ornek@email.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-heading mb-1.5">
                      Şifre
                    </label>
                    <input
                      name="password"
                      type="password"
                      required
                      className="w-full px-4 py-2.5 text-sm border border-border rounded-lg focus:outline-none focus:border-primary transition-colors text-heading placeholder:text-text-lighter"
                      placeholder="••••••"
                    />
                  </div>

                  {error && (
                    <p className="text-sm text-red-500">{error}</p>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50"
                  >
                    {loading ? "Giriş yapılıyor..." : "Giriş Yap"}
                  </button>

                  <p className="text-center text-sm text-text">
                    Hesabın yok mu?{" "}
                    <button
                      type="button"
                      onClick={() => switchMode("register")}
                      className="text-primary font-medium hover:underline"
                    >
                      Kaydol
                    </button>
                  </p>
                </form>
              ) : (
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-heading mb-1.5">
                        Ad
                      </label>
                      <input
                        name="firstName"
                        type="text"
                        required
                        className="w-full px-4 py-2.5 text-sm border border-border rounded-lg focus:outline-none focus:border-primary transition-colors text-heading placeholder:text-text-lighter"
                        placeholder="Adın"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-heading mb-1.5">
                        Soyad
                      </label>
                      <input
                        name="lastName"
                        type="text"
                        required
                        className="w-full px-4 py-2.5 text-sm border border-border rounded-lg focus:outline-none focus:border-primary transition-colors text-heading placeholder:text-text-lighter"
                        placeholder="Soyadın"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-heading mb-1.5">
                      E-posta
                    </label>
                    <input
                      name="email"
                      type="email"
                      required
                      className="w-full px-4 py-2.5 text-sm border border-border rounded-lg focus:outline-none focus:border-primary transition-colors text-heading placeholder:text-text-lighter"
                      placeholder="ornek@email.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-heading mb-1.5">
                      Cep Telefonu
                    </label>
                    <input
                      name="phone"
                      type="tel"
                      className="w-full px-4 py-2.5 text-sm border border-border rounded-lg focus:outline-none focus:border-primary transition-colors text-heading placeholder:text-text-lighter"
                      placeholder="05XX XXX XX XX"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-heading mb-1.5">
                      Şifre
                    </label>
                    <input
                      name="password"
                      type="password"
                      required
                      minLength={6}
                      className="w-full px-4 py-2.5 text-sm border border-border rounded-lg focus:outline-none focus:border-primary transition-colors text-heading placeholder:text-text-lighter"
                      placeholder="En az 6 karakter"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-heading mb-1.5">
                      Şifre Tekrar
                    </label>
                    <input
                      name="confirm"
                      type="password"
                      required
                      minLength={6}
                      className="w-full px-4 py-2.5 text-sm border border-border rounded-lg focus:outline-none focus:border-primary transition-colors text-heading placeholder:text-text-lighter"
                      placeholder="Şifreni tekrar gir"
                    />
                  </div>

                  {error && (
                    <p className="text-sm text-red-500">{error}</p>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50"
                  >
                    {loading ? "Kaydediliyor..." : "Kaydol"}
                  </button>

                  <p className="text-center text-sm text-text">
                    Zaten hesabın var mı?{" "}
                    <button
                      type="button"
                      onClick={() => switchMode("login")}
                      className="text-primary font-medium hover:underline"
                    >
                      Giriş Yap
                    </button>
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
