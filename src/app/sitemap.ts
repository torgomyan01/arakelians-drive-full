import { SITE_URL } from '@/utils/consts';
import { headers } from 'next/headers';
import { MetadataRoute } from 'next';
import { getAllBlogPosts } from '@/app/actions/admin-blogs';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const headersList = await headers();
  const host = await headersList.get('host');
  const proto = (await headersList.get('x-forwarded-proto')) || 'https';
  const baseUrl = `${proto}://${host}`;

  // Get published blog posts
  const blogPosts = await getAllBlogPosts(false);

  const blogUrls: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: post.updatedAt,
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  return [
    {
      url: `${baseUrl}${SITE_URL.HOME}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}${SITE_URL.BLOG}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    ...blogUrls,
  ];
}
