import type { Metadata } from "next";
import { Header, Footer } from "@/components/storefront";

export const metadata: Metadata = {
  title: "Hakkımızda",
  description: "Minimog hakkında bilgi edinin.",
  alternates: { canonical: "https://minimog.com.tr/hakkimizda" },
};

export default function AboutPage() {
  return (
    <>
      <Header />
      <div className="bg-white">
        <div className="relative h-[200px] md:h-[300px] bg-[#F5F5F5] flex items-center justify-center">
          <div className="text-center px-4">
            <h1 className="text-3xl md:text-5xl font-bold text-heading mb-3">Hakkımızda</h1>
            <p className="text-text text-sm md:text-base max-w-xl mx-auto">
              Bebek ve çocuk giyiminde kalite ve şıklığı bir araya getiriyoruz.
            </p>
          </div>
        </div>

        <div className="max-w-[1510px] mx-auto px-4 md:px-8 py-12 md:py-20">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-heading mb-6">Hikayemiz</h2>
                <div className="space-y-4 text-text leading-relaxed">
                  <p>
                    Minimog olarak, bebek ve çocuk giyiminde kaliteli, şık ve uygun fiyatlı ürünleri
                    ailelerle buluşturmak için yola çıktık. Her çocuğun özel olduğuna inanıyor ve
                    onların rahatlığını, mutluluğunu her şeyin önünde tutuyoruz.
                  </p>
                  <p>
                    Kurulduğumuz günden bu yana, en kaliteli kumaşları ve malzemeleri özenle seçiyor,
                    her ürünün titizlikle üretilmesini sağlıyoruz. Tasarımlarımızda modern çizgileri
                    klasik dokunuşlarla birleştirerek, hem günlük kullanıma uygun hem de özel
                    günler için şık alternatifler sunuyoruz.
                  </p>
                  <p>
                    Müşteri memnuniyeti bizim için her zaman ön planda. Bu yüzden satın alma
                    öncesinden sonrasına kadar her adımda yanınızda oluyor, sorunsuz bir alışveriş
                    deneyimi yaşamanız için çalışıyoruz.
                  </p>
                </div>
              </div>
              <div className="bg-[#F5F5F5] rounded-lg aspect-square flex items-center justify-center">
                <svg className="w-24 h-24 text-text-lighter" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={0.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              <div className="text-center p-8 bg-[#F9F9F9] rounded-lg">
                <div className="w-14 h-14 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-5">
                  <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-heading mb-2">Kaliteli Ürünler</h3>
                <p className="text-sm text-text">
                  En iyi kumaş ve malzemelerle üretilmiş, uzun ömürlü ve konforlu ürünler.
                </p>
              </div>
              <div className="text-center p-8 bg-[#F9F9F9] rounded-lg">
                <div className="w-14 h-14 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-5">
                  <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-heading mb-2">Hızlı Teslimat</h3>
                <p className="text-sm text-text">
                  Siparişleriniz özenle hazırlanır ve en hızlı şekilde kapınıza teslim edilir.
                </p>
              </div>
              <div className="text-center p-8 bg-[#F9F9F9] rounded-lg">
                <div className="w-14 h-14 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-5">
                  <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-heading mb-2">Müşteri Memnuniyeti</h3>
                <p className="text-sm text-text">
                  %100 müşteri memnuniyeti için çalışıyor, her zaman yanınızda oluyoruz.
                </p>
              </div>
            </div>

            <div className="text-center">
              <h2 className="text-2xl md:text-3xl font-bold text-heading mb-4">Bize Ulaşın</h2>
              <p className="text-text mb-2">E-posta: hello@domain.com</p>
              <p className="text-text">Telefon: +90 (212) 123 45 67</p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
