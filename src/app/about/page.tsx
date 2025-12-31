import { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/components/layout/navbar/navbar';
import Footer from '@/components/layout/footer/footer';
import AboutUs from '@/components/common/home/about-us/about-us';
import Image from 'next/image';
import { SITE_URL } from '@/utils/consts';

export const metadata: Metadata = {
  title: 'Մեր մասին | Arakelians Drive - Ավտոդպրոց Հայաստանում',
  description:
    'Arakelians Drive - Հայաստանի լավագույն ավտոդպրոցը: 2000+ շրջանավարտ, 8+ տարվա փորձ, 98% հաջողություն առաջին փորձից: Ժամանակակից նավատորմ, փորձառու հրահանգիչներ, անհատական մոտեցում:',
  keywords:
    'ավտոդպրոց Հայաստանում, վարորդական իրավունք, Arakelians Drive, ավտոդպրոց Երևանում, վարորդական դասեր, վարորդական քննություն, վարորդական իրավունք ստանալ',
  openGraph: {
    title: 'Մեր մասին | Arakelians Drive',
    description:
      'Arakelians Drive - Հայաստանի լավագույն ավտոդպրոցը: 2000+ շրջանավարտ, 98% հաջողություն առաջին փորձից',
    type: 'website',
  },
};

// Placeholder data - replace with actual data
const graduates = [
  { id: 1, name: 'Անուն Ազգանուն', image: '/images/person.png' },
  { id: 2, name: 'Անուն Ազգանուն', image: '/images/person.png' },
  { id: 3, name: 'Անուն Ազգանուն', image: '/images/person.png' },
  { id: 4, name: 'Անուն Ազգանուն', image: '/images/person.png' },
  { id: 5, name: 'Անուն Ազգանուն', image: '/images/person.png' },
  { id: 6, name: 'Անուն Ազգանուն', image: '/images/person.png' },
  { id: 7, name: 'Անուն Ազգանուն', image: '/images/person.png' },
  { id: 8, name: 'Անուն Ազգանուն', image: '/images/person.png' },
];

const certificates = [
  { id: 1, title: 'Սերտիֆիկատ 1', image: '/images/car.png' },
  { id: 2, title: 'Սերտիֆիկատ 2', image: '/images/car.png' },
  { id: 3, title: 'Սերտիֆիկատ 3', image: '/images/car.png' },
  { id: 4, title: 'Սերտիֆիկատ 4', image: '/images/car.png' },
];

function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="overflow-hidden rounded-[20px] pt-0!">
        <div className="container mx-auto px-4">
          {/* Breadcrumb */}
          <ul className="flex flex-wrap">
            <li>
              <Link
                href={SITE_URL.HOME}
                className="text-[#8D8D8D] text-base hover:text-[#FA8604] transition-colors"
              >
                Գլխաոր էջ
              </Link>
            </li>
            <li>
              <span className="text-[#8D8D8D] text-base mx-1">/</span>
            </li>
            <li>
              <span className="text-[#222] text-base font-semibold">
                Մեր մասին
              </span>
            </li>
          </ul>

          <AboutUs />

          {/* SEO Text Section */}
          <section className="mt-16 mb-16 max-md:mt-10 max-md:mb-10">
            <div className="bg-white rounded-[20px] shadow-[0_0_34px_rgba(0,0,0,0.16)] p-8 max-md:p-5">
              <h2 className="text-3xl font-bold text-[#1A2229] mb-6 max-md:text-2xl">
                Ինչո՞ւ ընտրել Arakelians Drive-ը
              </h2>
              <div className="prose prose-lg max-w-none text-[#222]">
                <p className="mb-6 text-lg leading-relaxed">
                  <strong>Arakelians Drive</strong> Հայաստանի ամենահաջողակ
                  ավտոդպրոցներից մեկն է, որը մասնագիտացված է վարորդական
                  իրավունքի ստացման մեջ: Մեր ավտոդպրոցը առաջարկում է ամբողջական
                  ուսուցման ծրագիր, որը ներառում է ինչպես տեսական, այնպես էլ
                  գործնական դասեր:
                </p>
                <p className="mb-6 text-lg leading-relaxed">
                  Մեր ուսանողների 98%-ը հաջողությամբ հանձնում է վարորդական
                  իրավունքի քննությունը առաջին փորձից: Սա մեր մասնագիտական
                  մոտեցման և բարձրորակ ուսուցման արդյունքն է: Մենք օգտագործում
                  ենք արդյունավետ մեթոդաբանություն, որը հնարավորություն է տալիս
                  արագ և հուսալիորեն յուրացնել վարորդական հմտությունները:
                </p>
                <p className="mb-6 text-lg leading-relaxed">
                  Մեր ավտոդպրոցը հագեցված է ժամանակակից ավտոմեքենաներով, որոնք
                  հագեցված են կրկնակի կառավարման համակարգով: Սա ապահովում է
                  անվտանգ ուսուցում և հնարավորություն է տալիս հրահանգչին
                  ակնթարթորեն միջամտել, եթե անհրաժեշտ լինի:
                </p>
                <p className="mb-6 text-lg leading-relaxed">
                  Մեր հրահանգիչները փորձառու մասնագետներ են, ովքեր ունեն
                  բազմամյա փորձ և հատուկ պատրաստված են աշխատելու ամեն տեսակի
                  ուսանողների հետ: Նրանք օգտագործում են անհատական մոտեցում և
                  օգնում են յուրաքանչյուր ուսանողի հասնել հաջողության:
                </p>
                <p className="mb-6 text-lg leading-relaxed">
                  Եթե դուք փնտրում եք ավտոդպրոց Երևանում կամ Հայաստանի այլ
                  քաղաքներում, Arakelians Drive-ը ձեր լավագույն ընտրությունն է:
                  Մենք առաջարկում ենք ճկուն գրաֆիկ, մատչելի գներ և երաշխիքված
                  արդյունք:
                </p>
              </div>
            </div>
          </section>

          {/* Graduates Gallery Section */}
          <section className="mt-16 mb-16 max-md:mt-10 max-md:mb-10">
            <h2 className="global-title mb-8 max-md:mb-6">
              Մեր շրջանավարտները
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-md:gap-4">
              {graduates.map((graduate) => (
                <div
                  key={graduate.id}
                  className="bg-white rounded-[20px] shadow-[0_0_34px_rgba(0,0,0,0.16)] overflow-hidden hover:shadow-[0_0_50px_rgba(250,134,4,0.3)] transition-all duration-300"
                >
                  <div className="relative w-full aspect-square">
                    <Image
                      src={graduate.image}
                      alt={graduate.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-4 text-center">
                    <p className="text-[#1A2229] font-semibold">
                      {graduate.name}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default AboutPage;
