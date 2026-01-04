import { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/components/layout/navbar/navbar';
import Footer from '@/components/layout/footer/footer';
import { SITE_URL } from '@/utils/consts';

export const metadata: Metadata = {
  title: 'Գաղտնիության քաղաքականություն | Arakelians Drive',
  description:
    'Arakelians Drive-ի գաղտնիության քաղաքականություն: Մենք պաշտպանում ենք ձեր անձնական տվյալները և բացատրում ենք, թե ինչպես ենք օգտագործում cookie-ները և localStorage-ը:',
  keywords:
    'գաղտնիության քաղաքականություն, cookie-ներ, localStorage, անձնական տվյալներ, Arakelians Drive',
  openGraph: {
    title: 'Գաղտնիության քաղաքականություն | Arakelians Drive',
    description:
      'Arakelians Drive-ի գաղտնիության քաղաքականություն: Մենք պաշտպանում ենք ձեր անձնական տվյալները:',
    type: 'website',
    siteName: 'Arakelians Drive',
  },
  twitter: {
    card: 'summary',
    title: 'Գաղտնիության քաղաքականություն | Arakelians Drive',
    description:
      'Arakelians Drive-ի գաղտնիության քաղաքականություն: Մենք պաշտպանում ենք ձեր անձնական տվյալները:',
  },
};

export default function PrivacyPolicyPage() {
  return (
    <>
      <Navbar />
      <main className="overflow-hidden rounded-[20px] pt-0!">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          {/* Breadcrumb */}
          <ul className="flex flex-wrap mb-8">
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
                Գաղտնիության քաղաքականություն
              </span>
            </li>
          </ul>

          {/* Page Title */}
          <h1 className="global-title mb-8">Գաղտնիության քաղաքականություն</h1>

          {/* Content */}
          <div className="bg-white rounded-[20px] shadow-[0_0_34px_rgba(0,0,0,0.16)] p-8 max-md:p-5 mb-8">
            <div className="prose prose-lg max-w-none text-[#222]">
              <p className="text-sm text-[#8D8D8D] mb-6">
                Վերջին թարմացում:{' '}
                {new Date().toLocaleDateString('hy-AM', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-[#1A2229] mb-4">
                  1. Ներածություն
                </h2>
                <p className="mb-4 text-lg leading-relaxed">
                  Arakelians Drive-ը հարգում է ձեր գաղտնիությունը և պարտավորվում
                  է պաշտպանել ձեր անձնական տվյալները: Այս Գաղտնիության
                  քաղաքականությունը բացատրում է, թե ինչպես ենք մենք հավաքում,
                  օգտագործում և պաշտպանում ձեր տեղեկությունները, երբ դուք
                  օգտագործում եք մեր կայքը:
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-[#1A2229] mb-4">
                  2. Cookie-ների օգտագործում
                </h2>
                <p className="mb-4 text-lg leading-relaxed">
                  Մեր կայքը օգտագործում է cookie-ներ և localStorage՝ ձեր փորձը
                  բարելավելու և կայքի գործունեությունը ապահովելու համար:
                </p>
                <h3 className="text-xl font-semibold text-[#1A2229] mb-3 mt-6">
                  2.1. Ինչ են cookie-ները
                </h3>
                <p className="mb-4 text-lg leading-relaxed">
                  Cookie-ները փոքր տեքստային ֆայլեր են, որոնք պահվում են ձեր
                  բրաուզերում, երբ դուք այցելում եք կայք: Նրանք օգնում են կայքին
                  հիշել ձեր նախասիրությունները և բարելավել ձեր փորձը:
                </p>
                <h3 className="text-xl font-semibold text-[#1A2229] mb-3 mt-6">
                  2.2. Ինչ cookie-ներ ենք մենք օգտագործում
                </h3>
                <ul className="list-disc pl-6 mb-4 space-y-2 text-lg leading-relaxed">
                  <li>
                    <strong>Անհրաժեշտ cookie-ներ:</strong> Այս cookie-ները
                    անհրաժեշտ են կայքի հիմնական գործունեության համար, ինչպիսիք
                    են authentication-ը և անվտանգությունը:
                  </li>
                  <li>
                    <strong>Ֆունկցիոնալ cookie-ներ:</strong> Այս cookie-ները
                    թույլ են տալիս կայքին հիշել ձեր ընտրությունները, ինչպիսիք են
                    լեզուն, տարածաշրջանը և այլ նախասիրություններ:
                  </li>
                  <li>
                    <strong>Analytics cookie-ներ:</strong> Մենք օգտագործում ենք
                    այս cookie-ները՝ հասկանալու համար, թե ինչպես են այցելուները
                    օգտագործում մեր կայքը:
                  </li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-[#1A2229] mb-4">
                  3. LocalStorage-ի օգտագործում
                </h2>
                <p className="mb-4 text-lg leading-relaxed">
                  Մեր կայքը օգտագործում է localStorage՝ ձեր բրաուզերում
                  տեղեկություններ պահելու համար: Այս տվյալները օգտագործվում են
                  միայն ձեր փորձը բարելավելու համար և չեն փոխանցվում երրորդ
                  կողմերին:
                </p>
                <h3 className="text-xl font-semibold text-[#1A2229] mb-3 mt-6">
                  3.1. Ինչ տվյալներ ենք մենք պահում localStorage-ում
                </h3>
                <ul className="list-disc pl-6 mb-4 space-y-2 text-lg leading-relaxed">
                  <li>
                    <strong>Cookie համաձայնություն:</strong> Ձեր cookie-ների
                    նկատմամբ համաձայնության կարգավիճակը
                  </li>
                  <li>
                    <strong>Օգտատիրոջ նախասիրություններ:</strong> Օրինակ,
                    մեկնաբանությունների հեղինակի անունը, թեստերի պատասխանները և
                    այլ նախասիրություններ
                  </li>
                  <li>
                    <strong>Գրանցման տվյալներ:</strong> Գրանցման countdown
                    timer-ի տվյալները
                  </li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-[#1A2229] mb-4">
                  4. Անձնական տվյալների հավաքագրում
                </h2>
                <p className="mb-4 text-lg leading-relaxed">
                  Մենք հավաքում ենք անձնական տվյալներ միայն այն դեպքում, երբ
                  դուք մեզ տրամադրում եք դրանք, օրինակ՝ գրանցվելիս կամ կապ
                  հաստատելիս: Այս տվյալները ներառում են:
                </p>
                <ul className="list-disc pl-6 mb-4 space-y-2 text-lg leading-relaxed">
                  <li>Անուն և ազգանուն</li>
                  <li>Հեռախոսահամար</li>
                  <li>Էլեկտրոնային հասցե (եթե տրամադրված է)</li>
                  <li>Հաղորդագրություններ (կոնտակտային ձևի միջոցով)</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-[#1A2229] mb-4">
                  5. Տվյալների օգտագործում
                </h2>
                <p className="mb-4 text-lg leading-relaxed">
                  Մենք օգտագործում ենք ձեր անձնական տվյալները հետևյալ
                  նպատակներով:
                </p>
                <ul className="list-disc pl-6 mb-4 space-y-2 text-lg leading-relaxed">
                  <li>Մեր ծառայությունների մատուցում և բարելավում</li>
                  <li>Ձեզ հետ կապ հաստատել ձեր հարցումների վերաբերյալ</li>
                  <li>Գրանցման և գործարքների մշակում</li>
                  <li>Կայքի անվտանգության ապահովում</li>
                  <li>Օրինական պահանջների կատարում</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-[#1A2229] mb-4">
                  6. Տվյալների պաշտպանություն
                </h2>
                <p className="mb-4 text-lg leading-relaxed">
                  Մենք կիրառում ենք համապատասխան տեխնիկական և կազմակերպական
                  միջոցներ՝ ձեր անձնական տվյալները պաշտպանելու համար:
                  Այնուամենայնիվ, ոչ մի ինտերնետային փոխանցում կամ էլեկտրոնային
                  պահեստավորում չի կարող լիովին ապահով լինել:
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-[#1A2229] mb-4">
                  7. Cookie-ների կառավարում
                </h2>
                <p className="mb-4 text-lg leading-relaxed">
                  Դուք կարող եք կառավարել cookie-ները ձեր բրաուզերի
                  կարգավորումների միջոցով: Խնդրում ենք նկատի ունենալ, որ
                  cookie-ների անջատումը կարող է ազդել կայքի որոշ ֆունկցիաների
                  վրա:
                </p>
                <p className="mb-4 text-lg leading-relaxed">
                  Դուք նաև կարող եք մաքրել localStorage-ը ձեր բրաուզերի
                  կարգավորումների միջոցով:
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-[#1A2229] mb-4">
                  8. Երրորդ կողմերի հղումներ
                </h2>
                <p className="mb-4 text-lg leading-relaxed">
                  Մեր կայքը կարող է պարունակել հղումներ դեպի այլ կայքեր: Մենք
                  պատասխանատվություն չենք կրում այլ կայքերի գաղտնիության
                  պրակտիկայի համար: Խնդրում ենք կարդալ այդ կայքերի գաղտնիության
                  քաղաքականությունը:
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-[#1A2229] mb-4">
                  9. Ձեր իրավունքները
                </h2>
                <p className="mb-4 text-lg leading-relaxed">
                  Դուք ունեք իրավունք:
                </p>
                <ul className="list-disc pl-6 mb-4 space-y-2 text-lg leading-relaxed">
                  <li>Մուտք գործել ձեր անձնական տվյալներին</li>
                  <li>Ուղղել ձեր անձնական տվյալները</li>
                  <li>Ջնջել ձեր անձնական տվյալները</li>
                  <li>Վիճարկել մեր տվյալների մշակումը</li>
                  <li>Մերժել cookie-ների օգտագործումը</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-[#1A2229] mb-4">
                  10. Քաղաքականության փոփոխություններ
                </h2>
                <p className="mb-4 text-lg leading-relaxed">
                  Մենք կարող ենք ժամանակ առ ժամանակ թարմացնել այս Գաղտնիության
                  քաղաքականությունը: Խնդրում ենք պարբերաբար ստուգել այս էջը՝
                  փոփոխությունների մասին տեղեկացված մնալու համար:
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-[#1A2229] mb-4">
                  11. Կապ մեզ հետ
                </h2>
                <p className="mb-4 text-lg leading-relaxed">
                  Եթե ունեք հարցեր այս Գաղտնիության քաղաքականության վերաբերյալ,
                  խնդրում ենք կապ հաստատել մեզ հետ{' '}
                  <Link
                    href={SITE_URL.CONTACT}
                    className="text-[#FA8604] hover:underline font-semibold"
                  >
                    կոնտակտային էջի
                  </Link>{' '}
                  միջոցով:
                </p>
              </section>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
