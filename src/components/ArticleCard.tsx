import Link from 'next/link'
import CategoryBadge from './CategoryBadge'

interface ArticleCardProps {
  title: string
  excerpt: string
  slug: string
  date: string
  category: string
}

export default function ArticleCard({ title, excerpt, slug, date, category }: ArticleCardProps) {
  return (
    <Link 
      href={`/blog/${slug}`} 
      className="block group space-y-3 p-5 -m-5 rounded-2xl hover:bg-gray-50 transition-colors"
    >
      <div className="flex items-center gap-3 text-xs font-medium text-gray-500">
        <CategoryBadge name={category} />
        <time dateTime={date}>{date}</time>
      </div>
      <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
        {title}
      </h3>
      <p className="text-gray-600 line-clamp-2 leading-relaxed text-sm">
        {excerpt}
      </p>
      <div className="pt-2">
        <span className="text-sm font-medium text-blue-600 group-hover:text-blue-800 flex items-center gap-1 transition-colors">
          Read article <span className="opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0 transition-all">&rarr;</span>
        </span>
      </div>
    </Link>
  )
}
