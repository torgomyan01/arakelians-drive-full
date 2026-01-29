import Link from 'next/link';
import MainTemplate from '@/components/layout/main-template/main-template';

export default function NotFound() {
  return (
    <MainTemplate>
      <div className="container mx-auto px-4 py-[60px] max-md:py-[40px]">
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-white rounded-[20px] shadow-[0_0_60px_30px_rgba(0,0,0,0.03)] p-12">
            <h1 className="text-4xl font-bold text-[#1A2229] mb-4">
              Աշակերտ չի գտնվել
            </h1>
            <p className="text-[#8D8D8D] text-lg mb-8">
              Նշված հղումով աշակերտ չի գտնվել: Խնդրում ենք ստուգել հղումը:
            </p>
            <Link
              href="/"
              className="inline-block px-6 py-2 rounded-[10px] bg-[#FA8604] hover:bg-[#FA8604]/90 text-white font-medium transition-colors"
            >
              Գնալ գլխավոր էջ
            </Link>
          </div>
        </div>
      </div>
    </MainTemplate>
  );
}
