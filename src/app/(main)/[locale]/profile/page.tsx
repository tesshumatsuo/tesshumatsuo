import { useTranslations } from 'next-intl'

export default function AboutPage() {
  const t = useTranslations('about')

  return (
    <div className="space-y-16 w-full max-w-3xl mx-auto">
      <header className="space-y-6 text-center">
        <div className="w-32 h-32 bg-gray-200 rounded-full mx-auto mb-8 border border-gray-100"></div>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-black">
          Tesshu Matsuo
        </h1>
        <p className="text-xl text-black font-medium">{t('tagline')}</p>
      </header>

      <article className="max-w-none space-y-8 text-black leading-loose text-lg">
        <p>
          デジタルの世界で革新的な体験を創り出しています。美しさと機能性を兼ね備えたモダンなデザインを追求し、ユーザーの心を動かすプロダクトを開発しています。
        </p>
        <p>
          私はデザインとテクノロジーの交差点に立ち、複雑な課題をシンプルで美しいインターフェースに落とし込むことを得意としています。
        </p>

        <h2 className="text-2xl font-bold mt-12 mb-6">{t('experience')}</h2>
        <div className="space-y-6">
          <div className="flex gap-4 border-l-2 border-gray-100 pl-4 py-1">
            <div className="flex-1 space-y-1">
              <h3 className="font-bold text-gray-900">Founder & Creative Director</h3>
              <p className="text-sm text-gray-500">Self-Employed &middot; 2024 - Present</p>
              <p className="text-sm text-gray-700 pt-2">Building modern platforms and knowledge bases with a focus on minimal aesthetics and robust frontend architectures.</p>
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-bold mt-12 mb-6">{t('skills')}</h2>
        <div className="flex flex-wrap gap-3">
          {['React', 'Next.js', 'Tailwind CSS', 'Figma', 'UI/UX Design', 'Sanity CMS', 'TypeScript'].map((skill) => (
            <span key={skill} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-md text-sm font-medium">
              {skill}
            </span>
          ))}
        </div>
      </article>

      <div className="border-t border-gray-100 pt-12 flex justify-center">
        <a href="mailto:hello@tesshumatsuo.com" className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-sm">
          {t('getInTouch')}
        </a>
      </div>
    </div>
  )
}
