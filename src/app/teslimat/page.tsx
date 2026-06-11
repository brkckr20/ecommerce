import type { Metadata } from "next";
import { Header, Footer } from "@/components/storefront";

export const metadata: Metadata = {
  title: "Teslimat Bilgileri",
  description: "Minimog teslimat ve kargo bilgileri.",
};

export default function DeliveryPage() {
  return (
    <>
      <Header />
      <div className="bg-white">
        <div className="relative h-[200px] md:h-[300px] bg-[#F5F5F5] flex items-center justify-center">
          <div className="text-center px-4">
            <h1 className="text-3xl md:text-5xl font-bold text-heading mb-3">Teslimat Bilgileri</h1>
            <p className="text-text text-sm md:text-base max-w-xl mx-auto">
              Siparişleriniz özenle hazırlanır ve hızlıca kargolanır.
            </p>
          </div>
        </div>

        <div className="max-w-[1510px] mx-auto px-4 md:px-8 py-12 md:py-20">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              <div className="text-center p-8 bg-[#F9F9F9] rounded-lg">
                <div className="w-14 h-14 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-5">
                  <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-heading mb-2">Ücretsiz Kargo</h3>
                <p className="text-sm text-text">
                  499 TL ve üzeri alışverişlerde kargo ücretsiz.
                </p>
              </div>
              <div className="text-center p-8 bg-[#F9F9F9] rounded-lg">
                <div className="w-14 h-14 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-5">
                  <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-heading mb-2">Hızlı Teslimat</h3>
                <p className="text-sm text-text">
                  Siparişler 24 saat içinde kargoya verilir.
                </p>
              </div>
              <div className="text-center p-8 bg-[#F9F9F9] rounded-lg">
                <div className="w-14 h-14 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-5">
                  <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-heading mb-2">Kolay İade</h3>
                <p className="text-sm text-text">
                  14 gün içinde koşulsuz iade imkanı.
                </p>
              </div>
            </div>

            <div className="prose prose-sm max-w-none">
              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-bold text-heading mb-4">Kargo Süreci</h2>
                  <p className="text-text leading-relaxed">
                    Siparişleriniz, ödeme onayı alındıktan sonra en geç 24 saat içinde 
                    kargoya teslim edilir. Kargo takip numaranız, siparişiniz kargolandığında 
                    e-posta adresinize iletilir.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-heading mb-4">Teslimat Süreleri</h2>
                  <ul className="list-disc pl-5 space-y-2 text-text">
                    <li>İstanbul içi: 1-2 iş günü</li>
                    <li>Büyükşehirler: 2-3 iş günü</li>
                    <li>Diğer iller: 3-5 iş günü</li>
                  </ul>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-heading mb-4">Kargo Ücreti</h2>
                  <p className="text-text leading-relaxed mb-3">
                    499 TL ve üzeri tüm siparişlerde kargo ücretsizdir. 499 TL altındaki 
                    siparişlerde kargo ücreti 49,99 TL&apos;dir.
                  </p>
                  <p className="text-text leading-relaxed">
                    Kampanyalı ürünlerde ve özel indirim dönemlerinde kargo ücreti 
                    değişiklik gösterebilir.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-heading mb-4">İade ve Değişim</h2>
                  <p className="text-text leading-relaxed mb-3">
                    Teslimat tarihinden itibaren 14 gün içinde, kullanılmamış ve orijinal 
                    ambalajında olan ürünlerinizi iade edebilirsiniz. İade sürecinde 
                    size en yakın anlaşmalı kargo şubesine ürünü göndermeniz yeterlidir.
                  </p>
                  <p className="text-text leading-relaxed">
                    İade edilen ürünler, tarafımıza ulaştıktan sonra 3-5 iş günü içinde 
                    incelenir ve onaylanan iadeler için ödeme iadesi yapılır.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-heading mb-4">Sipariş Takibi</h2>
                  <p className="text-text leading-relaxed">
                    Siparişinizin durumunu Hesabım &gt; Siparişlerim sayfasından 
                    takip edebilirsiniz. Kargo takip numarası ile kargo firmasının 
                    web sitesinden de gönderinizin durumunu kontrol edebilirsiniz.
                  </p>
                </div>

                <div className="bg-[#F9F9F9] rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-heading mb-3">
                    Teslimatla İlgili Sorularınız mı Var?
                  </h3>
                  <p className="text-text text-sm leading-relaxed">
                    Müşteri hizmetlerimize +90 (212) 123 45 67 numaralı telefondan veya 
                    hello@domain.com e-posta adresinden ulaşabilirsiniz.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
