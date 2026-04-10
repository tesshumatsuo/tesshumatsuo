import { getTranslations } from 'next-intl/server'
import ArticleCard from '@/components/ArticleCard'
import { client } from '@/sanity/lib/client'

interface BlogIndexProps {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ cat?: string }>
}

export default async function BlogIndex(props: BlogIndexProps) {
  const params = await props.params;
  const searchParams = await props.searchParams;
  
  const { cat } = searchParams;
  const { locale } = params;
  
  const t = await getTranslations({ locale, namespace: 'blog' });
  
  const langFilter = locale === 'ja' ? `(!defined(language) || language == 'ja')` : `language == '${locale}'`
  
  const query = `*[_type == "post" && ${langFilter} ${cat ? '&& $cat in categories[]->slug.current' : ''}] | order(publishedAt desc) {
    _id,
    title,
    excerpt,
    "slug": slug.current,
    "date": publishedAt,
    "category": categories[0]->title,
    "imageUrl": coalesce(mainImage.asset->url, body[_type == "image"][0].asset->url)
  }`
  
  const articles = await client.fetch(query, { cat: cat || null })

  const categoryTitles: Record<string, string> = {
    'investment': 'Investment',
    'book': 'Book',
    'movie': 'Movie',
    'camera': 'Camera',
    'travel': 'Travel',
    'programming': 'Programming',
    'marketing': 'Marketing',
    'english': 'English',
    'werock': 'We Rock',
    'blifestudio': 'B LIFE STUDIO',
    'jfarm': 'J FARM',
    'blueepok': 'BLUE EPOK',
    'flyhigh': 'FLY HIGH',
    'gobojuku': 'ごぼう塾',
  }
  
  const displayTitle = cat ? (categoryTitles[cat] || cat) : t('title')

  return (
    <div className="mx-auto max-w-3xl px-6 py-12 md:py-24 space-y-16">
      <header className="space-y-4">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 capitalize">
          {displayTitle}
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl leading-relaxed font-light">
          {cat ? `Articles in ${displayTitle}` : t('description')}
        </p>
      </header>

      {articles.length > 0 ? (
        <div className="space-y-16">
          {articles.map((post: any) => (
            <ArticleCard 
              key={post._id}
              locale={locale}
              title={post.title}
              excerpt={post.excerpt}
              slug={post.slug}
              date={post.date}
              category={post.category}
              imageUrl={post.imageUrl}
            />
          ))}
        </div>
      ) : (
        <div className="text-gray-500 py-12 text-center border border-dashed rounded-xl border-gray-200">
          No articles found for this category yet.
        </div>
      )}
    </div>
  )
}
