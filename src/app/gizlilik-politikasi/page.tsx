import type { Metadata } from "next";
import { Header, Footer } from "@/components/storefront";

export const metadata: Metadata = {
  title: "Gizlilik Politikası",
  description: "Minimog gizlilik politikası.",
  alternates: { canonical: "https://minimog.com.tr/gizlilik-politikasi" },
};

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <div className="bg-white">
        <div className="relative h-[200px] md:h-[300px] bg-[#F5F5F5] flex items-center justify-center">
          <div className="text-center px-4">
            <h1 className="text-3xl md:text-5xl font-bold text-heading mb-3">Gizlilik Politikası</h1>
            <p className="text-text text-sm md:text-base max-w-xl mx-auto">
              Kişisel verilerinizin güvenliği bizim için önemlidir.
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
                <h2 className="text-2xl font-bold text-heading mb-4">1. Giriş</h2>
                <p>
                  Minimog olarak, kişisel verilerinizin gizliliğine ve güvenliğine büyük önem 
                  vermekteyiz. Bu Gizlilik Politikası, web sitemizi ziyaret ettiğinizde veya 
                  alışveriş yaptığınızda kişisel verilerinizin nasıl toplandığı, kullanıldığı 
                  ve korunduğu hakkında sizi bilgilendirmek amacıyla hazırlanmıştır.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-heading mb-4">2. Toplanan Veriler</h2>
                <p className="mb-3">
                  Size daha iyi hizmet verebilmek için aşağıdaki kişisel verilerinizi 
                  toplayabiliriz:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Ad, soyad, e-posta adresi, telefon numarası</li>
                  <li>Teslimat ve fatura adresi bilgileri</li>
                  <li>IP adresi, tarayıcı bilgileri, çerezler</li>
                  <li>Sipariş geçmişi ve ödeme bilgileri</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-heading mb-4">3. Verilerin Kullanım Amacı</h2>
                <p className="mb-3">
                  Topladığımız kişisel verileriniz aşağıdaki amaçlarla kullanılabilir:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Siparişlerinizin işlenmesi ve teslim edilmesi</li>
                  <li>Müşteri hizmetleri ve destek sağlanması</li>
                  <li>Kampanya ve promosyonlardan haberdar edilmesi</li>
                  <li>Web sitemizin geliştirilmesi ve kişiselleştirilmesi</li>
                  <li>Yasal yükümlülüklerin yerine getirilmesi</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-heading mb-4">4. Verilerin Paylaşımı</h2>
                <p>
                  Kişisel verileriniz, yasal zorunluluklar dışında üçüncü taraflarla 
                  paylaşılmaz. Siparişlerinizin teslimatı için kargo firmaları, ödeme 
                  işlemleri için bankalar ve Shopify gibi hizmet sağlayıcılarla sınırlı 
                  ölçüde veri paylaşımı yapılabilir.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-heading mb-4">5. Çerezler</h2>
                <p>
                  Web sitemizde, kullanıcı deneyimini iyileştirmek ve site trafiğini 
                  analiz etmek amacıyla çerezler kullanılmaktadır. Çerez tercihlerinizi 
                  tarayıcı ayarlarınızdan yönetebilirsiniz. Detaylı bilgi için Çerez 
                  Politikamızı inceleyebilirsiniz.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-heading mb-4">6. Veri Güvenliği</h2>
                <p>
                  Kişisel verilerinizin güvenliğini sağlamak için gerekli teknik ve 
                  idari tedbirleri almaktayız. SSL sertifikası ile veri iletiminiz 
                  şifrelenmekte ve yetkisiz erişime karşı korunmaktadır.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-heading mb-4">7. Haklarınız</h2>
                <p className="mb-3">
                  KVKK kapsamında aşağıdaki haklara sahipsiniz:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Kişisel verilerinizin işlenip işlenmediğini öğrenme</li>
                  <li>İşlenmişse bilgi talep etme</li>
                  <li>Eksik veya yanlış verilerin düzeltilmesini isteme</li>
                  <li>Verilerinizin silinmesini talep etme</li>
                  <li>İtiraz etme hakkı</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-heading mb-4">8. İletişim</h2>
                <p>
                  Gizlilik politikamız hakkında sorularınız için hello@domain.com 
                  adresinden bize ulaşabilirsiniz.
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
