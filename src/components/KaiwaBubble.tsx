import React from 'react'
import { PortableText } from '@portabletext/react'
import Image from 'next/image'

export default function KaiwaBubble({ value, components }: any) {
  const { direction, content } = value
  // WPの指定 (r=右寄せ 等) に合わせて左右の配置を切り替えます
  const isRight = direction === 'r'

  // Decide styles based on direction
  const bubbleBg = isRight ? 'bg-[#f0f8ff]' : 'bg-gray-50'
  const tailPos = isRight ? '-right-2' : '-left-2'
  const flexDir = isRight ? 'flex-row-reverse' : 'flex-row'

  // 「。」の後の余分なスペースや改行処理は、page.tsx側で全体に対して適用済みのためそのまま使用
  
  return (
    <div className={`flex w-full my-8 ${isRight ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex w-full items-start gap-4 sm:gap-6 ${flexDir}`}>
        
        {/* Avatar */}
        <div className="flex flex-col items-center shrink-0 w-16">
          <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full overflow-hidden bg-white shadow-sm border border-gray-100 flex items-center justify-center p-1">
             {/* Using generic logo as an avatar for now. Ideally pass author image if possible */}
             <Image src="/avatar.png" alt="Avatar" width={64} height={64} className="object-contain w-full h-full rounded-full" />
          </div>
          <span className="text-[10px] sm:text-xs text-gray-500 mt-2 font-medium tracking-wide">Tesshu</span>
        </div>

        {/* Chat Bubble */}
        <div className={`relative w-full max-w-[85%] sm:max-w-[75%] rounded-2xl p-3 sm:p-4 text-gray-800 ${bubbleBg}`}>
          {/* Arrow / Tail */}
          <div className={`absolute top-6 w-5 h-5 transform rotate-45 ${bubbleBg} ${tailPos}`} />
          
          <div className="relative z-10 prose prose-sm max-w-none leading-relaxed whitespace-pre-wrap prose-p:my-1 [&_p:last-child]:mb-0">
            <PortableText value={content} components={components} />
          </div>
        </div>

      </div>
    </div>
  )
}
