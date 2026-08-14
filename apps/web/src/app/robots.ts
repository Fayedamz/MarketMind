import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://marketmind.com'

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/profile/', '/portfolio/'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
