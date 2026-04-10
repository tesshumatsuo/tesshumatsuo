import Link from 'next/link'
import Image from 'next/image'
import { getTranslations } from 'next-intl/server'

export default async function Sidebar({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: 'home' })

  // Categories placeholder for now (or could fetch dynamically if preferred)
  const categories = [
    { title: t('sidebarCatAI'), slug: 'ai' },
    { title: t('sidebarCatInvest'), slug: 'investment' },
    { title: t('sidebarCatBook'), slug: 'book' },
    { title: t('sidebarCatProg'), slug: 'programming' }
  ]

  return (
    <div className="space-y-6">
      {/* Profile Widget */}
      <div className="bg-white shadow-sm border border-gray-100 p-6 md:p-8 flex flex-col items-center text-center space-y-4">
        <Image src="/avatar.png" alt="Tesshu Matsuo" width={100} height={100} className="w-24 h-24 rounded-full border border-gray-100 object-cover" />
        <div className="space-y-1">
          <h3 className="text-lg font-bold text-gray-900">Tesshu Matsuo</h3>
          <p className="text-sm text-gray-500 font-medium">{t('tagline')}</p>
        </div>
        <p className="text-sm text-gray-600 leading-relaxed text-left">
          {t('sidebarDesc1')}<br />
          {t('sidebarDesc2')}
        </p>

        {/* SNS Icons */}
        <div className="flex gap-3 justify-center">
          <a href="https://twitter.com/tesshu_matsuo" target="_blank" rel="noopener noreferrer"
            className="w-10 h-10 rounded-full bg-[#1DA1F2] flex items-center justify-center hover:opacity-80 transition-opacity">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="white">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.259 5.63L18.244 2.25zM17.083 19.77h1.833L7.084 4.126H5.117L17.083 19.77z"/>
            </svg>
          </a>
          <a href="https://instagram.com/tesshu_matsuo" target="_blank" rel="noopener noreferrer"
            className="w-10 h-10 rounded-full bg-gradient-to-br from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] flex items-center justify-center hover:opacity-80 transition-opacity">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="white">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
            </svg>
          </a>
          <a href="https://youtube.com/@tesshu_matsuo" target="_blank" rel="noopener noreferrer"
            className="w-10 h-10 rounded-full bg-[#FF0000] flex items-center justify-center hover:opacity-80 transition-opacity">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="white">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
            </svg>
          </a>
          {/* Apple Podcasts style icon - next to YouTube */}
          <a href="https://open.spotify.com/show/1gWAOcd4KWxx5hil36Fs9a?si=73-1jminTby21oyvrkJhtA" target="_blank" rel="noopener noreferrer"
            className="w-10 h-10 rounded-full bg-[#9933CC] flex items-center justify-center hover:opacity-80 transition-opacity">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="9" y="2" width="6" height="12" rx="3"/>
              <path d="M5 11a7 7 0 0 0 14 0"/>
              <line x1="12" y1="18" x2="12" y2="22"/>
              <line x1="9" y1="22" x2="15" y2="22"/>
            </svg>
          </a>
          <a href="/feed.xml" target="_blank" rel="noopener noreferrer"
            className="w-10 h-10 rounded-full bg-[#4CAF50] flex items-center justify-center hover:opacity-80 transition-opacity">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="white">
              <path d="M6.18 15.64a2.18 2.18 0 0 1 2.18 2.18C8.36 19.01 7.38 20 6.18 20C4.98 20 4 19.01 4 17.82a2.18 2.18 0 0 1 2.18-2.18M4 4.44A15.56 15.56 0 0 1 19.56 20h-2.83A12.73 12.73 0 0 0 4 7.27V4.44m0 5.66a9.9 9.9 0 0 1 9.9 9.9h-2.83A7.07 7.07 0 0 0 4 12.93V10.1z"/>
            </svg>
          </a>
        </div>

        <Link 
          href={`/${locale}/profile`}
          className="w-full inline-block bg-white hover:bg-gray-50 border-2 border-gray-800 !text-black font-bold py-3 px-4 rounded transition-colors text-center"
        >
          {t('sidebarProfileBtn')}
        </Link>
      </div>

      {/* Categories Widget */}
      <div className="bg-white shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4 pb-2 border-b-2 border-gray-100 border-l-4 border-l-[#4175a4] pl-3">
          {t('categoriesTitle')}
        </h3>
        <ul className="space-y-2">
          {categories.map((cat, idx) => (
            <li key={idx} className="border-b border-gray-50 last:border-0 pb-2 last:pb-0">
              <Link href={`/${locale}/blog?cat=${cat.slug}`} className="text-gray-700 hover:text-[#4175a4] hover:underline transition-colors block text-sm">
                {'>'} {cat.title}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Recommended/Twitter Widget placeholder */}
      <div className="bg-white shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4 pb-2 border-b-2 border-gray-100 border-l-4 border-l-[#4175a4] pl-3">
          {t('noticeTitle')}
        </h3>
        <div className="text-sm text-gray-600 leading-relaxed">
          {t('noticeDesc')}
        </div>
      </div>
    </div>
  )
}
