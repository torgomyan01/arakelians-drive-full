import { Metadata } from 'next';
import Link from 'next/link';
import MainTemplate from '@/components/layout/main-template/main-template';
import { getAllSections } from '@/utils/rulesSections';
import { SITE_URL } from '@/utils/consts';

export const metadata: Metadata = {
  title: 'Ճանապարհային Երթևեկության Կանոններ | xDrive',
  description:
    'Հայաստանի Հանրապետության ճանապարհային երթևեկության կանոնների ամբողջական փաստաթուղթ: Բոլոր բաժինները մեկ տեղում:',
  keywords:
    'ճանապարհային կանոններ, երթևեկության կանոններ, վարորդական իրավունք, Հայաստան',
  openGraph: {
    title: 'Ճանապարհային Երթևեկության Կանոններ',
    description:
      'Հայաստանի Հանրապետության ճանապարհային երթևեկության կանոնների ամբողջական փաստաթուղթ',
    type: 'website',
  },
};

export default function RulesPage() {
  const sections = getAllSections();

  return (
    <MainTemplate>
      <div className="container-full pt-[100px] max-w-[1350px] w-full max-[767px]:pt-[90px]">
        <div>
          {/* Breadcrumb */}
          <ul className="flex mb-8 max-[767px]:mb-5">
            <li>
              <a href={SITE_URL.HOME} className="text-[#8D8D8D] text-base">
                Գլխաոր էջ{' '}
              </a>
            </li>
            <li>
              <span className="text-[#8D8D8D] text-base ml-1">
                / Ճանապարհային Կանոններ
              </span>
            </li>
          </ul>

          <h1 className="global-title mb-[60px] max-[1024px]:mb-8">
            Ճանապարհային Երթևեկության Կանոններ
          </h1>

          <div className="mb-8">
            <p className="text-[#222] text-lg leading-relaxed max-w-4xl">
              Հայաստանի Հանրապետության ճանապարհային երթևեկության կանոնների
              ամբողջական փաստաթուղթ: Ընտրեք բաժինը՝ մանրամասն կանոնները
              ծանոթանալու համար:
            </p>
          </div>

          {/* Sections Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-[100px] max-[767px]:mb-8">
            {sections.map((section, index) => (
              <Link
                key={section.id}
                href={`/rules/${section.slug}`}
                className="group relative bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-[#FA8604]"
              >
                {/* Card Number Badge */}
                <div className="absolute top-4 right-4 w-10 h-10 bg-[#FA8604] text-white rounded-full flex items-center justify-center font-bold text-lg z-10">
                  {index + 1}
                </div>

                <div className="p-6">
                  {/* Icon Placeholder */}
                  <div className="w-16 h-16 bg-gradient-to-br from-[#FA8604] to-[#FFA64D] rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <span className="text-white text-2xl font-bold">
                      {section.title.charAt(0)}
                    </span>
                  </div>

                  {/* Title */}
                  <h2 className="text-xl font-bold text-[#1A2229] mb-3 group-hover:text-[#FA8604] transition-colors duration-300 line-clamp-2">
                    {section.title}
                  </h2>

                  {/* Description */}
                  <p className="text-[#8D8D8D] text-sm leading-relaxed line-clamp-3 mb-4">
                    {section.description}
                  </p>

                  {/* Read More Link */}
                  <div className="flex items-center text-[#FA8604] font-semibold text-sm group-hover:translate-x-2 transition-transform duration-300">
                    <span>Կարդալ ավելին</span>
                    <svg
                      className="w-5 h-5 ml-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>

                {/* Hover Effect Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#FA8604]/0 to-[#FA8604]/0 group-hover:from-[#FA8604]/5 group-hover:to-transparent transition-all duration-300 pointer-events-none" />
              </Link>
            ))}
          </div>

          {/* Additional Info Section */}
          <div className="bg-gradient-to-r from-[#FA8604] to-[#FFA64D] rounded-2xl p-8 text-white mb-[100px] max-[767px]:mb-8">
            <h3 className="text-2xl font-bold mb-4">Կարևոր տեղեկություն</h3>
            <p className="text-lg leading-relaxed opacity-95">
              Այս փաստաթուղթը պարունակում է Հայաստանի Հանրապետության
              ճանապարհային երթևեկության կանոնների ամբողջական տեքստը: Բոլոր
              բաժինները ներկայացված են պաշտոնական տարբերակով և կարող են
              օգտագործվել վարորդական իրավունքի ստուգման և ուսուցման նպատակով:
            </p>
          </div>
        </div>
      </div>
    </MainTemplate>
  );
}
