import { useTranslations } from 'next-intl'
import ArticleCard from '@/components/ArticleCard'

export default function BlogIndex() {
  const t = useTranslations('blog')

  const articles = [
    {
      title: 'The Future of Modern Web Development with Next.js and Tailwind CSS',
      excerpt: 'Exploring the paradigm shifts in frontend architecture and how we build scalable knowledge platforms for the modern web.',
      slug: 'future-web-development',
      date: 'Mar 15, 2026',
      category: 'Technology'
    },
    {
      title: 'Mental Models for Entrepreneurs in the AI Era',
      excerpt: 'How to think about product strategy, resource allocation, and team building when artificial intelligence changes the cost structure of software.',
      slug: 'mental-models-ai-era',
      date: 'Feb 28, 2026',
      category: 'Business'
    },
    {
      title: 'Designing for Readability: The Typography of Knowledge',
      excerpt: 'A deep dive into why whitespace, line height, and font choices matter more than flashy interactions when building a platform for deep thinking.',
      slug: 'designing-readability-typography',
      date: 'Jan 14, 2026',
      category: 'Philosophy'
    },
    {
      title: 'Capital Allocation Strategies for Bootstrapped Startups',
      excerpt: 'Lessons learned from scaling a profitable media business without external funding, and when it makes sense to take venture capital.',
      slug: 'capital-allocation-bootstrapped',
      date: 'Dec 05, 2025',
      category: 'Capital'
    }
  ]

  return (
    <div className="mx-auto max-w-3xl px-6 py-12 md:py-24 space-y-16">
      <header className="space-y-4">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900">{t('title')}</h1>
        <p className="text-xl text-gray-600 max-w-2xl leading-relaxed font-light">
          {t('description')}
        </p>
      </header>

      <div className="border-b border-gray-100 pb-4 flex gap-6 text-sm font-medium overflow-x-auto whitespace-nowrap">
        <button className="text-gray-900 border-b-2 border-gray-900 pb-2">{t('all')}</button>
        <button className="text-gray-500 hover:text-gray-900 transition-colors pb-2 cursor-pointer">Business</button>
        <button className="text-gray-500 hover:text-gray-900 transition-colors pb-2 cursor-pointer">Technology</button>
        <button className="text-gray-500 hover:text-gray-900 transition-colors pb-2 cursor-pointer">Philosophy</button>
      </div>

      <div className="space-y-16">
        {articles.map((article) => (
          <ArticleCard key={article.slug} {...article} />
        ))}
      </div>
    </div>
  )
}
