import Link from 'next/link';
import MainTemplate from '@/components/layout/main-template/main-template';
import { SITE_URL } from '@/utils/consts';

export default function NotFound() {
  return (
    <MainTemplate>
      <div className="container-full pt-[100px] max-w-[1350px] w-full max-[767px]:pt-[90px]">
        <div className="text-center py-20">
          <div className="mb-8">
            <h1 className="text-6xl font-bold text-[#1A2229] mb-4">404</h1>
            <h2 className="text-3xl font-semibold text-[#222] mb-4">
              Բաժինը չի գտնվել
            </h2>
            <p className="text-[#8D8D8D] text-lg mb-8">
              Ցավոք, այս բաժինը գոյություն չունի կամ հեռացված է:
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/rules"
              className="inline-flex items-center justify-center bg-[#FA8604] text-white px-8 py-4 rounded-xl hover:bg-[#FFA64D] transition-colors duration-300 font-semibold"
            >
              <svg
                className="w-5 h-5 mr-2"
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
              Բոլոր բաժինները
            </Link>

            <Link
              href={SITE_URL.HOME}
              className="inline-flex items-center justify-center bg-white text-[#1A2229] px-8 py-4 rounded-xl border-2 border-gray-200 hover:border-[#FA8604] transition-colors duration-300 font-semibold"
            >
              Գլխավոր էջ
            </Link>
          </div>
        </div>
      </div>
    </MainTemplate>
  );
}
