"use client";

import { useState, useEffect } from "react";

const COOKIE_CONSENT_KEY = "cookie-consent";

type ConsentState = "accepted" | "declined" | null;

export function CookieConsent() {
  const [consent, setConsent] = useState<ConsentState>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem(COOKIE_CONSENT_KEY) as ConsentState;
    if (stored === "accepted" || stored === "declined") {
      setConsent(stored);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, "accepted");
    setConsent("accepted");
  };

  const handleDecline = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, "declined");
    setConsent("declined");
  };

  if (!mounted || consent) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-sm w-full bg-white border border-border-light-02 rounded-[10px] shadow-lg p-5 animate-in slide-in-from-bottom-2 fade-in duration-300">
      <p className="text-sm text-text leading-relaxed">
        Bu site, size daha iyi bir deneyim sunmak için çerezler kullanmaktadır.
      </p>
      <div className="flex items-center gap-3 mt-4">
        <button
          onClick={handleAccept}
          className="flex-1 px-4 py-[10px] text-sm font-medium text-white bg-primary rounded-[20px] hover:bg-primary-dark transition-colors"
        >
          Kabul Et
        </button>
        <button
          onClick={handleDecline}
          className="px-4 py-[10px] text-sm font-medium text-text-light border border-border-light-02 rounded-[20px] hover:border-border hover:text-heading transition-colors"
        >
          Reddet
        </button>
      </div>
    </div>
  );
}
