"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const COOKIE_CONSENT_KEY = "cookie-consent";

type ConsentState = "all" | "necessary" | "declined" | null;

export function CookieConsent() {
  const [consent, setConsent] = useState<ConsentState>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem(COOKIE_CONSENT_KEY) as ConsentState;
    if (stored === "all" || stored === "necessary" || stored === "declined") {
      setConsent(stored);
    }
  }, []);

  const handleAll = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, "all");
    setConsent("all");
  };

  const handleNecessary = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, "necessary");
    setConsent("necessary");
  };

  const handleDecline = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, "declined");
    setConsent("declined");
  };

  if (!mounted || consent) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-sm w-full bg-white border border-border-light-02 rounded-[10px] shadow-lg p-5 animate-in slide-in-from-bottom-2 fade-in duration-300">
      <p className="text-sm text-text leading-relaxed">
        Size daha iyi bir deneyim sunmak için çerezler kullanıyoruz. Detaylı bilgi için{" "}
        <Link href="/cerez-politikasi" className="text-primary underline hover:no-underline">
          Çerez Politikamızı
        </Link>{" "}
        inceleyebilirsiniz.
      </p>
      <div className="flex flex-col gap-2 mt-4">
        <div className="flex items-center gap-3">
          <button
            onClick={handleAll}
            className="flex-1 px-4 py-[10px] text-sm font-medium text-white bg-primary rounded-[20px] hover:bg-primary-dark transition-colors"
          >
            Tüm Çerezleri Kabul Et
          </button>
          <button
            onClick={handleDecline}
            className="px-4 py-[10px] text-sm font-medium text-text-light border border-border-light-02 rounded-[20px] hover:border-border hover:text-heading transition-colors"
          >
            Reddet
          </button>
        </div>
        <button
          onClick={handleNecessary}
          className="text-xs text-text-light hover:text-heading transition-colors self-center"
        >
          Yalnızca Gerekli Çerezler
        </button>
      </div>
    </div>
  );
}
