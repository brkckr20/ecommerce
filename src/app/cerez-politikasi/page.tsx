import type { Metadata } from "next";
import { Header, Footer } from "@/components/storefront";

export const metadata: Metadata = {
  title: "Çerez Politikası",
  description: "Minimog çerez politikası.",
  alternates: { canonical: "https://somni.com.tr/cerez-politikasi" },
};

export default function CookiePolicyPage() {
  return (
    <>
      <Header />
      <div className="bg-white">
        <div className="relative h-[200px] md:h-[300px] bg-[#F5F5F5] flex items-center justify-center">
          <div className="text-center px-4">
            <h1 className="text-3xl md:text-5xl font-bold text-heading mb-3">Çerez Politikası</h1>
            <p className="text-text text-sm md:text-base max-w-xl mx-auto">
              Çerezler hakkında detaylı bilgi.
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
                <h2 className="text-2xl font-bold text-heading mb-4">1. Çerez Nedir?</h2>
                <p>
                  Çerezler, web sitemizi ziyaret ettiğinizde tarayıcınıza kaydedilen 
                  küçük metin dosyalarıdır. Bu dosyalar, sizi hatırlamamıza ve size 
                  daha iyi bir kullanıcı deneyimi sunmamıza yardımcı olur.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-heading mb-4">2. Kullandığımız Çerez Türleri</h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-heading mb-2">Zorunlu Çerezler</h3>
                    <p>
                      Web sitemizin düzgün çalışması için gerekli olan çerezlerdir. 
                      Bu çerezler olmadan siteyi kullanamazsınız.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-heading mb-2">Performans Çerezleri</h3>
                    <p>
                      Sitemizin nasıl kullanıldığını anlamamıza yardımcı olur. 
                      Hangi sayfaların ziyaret edildiği, hangi bağlantılara tıklandığı 
                      gibi bilgileri toplar.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-heading mb-2">İşlevsellik Çerezleri</h3>
                    <p>
                      Tercihlerinizi hatırlamamızı sağlar. Dil seçeneği, oturum 
                      bilgileri gibi veriler bu çerezlerle saklanır.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-heading mb-2">Pazarlama Çerezleri</h3>
                    <p>
                      İlgi alanlarınıza uygun reklam ve kampanyaları göstermek 
                      için kullanılır.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-heading mb-4">3. Çerez Yönetimi</h2>
                <p className="mb-3">
                  Tarayıcı ayarlarınızdan çerez tercihlerinizi yönetebilirsiniz. 
                  Çerezleri tamamen devre dışı bırakmanız durumunda web sitemizin 
                  bazı özellikleri düzgün çalışmayabilir.
                </p>
                <p className="mb-3">
                  Çerez ayarlarınızı değiştirmek için tarayıcınızın yardım 
                  menüsünü kullanabilirsiniz:
                </p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Google Chrome: Ayarlar &gt; Gizlilik ve Güvenlik &gt; Çerezler</li>
                  <li>Mozilla Firefox: Seçenekler &gt; Gizlilik &amp; Güvenlik &gt; Çerezler</li>
                  <li>Safari: Tercihler &gt; Gizlilik &gt; Çerezler</li>
                  <li>Microsoft Edge: Ayarlar &gt; Site İzinleri &gt; Çerezler</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-heading mb-4">4. Üçüncü Taraf Çerezler</h2>
                <p>
                  Sitemizde analiz ve reklam hizmetleri sağlayan üçüncü tarafların 
                  çerezleri kullanılabilmektedir. Bu çerezlerin kullanımı ilgili 
                  üçüncü tarafın gizlilik politikalarına tabidir.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-heading mb-4">5. Değişiklikler</h2>
                <p>
                  Bu çerez politikası zaman zaman güncellenebilir. Değişiklikler 
                  sitede yayınlandığı anda yürürlüğe girer.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-heading mb-4">6. İletişim</h2>
                <p>
                  Çerez politikamız hakkında sorularınız için 
                  info@somni.com.tr adresinden bize ulaşabilirsiniz.
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
