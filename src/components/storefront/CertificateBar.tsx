"use client";

import { useState, useEffect } from "react";

interface Certificate {
  id: number;
  image: string;
  name: string;
}

const CERTIFICATES_QUERY = `#graphql
query GetCertificates {
  metaobjects(type: "certificate", first: 10) {
    nodes {
      fields {
        key
        value
        reference {
          ... on MediaImage {
            image { url }
          }
        }
      }
    }
  }
}`;

export function CertificateBar() {
  const [certs, setCerts] = useState<Certificate[]>([]);

  useEffect(() => {
    async function load() {
      try {
        const { shopifyFetch } = await import("@/lib/shopify");
        const data = await shopifyFetch<any>(CERTIFICATES_QUERY);
        const nodes = data?.metaobjects?.nodes ?? [];
        setCerts(
          nodes.map((node: any, i: number) => {
            const fields: Record<string, any> = {};
            for (const f of node.fields) fields[f.key] = f;
            return {
              id: i,
              image: (fields["image"]?.reference?.image?.url) ?? (fields["gorsel"]?.reference?.image?.url) ?? "",
              name: fields["name"]?.value ?? fields["isim"]?.value ?? "",
            };
          })
        );
      } catch {
        // silently fail
      }
    }
    load();
  }, []);

  if (certs.length === 0) return null;

  return (
    <section className="border-t border-b border-[#EEEEEE] py-10 md:py-14">
      <div className="max-w-[1510px] mx-auto px-4 md:px-8">
        <div className="flex items-center justify-around gap-6">
          {certs.map((cert) => (
            <div key={cert.id} className="flex flex-col items-center gap-3">
              <div className="h-20 w-20 md:h-24 md:w-24 shrink-0 overflow-hidden rounded-full border-2 border-[#EEEEEE] bg-white p-1">
                <img
                  src={cert.image}
                  alt={cert.name}
                  className="h-full w-full rounded-full object-cover"
                />
              </div>
              {cert.name && (
                <span className="text-sm font-medium text-[#666666] text-center">
                  {cert.name}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
