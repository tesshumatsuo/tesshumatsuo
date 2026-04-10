'use client'

/**
 * This configuration is used to for the Sanity Studio that’s mounted on the `/app/studio/[[...tool]]/page.tsx` route
 */

import {visionTool} from '@sanity/vision'
import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {presentationTool} from 'sanity/presentation'

// Go to https://www.sanity.io/docs/api-versioning to learn how API versioning works
import {apiVersion, dataset, projectId} from './src/sanity/env'
import {schema} from './src/sanity/schemaTypes'
import {documentInternationalization} from '@sanity/document-internationalization'
import {structure} from './src/sanity/structure'

export default defineConfig({
  basePath: '/studio',
  projectId,
  dataset,
  // Add and edit the content schema in the './sanity/schemaTypes' folder
  schema,
  plugins: [
    structureTool({structure}),
    documentInternationalization({
      supportedLanguages: [
        { id: 'ja', title: '日本語' },
        { id: 'en', title: 'English' },
        { id: 'zh', title: '中国語（普通話）' },
        { id: 'hi', title: 'ヒンディー語' },
        { id: 'es', title: 'スペイン語' },
        { id: 'ar', title: 'アラビア語（現代標準）' },
        { id: 'fr', title: 'フランス語' },
        { id: 'bn', title: 'ベンガル語' },
        { id: 'pt', title: 'ポルトガル語' },
        { id: 'id', title: 'インドネシア語' },
        { id: 'ur', title: 'ウルドゥー語' },
        { id: 'ru', title: 'ロシア語' },
        { id: 'de', title: 'ドイツ語' },
        { id: 'vi', title: 'ベトナム語' },
        { id: 'my', title: 'ミャンマー語' },
      ],
      schemaTypes: ['post'],
    }),
    presentationTool({
      previewUrl: {
        origin: typeof location === 'undefined' ? 'http://localhost:3000' : location.origin,
      },
    }),
    // Vision is for querying with GROQ from inside the Studio
    // https://www.sanity.io/docs/the-vision-plugin
    visionTool({defaultApiVersion: apiVersion}),
  ],
  document: {
    productionUrl: async (prev, context) => {
      const { document } = context;
      if (document._type === 'post') {
        const slug = (document as any).slug?.current;
        if (slug) {
          const origin = typeof location === 'undefined' ? 'http://localhost:3000' : location.origin;
          return `${origin}/ja/blog/${slug}`;
        }
      }
      return prev;
    },
  },
})
