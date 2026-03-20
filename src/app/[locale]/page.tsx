import { getTranslations } from 'next-intl/server'
import Link from 'next/link'
import Image from 'next/image'
import ContactForm from '@/components/ContactForm'
import ArticleCard from '@/components/ArticleCard'
import { client } from '@/sanity/lib/client'

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'home' })

  // Fetch the latest 4 published articles
  const query = `*[_type == "post"] | order(publishedAt desc)[0...4] {
    title,
    excerpt,
    "slug": slug.current,
    "date": publishedAt,
    "category": categories[0]->title,
    "imageUrl": coalesce(mainImage.asset->url, body[_type == "image"][0].asset->url)
  }`
  const latestArticles = await client.fetch(query)

  // Fetch Life category articles
  const lifeQuery = `*[_type == "post" && "life" in categories[]->slug.current] | order(publishedAt desc)[0...5] {
    title, excerpt, "slug": slug.current, "date": publishedAt, "category": categories[0]->title, "imageUrl": coalesce(mainImage.asset->url, body[_type == "image"][0].asset->url)
  }`
  const lifeArticles = await client.fetch(lifeQuery)

  // Fetch Book category articles
  const bookQuery = `*[_type == "post" && "book" in categories[]->slug.current] | order(publishedAt desc)[0...5] {
    title, excerpt, "slug": slug.current, "date": publishedAt, "category": categories[0]->title, "imageUrl": coalesce(mainImage.asset->url, body[_type == "image"][0].asset->url)
  }`
  const bookArticles = await client.fetch(bookQuery)

  // Fetch Movie category articles
  const movieQuery = `*[_type == "post" && "movie" in categories[]->slug.current] | order(publishedAt desc)[0...5] {
    title, excerpt, "slug": slug.current, "date": publishedAt, "category": categories[0]->title, "imageUrl": coalesce(mainImage.asset->url, body[_type == "image"][0].asset->url)
  }`
  const movieArticles = await client.fetch(movieQuery)

  return (
    <div className="space-y-16">

      {/* Banner Image */}
      <div className="w-full overflow-hidden rounded-sm -mt-2 mb-6">
        <Image src="/tesshu.png" alt="Tesshu Banner" width={900} height={300} className="w-full h-auto object-cover" priority />
      </div>

      {/* Hero Section */}
      <section className="flex flex-row items-center gap-5 pb-8 border-b border-gray-100">
        {/* Avatar - small */}
        <div className="shrink-0">
          <Image src="/avatar.png" alt="Profile" width={72} height={72} priority className="rounded-full border-2 border-gray-100 object-cover w-16 h-16 md:w-[72px] md:h-[72px]" />
        </div>
        {/* Text */}
        <div className="space-y-1">
          <h1 className="text-lg md:text-xl font-bold tracking-tight text-gray-900 whitespace-nowrap">
            Tesshu Matsuo
          </h1>
          <p className="text-[10px] md:text-xs text-gray-700 tracking-wide">
            起業家 / クリエイター / AI エンジニア
          </p>
          <p className="text-[10px] md:text-[11px] text-gray-600 leading-relaxed max-w-sm">
            ビジネス、テクノロジー、哲学、デザインの交差点を探求する<br />パーソナルメディアとナレッジベース。
          </p>
        </div>
      </section>

      {/* Latest Articles Section */}
      <section className="space-y-8">
        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
          <h2 className="text-2xl font-bold tracking-tight">{t('latestArticles')}</h2>
          <Link href={`/${locale}/blog`} className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors">
            {t('viewAll')} &rarr;
          </Link>
        </div>
        {latestArticles && latestArticles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {latestArticles.map((article: any) => (
              <ArticleCard 
                key={article.slug}
                locale={locale}
                title={article.title}
                excerpt={article.excerpt}
                slug={article.slug}
                date={article.date}
                category={article.category}
                imageUrl={article.imageUrl}
              />
            ))}
          </div>
        ) : (
          <div className="text-gray-500 text-sm">{t('latestArticles')}はありません。</div>
        )}
      </section>

      {/* Featured Categories Section */}
      <section className="space-y-8 bg-gray-50/50 p-8 md:p-12 rounded-3xl border border-gray-100">
        <h2 className="text-2xl font-bold tracking-tight text-center">{t('exploreCategory')}</h2>
        <div className="flex flex-wrap justify-center gap-3 pt-4">
          {['investment', 'book', 'programming', 'marketing', 'english'].map((cat) => (
            <Link key={cat} href={`/${locale}/blog?cat=${cat}`} className="px-5 py-2.5 bg-white border border-gray-200 rounded-full text-sm font-medium text-gray-700 hover:border-gray-400 hover:text-black transition-all shadow-sm capitalize">
              {cat}
            </Link>
          ))}
        </div>
      </section>

      {/* Life category articles */}
      {lifeArticles?.length > 0 && (
        <section className="space-y-4 pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold tracking-tight">Life</h2>
            <Link href={`/${locale}/blog?cat=life`} className="text-xs text-gray-500 hover:text-[#4175a4]">すべて見る →</Link>
          </div>
          <div className="grid grid-cols-1 gap-2">
            {lifeArticles.map((article: any) => (
              <ArticleCard key={article.slug} locale={locale} title={article.title} excerpt={article.excerpt} slug={article.slug} date={article.date} category={article.category} imageUrl={article.imageUrl} />
            ))}
          </div>
        </section>
      )}

      {/* Book category articles */}
      {bookArticles?.length > 0 && (
        <section className="space-y-4 pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold tracking-tight">Book</h2>
            <Link href={`/${locale}/blog?cat=book`} className="text-xs text-gray-500 hover:text-[#4175a4]">すべて見る →</Link>
          </div>
          <div className="grid grid-cols-1 gap-2">
            {bookArticles.map((article: any) => (
              <ArticleCard key={article.slug} locale={locale} title={article.title} excerpt={article.excerpt} slug={article.slug} date={article.date} category={article.category} imageUrl={article.imageUrl} />
            ))}
          </div>
        </section>
      )}

      {/* Movie category articles */}
      {movieArticles?.length > 0 && (
        <section className="space-y-4 pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold tracking-tight">Movie</h2>
            <Link href={`/${locale}/blog?cat=movie`} className="text-xs text-gray-500 hover:text-[#4175a4]">すべて見る →</Link>
          </div>
          <div className="grid grid-cols-1 gap-2">
            {movieArticles.map((article: any) => (
              <ArticleCard key={article.slug} locale={locale} title={article.title} excerpt={article.excerpt} slug={article.slug} date={article.date} category={article.category} imageUrl={article.imageUrl} />
            ))}
          </div>
        </section>
      )}

    </div>
  )
}
