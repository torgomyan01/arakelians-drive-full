import Link from 'next/link';
import MainTemplate from '@/components/layout/main-template/main-template';

export default function NotFound() {
  return (
    <MainTemplate>
      <div className="my-12 mx-0">
        <div className="container max-w-4xl text-center">
          <h1 className="text-4xl font-bold text-[#1A2229] mb-4">
            Հոդվածը չի գտնվել
          </h1>
          <p className="text-[#8D8D8D] text-lg mb-8">
            Ներողություն, այս հոդվածը գոյություն չունի կամ հեռացված է:
          </p>
          <Link
            href="/blog"
            className="inline-block rounded-[10px] bg-[#FA8604] hover:bg-[#e67503] text-white px-6 py-3 font-medium transition-colors"
          >
            Վերադառնալ բլոգ
          </Link>
        </div>
      </div>
    </MainTemplate>
  );
}
