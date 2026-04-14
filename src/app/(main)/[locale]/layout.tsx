import type { Metadata } from 'next'
import { Inter, Noto_Serif_JP } from 'next/font/google'
import '@/app/globals.css'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { routing } from '@/i18n/routing'
import { localeCodes } from '@/i18n/locales'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Sidebar from '@/components/Sidebar'

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
})

const notoSerifJP = Noto_Serif_JP({
  variable: '--font-noto-serif-jp',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '900'],
})

export const metadata: Metadata = {
  title: 'Tesshu Matsuo',
  description: 'Tesshu Matsuo Personal Media and Knowledge Base',
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  if (!localeCodes.includes(locale as (typeof localeCodes)[number])) {
    notFound()
  }

  const messages = await getMessages()

  return (
    <html lang={locale}>
      <body className={`${inter.variable} ${notoSerifJP.variable} antialiased min-h-screen bg-[#f3f4f5] text-gray-900 font-sans flex flex-col`}>
        <NextIntlClientProvider messages={messages}>

          <Header locale={locale} />
          <main className="flex-1 w-full max-w-[1240px] mx-auto px-4 sm:px-6 py-8 md:py-10 flex flex-col md:flex-row gap-6 md:gap-8 items-start">
            <div className="w-full md:w-[70%] lg:w-[72%] bg-white p-6 md:p-10 shadow-sm border border-gray-100 rounded-sm">
              {children}
            </div>
            <aside className="w-full md:w-[30%] lg:w-[28%] shrink-0">
              <Sidebar locale={locale} />
            </aside>
          </main>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
