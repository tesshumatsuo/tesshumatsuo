'use client'

import { useEffect } from 'react'

interface TwitterEmbedProps {
  url: string
}

export default function TwitterEmbed({ url }: TwitterEmbedProps) {
  useEffect(() => {
    // Load Twitter widget script if not already loaded
    const existingScript = document.querySelector('script[src="https://platform.twitter.com/widgets.js"]')
    if (!existingScript) {
      const script = document.createElement('script')
      script.src = 'https://platform.twitter.com/widgets.js'
      script.async = true
      script.charset = 'utf-8'
      document.body.appendChild(script)
    } else {
      // If script already loaded, re-run the widget loader
      if ((window as any).twttr?.widgets) {
        (window as any).twttr.widgets.load()
      }
    }
  }, [url])

  return (
    <div className="my-8 flex justify-center w-full">
      <blockquote className="twitter-tweet" data-dnt="true">
        <a href={url}>ツイートを読み込んでいます…</a>
      </blockquote>
    </div>
  )
}
