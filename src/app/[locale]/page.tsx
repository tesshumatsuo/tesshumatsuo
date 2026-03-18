import { useTranslations } from 'next-intl'
import Link from 'next/link'
import ContactForm from '@/components/ContactForm'

export default function Home({ params }: { params: Promise<{ locale: string }> }) {
  const t = useTranslations('home')

  return (
    <div className="mx-auto max-w-5xl px-6 py-12 md:py-24 space-y-32">

      {/* Hero Section */}
      <section className="space-y-6">
        <div className="space-y-2">
          <p className="text-gray-500 font-medium tracking-wide text-sm uppercase">{t('greeting')}</p>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-gray-900">
            Tesshu Matsuo
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 font-light mt-4">
            {t('tagline')}
          </p>
        </div>
        <p className="max-w-2xl text-lg text-gray-600 leading-relaxed pt-4">
          {t('description')}
        </p>
      </section>

      {/* Latest Articles Section */}
      <section className="space-y-8">
        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
          <h2 className="text-2xl font-bold tracking-tight">{t('latestArticles')}</h2>
          <Link href="blog" className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors">
            {t('viewAll')} &rarr;
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[1, 2, 3, 4].map((i) => (
            <Link key={i} href={`blog/placeholder-${i}`} className="block group space-y-3 p-4 -m-4 rounded-2xl hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-3 text-xs font-medium text-gray-500">
                <span className="bg-gray-100 px-2.5 py-1 rounded-full text-gray-700">Technology</span>
                <time dateTime="2026-03-15">Mar 15, 2026</time>
              </div>
              <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                The Future of Modern Web Development with Next.js and Tailwind CSS
              </h3>
              <p className="text-gray-600 line-clamp-2 leading-relaxed text-sm">
                Exploring the paradigm shifts in frontend architecture and how we build scalable knowledge platforms for the modern web.
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Categories Section */}
      <section className="space-y-8 bg-gray-50/50 p-8 md:p-12 rounded-3xl border border-gray-100">
        <h2 className="text-2xl font-bold tracking-tight text-center">{t('exploreCategory')}</h2>
        <div className="flex flex-wrap justify-center gap-3 pt-4">
          {['Business', 'Technology', 'Philosophy', 'Media', 'Capital', 'Personal'].map((cat) => (
            <Link key={cat} href={`blog?category=${cat.toLowerCase()}`} className="px-5 py-2.5 bg-white border border-gray-200 rounded-full text-sm font-medium text-gray-700 hover:border-gray-400 hover:text-black transition-all shadow-sm">
              {cat}
            </Link>
          ))}
        </div>
      </section>

      {/* Profile Section */}
      <section id="about" className="space-y-8 pt-8">
        <div className="border-t border-gray-100 pt-16 flex flex-col md:flex-row gap-12 items-start">
          <div className="w-full md:w-1/3">
            <h2 className="text-3xl font-bold tracking-tight">{t('aboutMe')}</h2>
          </div>
          <div className="w-full md:w-2/3 space-y-6 text-lg text-gray-600 leading-relaxed">
            <p>{t('aboutDesc1')}</p>
            <p>{t('aboutDesc2')}</p>
            <div className="pt-6">
              <Link href="about" className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-gray-900 hover:bg-gray-800 transition-colors shadow-sm">
                {t('readProfile')}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Works Section */}
      <section id="works" className="space-y-8 pt-16 border-t border-gray-100">
        <h2 className="text-3xl font-bold tracking-tight">{t('selectedWorks')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="rounded-2xl border border-gray-100 bg-white overflow-hidden shadow-sm hover:shadow-md transition-all">
            <div className="aspect-video bg-gray-100 flex items-center justify-center">
              <span className="text-gray-400 font-medium">Project Alpha</span>
            </div>
            <div className="p-6 space-y-2">
              <h3 className="font-bold text-gray-900 text-lg">Project Alpha</h3>
              <p className="text-gray-600 text-sm">次世代のウェブアプリケーションUIデザイン。</p>
            </div>
          </div>
          <div className="rounded-2xl border border-gray-100 bg-white overflow-hidden shadow-sm hover:shadow-md transition-all">
            <div className="aspect-video bg-gray-100 flex items-center justify-center">
              <span className="text-gray-400 font-medium">Project Beta</span>
            </div>
            <div className="p-6 space-y-2">
              <h3 className="font-bold text-gray-900 text-lg">Project Beta</h3>
              <p className="text-gray-600 text-sm">シームレスな体験を提供するモバイルアプリ。</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="space-y-8 pt-16 border-t border-gray-100">
        <div className="bg-gray-50/50 border border-gray-100 rounded-3xl p-8 md:p-12 text-center space-y-8">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold tracking-tight">{t('getInTouch')}</h2>
            <p className="text-gray-600 max-w-lg mx-auto">{t('contactDesc')}</p>
          </div>
          <div className="pt-4 flex justify-center">
            <ContactForm />
          </div>
        </div>
      </section>

    </div>
  )
}
