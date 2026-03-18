import Link from 'next/link'
import CategoryBadge from '@/components/CategoryBadge'

export default function ArticlePage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-12 md:py-24 space-y-12">
      <Link href="../blog" className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors inline-block mb-4">
        &larr; Back to all articles
      </Link>

      <header className="space-y-6">
        <div className="flex items-center gap-3 text-xs font-medium text-gray-500">
          <CategoryBadge name="Technology" />
          <time dateTime="2026-03-15">Mar 15, 2026</time>
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 leading-tight">
          The Future of Modern Web Development with Next.js and Tailwind CSS
        </h1>
      </header>

      <div className="w-full aspect-[16/9] bg-gray-100 rounded-2xl flex items-center justify-center border border-gray-200">
        <span className="text-gray-400 font-medium">Featured Image Placeholder</span>
      </div>

      <div className="flex flex-col md:flex-row gap-12 items-start pt-8">
        <article className="max-w-none md:w-3/4 space-y-8 text-gray-800 leading-loose">
          <p className="text-xl text-gray-600 font-light pb-4 border-b border-gray-100">
            Exploring the paradigm shifts in frontend architecture and how we build scalable knowledge platforms for the modern web.
          </p>
          <h2 className="text-2xl font-bold mt-12 mb-6">The Evolution of the Stack</h2>
          <p>
            When we think about building personal media platforms, the goal is longevity, readability, and speed. Gone are the days of heavy WordPress installations dominating the creator space.
          </p>
          <blockquote className="border-l-4 border-blue-600 pl-6 italic text-gray-700 my-8 py-2">
            "Design architecture is as critical as data architecture. A predictable presentation layer unlocks scaling."
          </blockquote>
        </article>

        <aside className="hidden md:block md:w-1/4 sticky top-24 space-y-8">
          <div>
            <h4 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wider">On this page</h4>
            <ul className="space-y-3 text-sm text-gray-500 font-medium">
              <li className="text-blue-600"><a href="#">The Evolution of the Stack</a></li>
            </ul>
          </div>
          <div className="pt-6 border-t border-gray-100">
            <h4 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wider">Share</h4>
            <div className="flex gap-4">
              <button className="text-gray-400 hover:text-blue-500 transition-colors text-sm">Twitter</button>
              <button className="text-gray-400 hover:text-blue-700 transition-colors text-sm">LinkedIn</button>
            </div>
          </div>
        </aside>
      </div>

      <div className="mt-24 bg-gray-50 border border-gray-100 rounded-2xl p-8 flex items-start gap-6">
        <div className="w-16 h-16 rounded-full bg-gray-200 shrink-0"></div>
        <div className="space-y-2">
          <h3 className="font-bold text-gray-900">Tesshu Matsuo</h3>
          <p className="text-gray-600 text-sm leading-relaxed">
            Creator, Innovator, and Developer exploring the intersections of business and technology.
          </p>
        </div>
      </div>
    </div>
  )
}
