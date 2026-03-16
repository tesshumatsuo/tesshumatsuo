import Image from 'next/image'

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-12 md:py-24 space-y-16">
      <header className="space-y-6 text-center">
        <div className="w-32 h-32 bg-gray-200 rounded-full mx-auto mb-8 border border-gray-100"></div>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900">
          Tesshu Matsuo
        </h1>
        <p className="text-xl text-gray-600 font-light">
          Creator / Innovator / Developer
        </p>
      </header>
      
      <article className="prose prose-lg prose-gray max-w-none space-y-8 text-gray-800 leading-loose">
        <p>
          デジタルの世界で革新的な体験を創り出しています。美しさと機能性を兼ね備えたモダンなデザインを追求し、ユーザーの心を動かすプロダクトを開発しています。
        </p>
        <p>
          私はデザインとテクノロジーの交差点に立ち、複雑な課題をシンプルで美しいインターフェースに落とし込むことを得意としています。常に最新の技術とデザイントレンドを取り入れ、妥協のない品質を提供することを目標としています。
        </p>

        <h2 className="text-2xl font-bold mt-12 mb-6">Experience</h2>
        <div className="space-y-6">
          <div className="flex gap-4 border-l-2 border-gray-100 pl-4 py-1">
            <div className="flex-1 space-y-1">
              <h3 className="font-bold text-gray-900">Founder & Creative Director</h3>
              <p className="text-sm text-gray-500">Self-Employed &middot; 2024 - Present</p>
              <p className="text-sm text-gray-700 pt-2">Building modern platforms and knowledge bases. Focusing on minimal aesthetics, modern typography, and robust frontend architectures.</p>
            </div>
          </div>
          <div className="flex gap-4 border-l-2 border-gray-100 pl-4 py-1">
            <div className="flex-1 space-y-1">
              <h3 className="font-bold text-gray-900">Lead UI/UX Designer</h3>
              <p className="text-sm text-gray-500">Tech Agency &middot; 2021 - 2024</p>
              <p className="text-sm text-gray-700 pt-2">Led the redesign of several enterprise products, implementing component-driven design systems and improving overall user retention.</p>
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-bold mt-12 mb-6">Skills & Tools</h2>
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
          Get In Touch
        </a>
      </div>
    </div>
  )
}
