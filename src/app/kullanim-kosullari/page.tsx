import type { Metadata } from "next";
import { Header, Footer } from "@/components/storefront";

export const metadata: Metadata = {
  title: "Kullanım Koşulları",
  description: "Minimog kullanım koşulları.",
  alternates: { canonical: "https://somni.com.tr/kullanim-kosullari" },
};

export default function TermsPage() {
  return (
    <>
      <Header />
      <div className="bg-white">
        <div className="relative h-[200px] md:h-[300px] bg-[#F5F5F5] flex items-center justify-center">
          <div className="text-center px-4">
            <h1 className="text-3xl md:text-5xl font-bold text-heading mb-3">Kullanım Koşulları</h1>
            <p className="text-text text-sm md:text-base max-w-xl mx-auto">
              Sitemizi kullanmadan önce lütfen koşulları okuyun.
            </p>
          </div>
        </div>

        <div className="max-w-[1510px] mx-auto px-4 md:px-8 py-12 md:py-20">
          <div className="max-w-4xl mx-auto">
            <p className="text-sm text-text mb-6">
              Son güncelleme: Ocak 2026
            </p>
            <div className="space-y-8 text-text leading-relaxed">
              <div>
                <h2 className="text-2xl font-bold text-heading mb-4">1. Genel Şartlar</h2>
                <p>
                  İşbu kullanım koşulları, Minimog web sitesini ziyaret eden ve 
                  alışveriş yapan tüm kullanıcılar için geçerlidir. Siteyi kullanarak 
                  bu koşulları kabul etmiş sayılırsınız.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-heading mb-4">2. Hesap Güvenliği</h2>
                <p>
                  Hesabınızın şifresi ve güvenliği tamamen sizin sorumluluğunuzdadır. 
                  Hesabınızın yetkisiz kullanımı durumunda bizi derhal bilgilendirmeniz 
                  gerekmektedir.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-heading mb-4">3. Ürün ve Fiyatlandırma</h2>
                <p className="mb-3">
                  Tüm ürün fiyatları Türk Lirası olarak belirtilmiştir ve KDV dahildir. 
                  Fiyatlar önceden haber verilmeksizin değiştirilebilir. Ürün görselleri 
                  ve açıklamaları mümkün olduğunca doğru olmakla birlikte, ekran 
                  kalitenize bağlı olarak gerçek üründen farklılık gösterebilir.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-heading mb-4">4. Sipariş ve Ödeme</h2>
                <p className="mb-3">
                  Siparişinizin onaylanması, ödemenizin başarıyla tamamlanmasına 
                  bağlıdır. Siparişinizi vermeden önce tüm bilgilerin doğruluğunu 
                  kontrol etmeniz gerekmektedir.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-heading mb-4">5. Teslimat</h2>
                <p>
                  Teslimat adresinde bulunmamanız durumunda kargo firması tarafından 
                  teslimat gerçekleştirilemeyen siparişler size geri gönderilecektir. 
                  Bu durumda oluşan ek kargo ücreti tarafınıza yansıtılabilir.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-heading mb-4">6. İade ve Değişim</h2>
                <p>
                  Cayma hakkınızı, teslimat tarihinden itibaren 14 gün içinde 
                  kullanabilirsiniz. İade edilecek ürünlerin kullanılmamış ve 
                  orijinal ambalajında olması gerekmektedir.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-heading mb-4">7. Fikri Mülkiyet</h2>
                <p>
                  Sitede yer alan tüm içerik, logo, görsel ve metinlerin telif 
                  hakları Minimog&apos;a aittir. İzinsiz kullanımı yasaktır.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-heading mb-4">8. Uyuşmazlık Çözümü</h2>
                <p>
                  İşbu koşullardan doğan uyuşmazlıklarda İstanbul Mahkemeleri ve 
                  İcra Daireleri yetkilidir.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
