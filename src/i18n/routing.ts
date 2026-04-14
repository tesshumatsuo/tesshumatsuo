import { defineRouting } from 'next-intl/routing'
import { defaultLocale, localeCodes } from './locales'

export const routing = defineRouting({
  locales: localeCodes,
  defaultLocale,
})
