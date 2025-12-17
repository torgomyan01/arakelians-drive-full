import { SITE_URL } from '@/utils/consts';
import { headers } from 'next/headers';
import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const headersList = await headers();
  const host = await headersList.get('host');
  const proto = (await headersList.get('x-forwarded-proto')) || 'https';
  const baseUrl = `${proto}://${host}`;

  return [
    {
      url: `${baseUrl}ssss`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ];
}
