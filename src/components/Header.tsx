'use client'

import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { usePathname, useRouter } from 'next/navigation'
import { supportedLocales } from '@/i18n/locales'

export default function Header({ locale }: { locale: string }) {
  const t = useTranslations('nav')
  const pathname = usePathname()
  const router = useRouter()

  const switchLanguage = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLocale = e.target.value
    const newPath = pathname.replace(`/${locale}`, `/${newLocale}`)
    router.push(newPath)
  }

  type MenuItem = { label: string; href?: string; target?: string; dropdown?: { label: string; href: string }[] }
  const menuConfig: MenuItem[] = [
    { label: t('all'), href: `/${locale}/blog` },
    { 
      label: t('life'), 
      dropdown: [
        { label: t('categories.investment'), href: `/${locale}/blog?cat=investment` },
        { label: t('categories.book'), href: `/${locale}/blog?cat=book` },
        { label: t('categories.movie'), href: `/${locale}/blog?cat=movie` },
        { label: t('categories.camera'), href: `/${locale}/blog?cat=camera` },
        { label: t('categories.travel'), href: `/${locale}/blog?cat=travel` },
      ]
    },
    { 
      label: t('it'), 
      dropdown: [
        { label: t('categories.programming'), href: `/${locale}/blog?cat=programming` },
        { label: t('categories.marketing'), href: `/${locale}/blog?cat=marketing` },
      ]
    },
    { 
      label: t('language'), 
      dropdown: [
        { label: t('categories.english'), href: `/${locale}/blog?cat=english` },
      ]
    },
    { 
      label: t('project'), 
      dropdown: [
        { label: "We Rock", href: `/${locale}/blog?cat=werock` },
        { label: "B LIFE STUDIO", href: `/${locale}/blog?cat=blifestudio` },
        { label: "J FARM", href: `/${locale}/blog?cat=jfarm` },
        { label: "BLUE EPOK", href: `/${locale}/blog?cat=blueepok` },
        { label: "FLY HIGH", href: `/${locale}/blog?cat=flyhigh` },
        { label: "ごぼう塾", href: `/${locale}/blog?cat=gobojuku` },
      ]
    },
    { label: 'Podcast', href: `/${locale}/blog?cat=podcast` },
    { label: t('profile'), href: `/${locale}/profile` },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/80 backdrop-blur-md">
      <div className="mx-auto max-w-6xl px-6 flex h-16 items-center justify-between">
        <Link href={`/${locale}`} className="text-xl font-bold tracking-tight text-gray-900 hover:text-gray-600 transition-colors shrink-0">
          Tesshu Matsuo
        </Link>
        
        <nav className="hidden md:flex items-center gap-1">
          {menuConfig.map((item, idx) => (
            <div key={idx} className="relative group px-3 py-2">
              {item.dropdown ? (
                <>
                  <button className="text-sm font-medium text-gray-600 group-hover:text-black transition-colors flex items-center gap-1">
                    {item.label}
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="opacity-40 group-hover:rotate-180 transition-transform duration-200">
                      <path d="m6 9 6 6 6-6"/>
                    </svg>
                  </button>
                  {/* Dropdown Menu */}
                  <div className="absolute left-0 top-full pt-2 opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-200 ease-out">
                    <div className="bg-white border border-gray-100 shadow-xl rounded-xl p-2 min-w-[160px]">
                      {item.dropdown.map((sub, sIdx) => (
                        <Link 
                          key={sIdx} 
                          href={sub.href}
                          className="block px-4 py-2 text-sm text-gray-600 hover:text-black hover:bg-gray-50 rounded-lg transition-colors"
                        >
                          {sub.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <Link 
                  href={item.href || '#'} 
                  target={item.target} 
                  rel={item.target === '_blank' ? 'noopener noreferrer' : undefined}
                  className="text-sm font-medium text-gray-600 hover:text-black transition-colors"
                >
                  {item.label}
                </Link>
              )}
            </div>
          ))}

          <div className="w-px h-4 bg-gray-200 mx-3" />

          {/* Language toggle */}
          <select
            value={locale}
            onChange={switchLanguage}
            className="text-[10px] font-bold tracking-widest text-gray-400 hover:text-black border border-gray-200 rounded-md py-1 transition-colors uppercase ml-2 bg-transparent focus:outline-none cursor-pointer"
          >
            {supportedLocales.map((language) => (
              <option key={language.code} value={language.code} className="text-black uppercase">{language.label}</option>
            ))}
          </select>
        </nav>

        {/* Mobile menu button */}
        <div className="flex items-center gap-1 md:hidden">
          <select
            value={locale}
            onChange={switchLanguage}
            className="text-[10px] font-bold tracking-widest text-gray-400 hover:text-black border border-gray-200 rounded-md py-1 uppercase bg-transparent focus:outline-none cursor-pointer"
          >
            {supportedLocales.map((language) => (
              <option key={language.code} value={language.code} className="text-black uppercase">{language.label}</option>
            ))}
          </select>
          <button className="p-2 text-gray-600 hover:text-black" aria-label="Menu">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/>
            </svg>
          </button>
        </div>
      </div>
    </header>
  )
}

