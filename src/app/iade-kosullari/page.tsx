import type { Metadata } from "next";
import { Header, Footer } from "@/components/storefront";

export const metadata: Metadata = {
  title: "İade ve Değişim Koşulları",
  description: "Somni iade ve değişim politikası.",
  alternates: { canonical: "https://somni.com.tr/iade-kosullari" },
};

export default function IadePage() {
  return (
    <>
      <Header />
      <div className="bg-white">
        <div className="relative h-[200px] md:h-[300px] bg-[#F5F5F5] flex items-center justify-center">
          <div className="text-center px-4">
            <h1 className="text-3xl md:text-5xl font-bold text-heading mb-3">İade & Değişim</h1>
            <p className="text-text text-sm md:text-base max-w-xl mx-auto">
              Memnuniyetiniz bizim için önemli. İade ve değişim sürecimiz hakkında detaylı bilgi.
            </p>
          </div>
        </div>

        <div className="max-w-[1510px] mx-auto px-4 md:px-8 py-12 md:py-20">
          <div className="max-w-4xl mx-auto space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center p-8 bg-[#F9F9F9] rounded-lg">
                <div className="w-14 h-14 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-5">
                  <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-heading mb-2">15 Gün İade Hakkı</h3>
                <p className="text-sm text-text">Teslim tarihinden itibaren 15 gün içinde iade edebilirsiniz.</p>
              </div>

              <div className="text-center p-8 bg-[#F9F9F9] rounded-lg">
                <div className="w-14 h-14 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-5">
                  <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-heading mb-2">Koşulsuz İade</h3>
                <p className="text-sm text-text">Satın aldığınız ürünü beğenmemeniz durumunda hiçbir sebep belirtmeden iade edebilirsiniz.</p>
              </div>

              <div className="text-center p-8 bg-[#F9F9F9] rounded-lg">
                <div className="w-14 h-14 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-5">
                  <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-heading mb-2">Ücretsiz İade</h3>
                <p className="text-sm text-text">Kusurlu ürünlerde kargo ücreti tarafımıza aittir. Diğer durumlarda iade kargo ücreti müşteriye aittir.</p>
              </div>
            </div>

            <div className="border border-border rounded-lg p-8">
              <h2 className="text-xl font-semibold text-heading mb-6">İade Koşulları</h2>
              <ul className="space-y-4 text-text">
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-primary shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" />
                  </svg>
                  <span>Ürünler, teslim tarihinden itibaren <strong>15 gün</strong> içinde iade edilebilir.</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-primary shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" />
                  </svg>
                  <span>İade edilecek ürünlerin kullanılmamış, yıkanmamış ve etiketleri kesilmemiş olması gerekmektedir.</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-primary shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" />
                  </svg>
                  <span>İade talebiniz onaylandıktan sonra ürünü anlaşmalı kargo firması ile gönderebilirsiniz.</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-primary shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" />
                  </svg>
                  <span>İade tutarı, ürünün tarafımıza ulaşmasını takiben <strong>3-5 iş günü</strong> içinde ödeme yönteminize iade edilir.</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-primary shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" />
                  </svg>
                  <span>Kusurlu/hasarlı ürünlerde kargo ücreti tarafımıza aittir.</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-primary shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" />
                  </svg>
                  <span>Kampanyalı ürünlerde iade koşulları, kampanya sayfasında belirtilen şartlara tabidir.</span>
                </li>
              </ul>
            </div>

            <div className="border border-border rounded-lg p-8">
              <h2 className="text-xl font-semibold text-heading mb-6">İade Süreci</h2>
              <ol className="space-y-6">
                {[
                  { step: "1", title: "İade Talebi Oluşturun", desc: "Sipariş detay sayfasından veya müşteri hizmetlerimize ulaşarak iade talebinizi oluşturun." },
                  { step: "2", title: "Ürünü Paketleyin", desc: "Ürünü orijinal kutusu veya ambalajı ile birlikte, tüm aksesuarlarıyla paketleyin." },
                  { step: "3", title: "Kargoya Verin", desc: "Anlaşmalı kargo firmamız ile ürünü tarafımıza gönderin. İade kodu ile gönderirseniz takibi kolaylaşır." },
                  { step: "4", title: "İadeniz İnceleniyor", desc: "Ürün tarafımıza ulaştıktan sonra 1-3 iş günü içinde incelenir ve onaylanır." },
                  { step: "5", title: "İade Tutarınız İade Ediliyor", desc: "Onaylanan iadeler 3-5 iş günü içinde ödeme yönteminize iade edilir." },
                ].map((item) => (
                  <li key={item.step} className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold shrink-0">
                      {item.step}
                    </div>
                    <div>
                      <h3 className="font-medium text-heading">{item.title}</h3>
                      <p className="text-sm text-text mt-1">{item.desc}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            <div className="bg-[#F9F9F9] rounded-lg p-8 text-center">
              <h2 className="text-xl font-semibold text-heading mb-3">Siparişinizi Takip Edin</h2>
              <p className="text-text mb-6">
                Sipariş numaranız ve e-posta adresiniz ile siparişinizin durumunu sorgulayabilir, iptal veya iade talebi oluşturabilirsiniz.
              </p>
              <a
                href="/siparis-takip"
                className="inline-flex items-center gap-2 bg-heading text-white font-medium px-8 py-3 hover:bg-primary transition-colors duration-200 rounded-lg"
              >
                Siparişimi Sorgula
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
