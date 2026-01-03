import { getAllBlogPosts } from '@/app/actions/admin-blogs';
import BlogPostCard from '@/components/common/blog/blog-post-card';
import MainTemplate from '@/components/layout/main-template/main-template';
import { Metadata } from 'next';
import Link from 'next/link';
import { SITE_URL } from '@/utils/consts';

export const metadata: Metadata = {
  title: 'Բլոգ - Arakelians Drive | Վարորդական Իրավունքի Ուղեցույց',
  description:
    'Կարդացեք օգտակար հոդվածներ վարորդական իրավունքի, ավտոդպրոցի ընտրության և վարելու տեխնիկաների մասին: 30+ հոդված վարորդական իրավունքի, քննությունների, անվտանգ վարելու և ավտոդպրոցի ընտրության մասին:',
  keywords:
    'ավտոդպրոց, վարորդական իրավունք, բլոգ, հոդվածներ, ուսուցում, վարորդական իրավունք հոդվածներ, ավտոդպրոց հոդվածներ, վարելու խորհուրդներ, վարորդական քննություն հոդվածներ',
  openGraph: {
    title: 'Բլոգ - Arakelians Drive | Վարորդական Իրավունքի Ուղեցույց',
    description:
      'Կարդացեք օգտակար հոդվածներ վարորդական իրավունքի, ավտոդպրոցի ընտրության և վարելու տեխնիկաների մասին:',
    type: 'website',
    siteName: 'Arakelians Drive',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Բլոգ - Arakelians Drive | Վարորդական Իրավունքի Ուղեցույց',
    description:
      'Կարդացեք օգտակար հոդվածներ վարորդական իրավունքի, ավտոդպրոցի ընտրության և վարելու տեխնիկաների մասին:',
  },
};

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function BlogPage() {
  const posts = await getAllBlogPosts(false);

  return (
    <MainTemplate>
      <div className="my-12 mx-0">
        <div className="container">
          {/* Breadcrumb */}
          <nav className="mb-6 text-sm text-[#8D8D8D]">
            <Link
              href={SITE_URL.HOME}
              className="hover:text-[#FA8604] transition-colors"
            >
              Գլխավոր
            </Link>
            <span className="mx-2">/</span>
            <span>Բլոգ</span>
          </nav>

          <h1 className="global-title mb-4">Բլոգ</h1>
          <p className="text-[#8D8D8D] text-lg mb-8 max-md:text-base">
            Կարդացեք օգտակար հոդվածներ վարորդական իրավունքի, ավտոդպրոցի
            ընտրության և վարելու տեխնիկաների մասին:
          </p>

          {posts.length === 0 ? (
            <div className="bg-white rounded-[20px] shadow-[0_0_60px_30px_rgba(0,0,0,0.03)] p-12 text-center">
              <p className="text-[#8D8D8D] text-lg">
                Դեռ հոդվածներ չկան: Շուտով կավելանան նոր հոդվածներ:
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post: any) => (
                <BlogPostCard key={post.id} post={post} />
              ))}
            </div>
          )}
        </div>
      </div>
    </MainTemplate>
  );
}
