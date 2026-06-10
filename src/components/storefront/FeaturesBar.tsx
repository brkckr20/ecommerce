"use client";

import { useState, useEffect } from "react";
import { getSiteSettingsAction } from "@/actions/settings-actions";

export function FeaturesBar() {
  const [freeShippingLimit, setFreeShippingLimit] = useState(499);

  useEffect(() => {
    getSiteSettingsAction().then((s) => {
      if (s) setFreeShippingLimit(s.freeShippingLimit);
    });
  }, []);

  const features = [
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" width="28" height="29" fill="currentColor">
          <path d="M280 192c4.4 0 8-3.6 8-8v-16c0-4.4-3.6-8-8-8H40c-4.4 0-8 3.6-8 8v16c0 4.4 3.6 8 8 8h240zm352 192h-24V275.9c0-16.8-6.8-33.3-18.8-45.2l-83.9-83.9c-11.8-12-28.3-18.8-45.2-18.8H416V78.6c0-25.7-22.2-46.6-49.4-46.6H113.4C86.2 32 64 52.9 64 78.6V96H8c-4.4 0-8 3.6-8 8v16c0 4.4 3.6 8 8 8h240c4.4 0 8-3.6 8-8v-16c0-4.4-3.6-8-8-8H96V78.6c0-8.1 7.8-14.6 17.4-14.6h253.2c9.6 0 17.4 6.5 17.4 14.6V384H207.6C193 364.7 170 352 144 352c-18.1 0-34.6 6.2-48 16.4V288H64v144c0 44.2 35.8 80 80 80s80-35.8 80-80c0-5.5-.6-10.8-1.6-16h195.2c-1.1 5.2-1.6 10.5-1.6 16 0 44.2 35.8 80 80 80s80-35.8 80-80c0-5.5-.6-10.8-1.6-16H632c4.4 0 8-3.6 8-8v-16c0-4.4-3.6-8-8-8zm-488 96c-26.5 0-48-21.5-48-48s21.5-48 48-48 48 21.5 48 48-21.5 48-48 48zm272-320h44.1c8.4 0 16.7 3.4 22.6 9.4l83.9 83.9c.8.8 1.1 1.9 1.8 2.8H416V160zm80 320c-26.5 0-48-21.5-48-48s21.5-48 48-48 48 21.5 48 48-21.5 48-48 48zm80-96h-16.4C545 364.7 522 352 496 352s-49 12.7-63.6 32H416v-96h160v96zM256 248v-16c0-4.4-3.6-8-8-8H8c-4.4 0-8 3.6-8 8v16c0 4.4 3.6 8 8 8h240c4.4 0 8-3.6 8-8z" />
        </svg>
      ),
      title: "Ücretsiz Kargo",
      description: `${freeShippingLimit.toLocaleString("tr-TR")} TL ve üzeri alışverişlerde ücretsiz kargo`,
    },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="30" height="30" fill="currentColor">
        <path d="M256 0C114.6 0 0 114.6 0 256s114.6 256 256 256 256-114.6 256-256S397.4 0 256 0zm0 464c-114.7 0-208-93.31-208-208S141.3 48 256 48s208 93.31 208 208-93.3 208-208 208zm-32-128h-48c-8.8 0-16 7.2-16 16s7.2 16 16 16h80c8.8 0 16-7.2 16-16v-32c0-8.8-7.2-16-16-16h-32v-64c0-8.8-7.2-16-16-16h-32c-8.8 0-16 7.2-16 16s7.2 16 16 16h16v48zm0-128c13.25 0 24-10.75 24-24s-10.75-24-24-24-24 10.75-24 24 10.75 24 24 24z" />
      </svg>
    ),
    title: "Para İade Garantisi",
    description: "30 gün içinde koşulsuz iade.",
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="29" height="27" fill="currentColor">
        <path d="M256 48C141.1 48 48 141.1 48 256v40c0 13.3-10.7 24-24 24s-24-10.7-24-24v-40C0 114.6 114.6 0 256 0s256 114.6 256 256v40c0 13.3-10.7 24-24 24s-24-10.7-24-24v-40c0-114.9-93.1-208-208-208zm112 224c0 44.2-35.8 80-80 80h-64c-44.2 0-80-35.8-80-80s35.8-80 80-80c13.3 0 24 10.7 24 24s-10.7 24-24 24c-17.7 0-32 14.3-32 32s14.3 32 32 32h64c17.7 0 32-14.3 32-32s-14.3-32-32-32c-13.3 0-24-10.7-24-24s10.7-24 24-24c44.2 0 80 35.8 80 80zm-208 80h-32c0 17.7 14.3 32 32 32s32-14.3 32-32h-32zm160 0h-32c0 17.7 14.3 32 32 32s32-14.3 32-32h-32z" />
      </svg>
    ),
    title: "Canlı Destek",
    description: "7 gün 24 saat online destek",
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" width="29" height="23" fill="currentColor">
        <path d="M512 32H64C28.65 32 0 60.65 0 96v320c0 35.35 28.65 64 64 64h448c35.35 0 64-28.65 64-64V96c0-35.35-28.65-64-64-64zm16 384c0 8.822-7.178 16-16 16H64c-8.822 0-16-7.178-16-16V96c0-8.822 7.178-16 16-16h448c8.822 0 16 7.178 16 16v320zM128 288h320c17.67 0 32-14.33 32-32v-96c0-17.67-14.33-32-32-32H128c-17.67 0-32 14.33-32 32v96c0 17.67 14.33 32 32 32zm16-112h288v64H144v-64z" />
      </svg>
    ),
    title: "Esnek Ödeme",
    description: "Kredi kartı ile taksit imkanı",
  },
];

  return (
    <section className="border-t border-border">
      <div className="max-w-[1510px] mx-auto px-4 md:px-6 lg:px-8 py-[39px] md:py-[41px]">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-y-8 gap-x-4 md:gap-x-6 lg:gap-x-8">
          {features.map((feature) => (
            <div key={feature.title} className="flex items-start gap-4">
              <div className="shrink-0 mt-[5px] text-heading">
                {feature.icon}
              </div>
              <div>
                <h3 className="text-lg md:text-xl font-medium leading-[1.3em] text-heading">
                  {feature.title}
                </h3>
                <p className="mt-[5px] text-sm md:text-base leading-[26px] text-text-lighter">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
