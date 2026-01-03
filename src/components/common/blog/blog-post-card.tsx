import Link from 'next/link';
import Image from 'next/image';
import { BlogPost } from '@/app/actions/admin-blogs';

interface BlogPostCardProps {
  post: BlogPost;
}

export default function BlogPostCard({ post }: BlogPostCardProps) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="bg-white rounded-[20px] shadow-[0_0_60px_30px_rgba(0,0,0,0.03)] overflow-hidden hover:shadow-[0_0_80px_40px_rgba(0,0,0,0.05)] transition-all duration-300 group"
    >
      {post.featuredImage && (
        <div className="relative w-full h-48 overflow-hidden">
          <Image
            src={post.featuredImage}
            alt={post.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}
      <div className="p-6">
        <h3 className="text-xl font-bold text-[#1A2229] mb-2 group-hover:text-[#FA8604] transition-colors line-clamp-2">
          {post.title}
        </h3>
        {post.excerpt && (
          <p className="text-[#8D8D8D] mb-4 line-clamp-3">{post.excerpt}</p>
        )}
        {post.publishedAt && (
          <time
            dateTime={post.publishedAt.toISOString()}
            className="text-sm text-[#8D8D8D]"
          >
            {new Date(post.publishedAt).toLocaleDateString('hy-AM', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </time>
        )}
      </div>
    </Link>
  );
}
