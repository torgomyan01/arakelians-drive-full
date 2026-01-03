import { getBlogPostBySlug, getAllBlogPosts } from '@/app/actions/admin-blogs';
import MainTemplate from '@/components/layout/main-template/main-template';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post || !post.isPublished) {
    return {
      title: 'Հոդվածը չի գտնվել - Arakelians Drive',
    };
  }

  return {
    title: post.metaTitle || post.title,
    description: post.metaDescription || post.excerpt,
    keywords: post.keywords || undefined,
    openGraph: {
      title: post.metaTitle || post.title,
      description: post.metaDescription || post.excerpt,
      type: 'article',
      images: post.featuredImage
        ? [
            {
              url: post.featuredImage.startsWith('/')
                ? `${process.env.NEXT_PUBLIC_SITE_URL || 'https://arakeliansdrive.am'}${post.featuredImage}`
                : post.featuredImage,
              width: 1200,
              height: 630,
            },
          ]
        : [],
      publishedTime: post.publishedAt?.toISOString(),
      modifiedTime: post.updatedAt.toISOString(),
    },
    twitter: {
      card: 'summary_large_image',
      title: post.metaTitle || post.title,
      description: post.metaDescription || post.excerpt,
      images: post.featuredImage
        ? [
            post.featuredImage.startsWith('/')
              ? `${process.env.NEXT_PUBLIC_SITE_URL || 'https://arakeliansdrive.am'}${post.featuredImage}`
              : post.featuredImage,
          ]
        : [],
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  console.log('Blog post page - looking for slug:', slug);

  const post = await getBlogPostBySlug(slug);
  console.log('Blog post page - found post:', post ? post.title : 'NOT FOUND');

  if (!post || !post.isPublished) {
    console.log('Blog post page - post not found or not published');
    notFound();
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    image: post.featuredImage
      ? post.featuredImage.startsWith('/')
        ? `${process.env.NEXT_PUBLIC_SITE_URL || 'https://arakeliansdrive.am'}${post.featuredImage}`
        : post.featuredImage
      : undefined,
    datePublished: post.publishedAt?.toISOString(),
    dateModified: post.updatedAt.toISOString(),
    author: {
      '@type': 'Person',
      name: 'Arakelians Drive',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Arakelians Drive',
    },
  };

  return (
    <MainTemplate>
      <div className="my-12 mx-0">
        <div className="container max-w-4xl">
          {/* Breadcrumb */}
          <nav className="mb-6 text-sm text-[#8D8D8D]">
            <Link href="/" className="hover:text-[#FA8604] transition-colors">
              Գլխավոր
            </Link>
            <span className="mx-2">/</span>
            <Link
              href="/blog"
              className="hover:text-[#FA8604] transition-colors"
            >
              Բլոգ
            </Link>
            <span className="mx-2">/</span>
            <span>{post.title}</span>
          </nav>

          <article>
            {/* Featured Image */}
            {post.featuredImage && (
              <div className="mb-8 rounded-[20px] overflow-hidden">
                <Image
                  src={post.featuredImage}
                  alt={post.title}
                  width={1200}
                  height={630}
                  className="w-full h-auto object-cover"
                  priority
                />
              </div>
            )}

            {/* Header */}
            <header className="mb-8">
              <h1 className="text-4xl md:text-5xl font-bold text-[#1A2229] mb-4">
                {post.title}
              </h1>
              {post.excerpt && (
                <p className="text-xl text-[#8D8D8D] mb-4">{post.excerpt}</p>
              )}
              <div className="flex items-center gap-4 text-sm text-[#8D8D8D]">
                {post.publishedAt && (
                  <time dateTime={post.publishedAt.toISOString()}>
                    {new Date(post.publishedAt).toLocaleDateString('hy-AM', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </time>
                )}
              </div>
            </header>

            {/* Content */}
            <div
              className="prose prose-lg max-w-none prose-headings:text-[#1A2229] prose-p:text-[#222] prose-a:text-[#FA8604] prose-strong:text-[#1A2229] prose-img:rounded-[10px] prose-img:shadow-lg"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {/* Back to Blog */}
            <div className="mt-12 pt-8 border-t border-gray-200">
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 text-[#FA8604] hover:text-[#e67503] transition-colors font-medium"
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
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
                Վերադառնալ բլոգ
              </Link>
            </div>
          </article>

          {/* JSON-LD Structured Data */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          />
        </div>
      </div>
    </MainTemplate>
  );
}
