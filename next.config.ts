import createNextIntlPlugin from 'next-intl/plugin';
import type { NextConfig } from 'next';
 
const withNextIntl = createNextIntlPlugin();

// Slugs migrated from WordPress → Sanity
const wpSlugs = [
  'learning-ai-world', 'become-manager', 'become-photographer', 'beekeeping',
  'blog-time', 'blue-epok', 'book-report-1', 'business-stockstyle', 'chat-gpt',
  'content-marketing-fishman', 'difference-etf-index', 'education-future',
  'flashdance', 'fly-high', 'go-to-work', 'gobou-zyuku', 'graduate-from-university',
  'holiday-life', 'how-to-enjoy-life', 'how-to-find-your-life', 'invest-etf-lists',
  'investment-merit-demerit', 'j-farm', 'kamakura-2023', 'learn-programming',
  'life-article-collection', 'life-money', 'life-work', 'love-work',
  'love-work-merit-demerit', 'my-skill', 'nisa-2024', 'no-financial-literacy-japanese',
  'pluto', 'programming-business', 'project', 'reading-book', 'rich-life-easy',
  'the-essence-of-investment', 'thinking-internet-contents', 'want-investment',
  'what-is-it-skill', 'what-is-work', 'wolf-of-wallstreet', 'yugawarasouyu',
]

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
      },
    ],
  },
  async redirects() {
    // /ja/about and /en/about → /profile (301)
    const aboutRedirects = [
      { source: '/ja/about', destination: '/ja/profile', permanent: true },
      { source: '/ja/about/', destination: '/ja/profile', permanent: true },
      { source: '/en/about', destination: '/en/profile', permanent: true },
      { source: '/en/about/', destination: '/en/profile', permanent: true },
    ]
    // Map /slug and /slug/ → /ja/blog/slug (301 permanent)
    const slugRedirects = wpSlugs.flatMap((slug) => [
      {
        source: `/${slug}`,
        destination: `/ja/blog/${slug}`,
        permanent: true,
      },
      {
        source: `/${slug}/`,
        destination: `/ja/blog/${slug}`,
        permanent: true,
      },
    ])
    return [...aboutRedirects, ...slugRedirects]
  },
};
 
export default withNextIntl(nextConfig);
