import { Metadata } from 'next';
import Link from 'next/link';
import MainTemplate from '@/components/layout/main-template/main-template';
import { getAllRulesSections } from '@/app/actions/admin-rules';
import { SITE_URL } from '@/utils/consts';
import RulesSectionCard from '@/components/common/rules/RulesSectionCard';

export const metadata: Metadata = {
  title: 'Ճանապարհային Երթևեկության Կանոններ | Arakelians Drive',
  description:
    'Հայաստանի Հանրապետության ճանապարհային երթևեկության կանոնների ամբողջական փաստաթուղթ: Բոլոր բաժինները մեկ տեղում: Ճանապարհային նշաններ, գծանշումներ, երթևեկության կանոններ:',
  keywords:
    'ճանապարհային կանոններ, երթևեկության կանոններ, վարորդական իրավունք, Հայաստան, ճանապարհային նշաններ, ճանապարհային գծանշումներ, երթևեկության կանոններ Հայաստան',
  openGraph: {
    title: 'Ճանապարհային Երթևեկության Կանոններ | Arakelians Drive',
    description:
      'Հայաստանի Հանրապետության ճանապարհային երթևեկության կանոնների ամբողջական փաստաթուղթ',
    type: 'website',
    siteName: 'Arakelians Drive',
  },
  twitter: {
    card: 'summary',
    title: 'Ճանապարհային Երթևեկության Կանոններ | Arakelians Drive',
    description:
      'Հայաստանի Հանրապետության ճանապարհային երթևեկության կանոնների ամբողջական փաստաթուղթ',
  },
};

export default async function RulesPage() {
  const sections = await getAllRulesSections();

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
            <p className="text-[#222] text-lg leading-relaxed max-w-4xl mb-4">
              Հայաստանի Հանրապետության ճանապարհային երթևեկության կանոնների
              ամբողջական փաստաթուղթ: Ընտրեք բաժինը՝ մանրամասն կանոնները
              ծանոթանալու համար:
            </p>
            {/* Quick Links */}
            <div className="flex flex-wrap gap-4">
              <Link
                href={SITE_URL.ROAD_SIGNS}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-[#FA8604] to-[#FFA64D] text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-300 font-semibold"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                Ճանապարհային Նշաններ
              </Link>
              <Link
                href={SITE_URL.ROAD_MARKINGS}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-[#4A90E2] to-[#6BB3FF] text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-300 font-semibold"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
                Ճանապարհային Գծանշումներ
              </Link>
              <Link
                href={SITE_URL.VEHICLE_IDENTIFICATION_SIGNS}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-[#10B981] to-[#34D399] text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-300 font-semibold"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Տրանսպորտային Միջոցների Ճանաչման Նշաններ
              </Link>
              <Link
                href={SITE_URL.VEHICLE_TECHNICAL_DEFECTS}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-[#EF4444] to-[#F87171] text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-300 font-semibold"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
                Տեխնիկական Անսարքություններ
              </Link>
              <Link
                href={SITE_URL.TRAFFIC_LAW}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-[#8B5CF6] to-[#A78BFA] text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-300 font-semibold"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                Օրենք
              </Link>
            </div>
          </div>

          {/* Sections Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-[100px] max-[767px]:mb-8">
            {sections.map((section: any, index: number) => (
              <RulesSectionCard key={section.id} section={section} index={index} />
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
