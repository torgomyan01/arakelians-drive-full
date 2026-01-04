import Link from 'next/link';
import { BlogPost } from '@/app/actions/admin-blogs';
import { SITE_URL } from '@/utils/consts';
import BlogPostCard from '@/components/common/blog/blog-post-card';

interface FeaturedBlogsProps {
  posts: BlogPost[];
}

export default function FeaturedBlogs({ posts }: FeaturedBlogsProps) {
  if (!posts || posts.length === 0) {
    return null;
  }

  // Take only first 2 posts
  const featuredPosts = posts.slice(0, 2);

  return (
    <div className="mt-[120px] mb-10 max-lg:mt-[60px]">
      <div className="flex items-center justify-between mb-8 max-md:flex-col max-md:items-start max-md:gap-4">
        <h2 className="global-title">Բլոգ</h2>
        <Link
          href={SITE_URL.BLOG}
          className="inline-flex items-center gap-2 bg-gradient-to-r from-[#FA8604] to-[#FFA64D] text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-300 font-semibold max-md:w-full max-md:justify-center"
        >
          <span>Բոլոր հոդվածները</span>
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
              d="M9 5l7 7-7 7"
            />
          </svg>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {featuredPosts.map((post) => (
          <BlogPostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}
