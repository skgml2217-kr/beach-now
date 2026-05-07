import type { MetadataRoute } from 'next';
import { MOCK_BEACHES } from '@/lib/mockData';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://beach-now.vercel.app';

  const beachUrls = MOCK_BEACHES.map((beach) => ({
    url: `${baseUrl}/beach/${beach.id}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.8,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/list`,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 0.9,
    },
    ...beachUrls,
  ];
}
