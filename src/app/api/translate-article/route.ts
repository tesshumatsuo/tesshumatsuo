import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@sanity/client'
import { translationTargetLocales } from '@/i18n/locales'

const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2026-03-14',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
})

// Recursively extract all text spans from a PortableText body
function extractTextBlocks(body: any[]): { path: string; text: string }[] {
  const result: { path: string; text: string }[] = []
  body.forEach((block, bi) => {
    if (block._type === 'block' && Array.isArray(block.children)) {
      block.children.forEach((child: any, ci: number) => {
        if (child._type === 'span' && typeof child.text === 'string' && child.text.trim()) {
          result.push({ path: `${bi}.${ci}`, text: child.text })
        }
      })
    }
    // kaiwa (dialog) has speaker + text fields
    if (block._type === 'kaiwa') {
      if (block.text) result.push({ path: `${bi}.kaiwaText`, text: block.text })
      if (block.speaker) result.push({ path: `${bi}.kaiwaSpeaker`, text: block.speaker })
    }
    // box / check types have a text field  
    if ((block._type === 'box' || block._type === 'check') && block.text) {
      result.push({ path: `${bi}.boxText`, text: block.text })
    }
    if (block._type === 'toc' && block.title) {
      result.push({ path: `${bi}.tocTitle`, text: block.title })
    }
    if (block._type === 'linkCard' && block.title) {
      result.push({ path: `${bi}.linkCardTitle`, text: block.title })
    }
  })
  return result
}

// Rebuild translated body with new text inserted
function applyTranslations(body: any[], translations: Record<string, string>): any[] {
  return body.map((block, bi) => {
    if (block._type === 'block' && Array.isArray(block.children)) {
      return {
        ...block,
        children: block.children.map((child: any, ci: number) => {
          const key = `${bi}.${ci}`
          return translations[key] ? { ...child, text: translations[key] } : child
        })
      }
    }
    if (block._type === 'kaiwa') {
      return {
        ...block,
        text: translations[`${bi}.kaiwaText`] ?? block.text,
        speaker: translations[`${bi}.kaiwaSpeaker`] ?? block.speaker,
      }
    }
    if ((block._type === 'box' || block._type === 'check') && block.text) {
      return { ...block, text: translations[`${bi}.boxText`] ?? block.text }
    }
    if (block._type === 'toc' && block.title) {
      return { ...block, title: translations[`${bi}.tocTitle`] ?? block.title }
    }
    if (block._type === 'linkCard' && block.title) {
      return { ...block, title: translations[`${bi}.linkCardTitle`] ?? block.title }
    }
    // images, youtube, spotify, instagram, twitter — pass through unchanged
    return block
  })
}

async function translateBatch(
  texts: string[],
  targetLang: string,
  apiKey: string
): Promise<string[]> {
  if (texts.length === 0) return []

  const numbered = texts.map((t, i) => `[${i}] ${t}`).join('\n')

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `You are a professional translator. Translate the following numbered text items from Japanese to ${targetLang}. Preserve the [N] numbering exactly. Return ONLY the translated lines with the same [N] prefix, nothing else. Do not add explanations.`
        },
        { role: 'user', content: numbered }
      ],
      temperature: 0.3,
    })
  })

  if (!response.ok) {
    const err = await response.text()
    throw new Error(`OpenAI API error: ${err}`)
  }

  const json = await response.json()
  const raw: string = json.choices[0].message.content

  // Parse "[N] translatedText" back into array
  const lines = raw.split('\n').filter(l => l.match(/^\[\d+\]/))
  const result: string[] = new Array(texts.length).fill('')
  lines.forEach(line => {
    const m = line.match(/^\[(\d+)\]\s?(.*)$/)
    if (m) result[parseInt(m[1])] = m[2]
  })
  return result
}

export async function POST(req: NextRequest) {
  try {
    const { documentId, targetLanguages } = await req.json()
    const apiKey = process.env.OPENAI_API_KEY

    if (!apiKey) {
      return NextResponse.json(
        { error: 'OPENAI_API_KEY is not configured. Please add it to your environment variables.' },
        { status: 500 }
      )
    }

    if (!documentId) {
      return NextResponse.json({ error: 'documentId is required' }, { status: 400 })
    }

    // Fetch the source Japanese document
    const sourceDoc = await sanityClient.fetch(
      `*[_id == $id][0]`,
      { id: documentId }
    )

    if (!sourceDoc) {
      return NextResponse.json({ error: 'Source document not found' }, { status: 404 })
    }

    const langs: string[] = targetLanguages || translationTargetLocales
    const results: { lang: string; status: string; docId?: string; error?: string }[] = []

    // Extract texts to translate once
    const body: any[] = sourceDoc.body || []
    const textBlocks = extractTextBlocks(body)
    const textsToTranslate = [
      sourceDoc.title || '',
      sourceDoc.excerpt || '',
      ...textBlocks.map(b => b.text)
    ]

    for (const lang of langs) {
      try {
        // Translate all texts for this language
        const translated = await translateBatch(textsToTranslate, lang, apiKey)

        const translatedTitle = translated[0] || sourceDoc.title
        const translatedExcerpt = translated[1] || sourceDoc.excerpt
        const bodyTranslations: Record<string, string> = {}
        textBlocks.forEach((block, i) => {
          bodyTranslations[block.path] = translated[2 + i] || block.text
        })

        const translatedBody = applyTranslations(body, bodyTranslations)

        // Build the translated document
        // Use the same slug as the source
        const newDoc = {
          _type: 'post' as const,
          title: translatedTitle,
          slug: sourceDoc.slug,
          excerpt: translatedExcerpt,
          body: translatedBody,
          __i18n_lang: lang,
          __i18n_base: { _type: 'reference', _ref: documentId },
          translationStatus: 'reviewing',
          publishedAt: sourceDoc.publishedAt,
          updatedAt: new Date().toISOString(),
          ...(sourceDoc.categories && { categories: sourceDoc.categories }),
          ...(sourceDoc.tags && { tags: sourceDoc.tags }),
          ...(sourceDoc.author && { author: sourceDoc.author }),
          ...(sourceDoc.mainImage && { mainImage: sourceDoc.mainImage }),
        }

        // Check if a translated version already exists
        const existingDoc = await sanityClient.fetch(
          `*[_type == "post" && __i18n_lang == $lang && (__i18n_base._ref == $baseId || _id == $baseId)][0]._id`,
          { lang, baseId: documentId }
        )

        let savedDocId: string
        if (existingDoc) {
          // Update existing
          const updated = await sanityClient
            .patch(existingDoc)
            .set(newDoc)
            .commit({ autoGenerateArrayKeys: true })
          savedDocId = updated._id
        } else {
          // Create new published document
          const created = await sanityClient.create(newDoc, { autoGenerateArrayKeys: true })
          savedDocId = created._id
        }

        results.push({ lang, status: 'success', docId: savedDocId })
      } catch (langError: any) {
        results.push({ lang, status: 'error', error: langError.message })
      }
    }

    return NextResponse.json({
      success: true,
      sourceDocumentId: documentId,
      translatedLanguages: results.filter(r => r.status === 'success').length,
      results,
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
