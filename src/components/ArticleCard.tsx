import Link from 'next/link'
import CategoryBadge from './CategoryBadge'

import Image from 'next/image'

interface ArticleCardProps {
  title: string
  excerpt?: string
  slug: string
  date?: string
  category?: string
  locale: string
  imageUrl?: string
}

export default function ArticleCard({ title, excerpt, slug, date, category, locale, imageUrl }: ArticleCardProps) {
  // Format date if it exists
  const formattedDate = date ? new Date(date).toLocaleDateString(locale === 'ja' ? 'ja-JP' : 'en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }) : ''

  return (
    <Link 
      href={`/${locale}/blog/${slug}`} 
      className="flex flex-col sm:flex-row gap-5 p-4 -mx-4 rounded-xl hover:bg-gray-50 transition-colors group"
    >
      {/* Thumbnail */}
      <div className="w-20 h-20 sm:w-24 sm:h-24 shrink-0 bg-gray-200 border border-gray-100 overflow-hidden relative rounded-lg">
        {imageUrl ? (
          <Image src={imageUrl} alt={title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" sizes="(max-width: 640px) 100vw, 144px" />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 text-xs">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mb-2 opacity-50"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
            No Image
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col justify-center space-y-2">
        <h3 className="text-sm md:text-base font-bold text-gray-900 group-hover:text-[#4175a4] transition-colors line-clamp-2">
          {title}
        </h3>
        <p className="text-gray-500 line-clamp-2 leading-relaxed text-[13px] md:text-sm">
          {excerpt || ''}
        </p>
        <div className="flex items-center gap-3 text-xs font-medium text-gray-400 pt-1">
          {formattedDate && <time dateTime={date}>{formattedDate}</time>}
          <span className="w-1 h-1 rounded-full bg-gray-300" />
          <CategoryBadge name={category || 'Uncategorized'} />
        </div>
      </div>
    </Link>
  )
}

