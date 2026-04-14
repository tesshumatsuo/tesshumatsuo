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
import {TranslateAction} from './src/sanity/actions/TranslateAction'
import { defaultLocale, supportedLocales } from './src/i18n/locales'

type PreviewablePostDocument = {
  _type?: string
  slug?: { current?: string }
  __i18n_lang?: string
}

export default defineConfig({
  basePath: '/studio',
  projectId,
  dataset,
  // Add and edit the content schema in the './sanity/schemaTypes' folder
  schema,
  plugins: [
    structureTool({structure}),
    documentInternationalization({
      supportedLanguages: supportedLocales.map((locale) => ({ id: locale.code, title: locale.label })),
      languageField: '__i18n_lang',
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
      const document = context.document as PreviewablePostDocument | undefined;
      if (document._type === 'post') {
        const slug = document.slug?.current;
        if (slug) {
          const origin = typeof location === 'undefined' ? 'http://localhost:3000' : location.origin;
          const locale = document.__i18n_lang || defaultLocale;
          return `${origin}/${locale}/blog/${slug}`;
        }
      }
      return prev;
    },
    actions: (prev, context) => {
      if (context.schemaType === 'post') {
        return [TranslateAction, ...prev]
      }
      return prev
    },
  },
})
