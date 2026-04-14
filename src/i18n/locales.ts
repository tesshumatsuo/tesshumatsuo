export const supportedLocales = [
  { code: 'ja', label: '日本語' },
  { code: 'en', label: 'English' },
  { code: 'zh', label: '中文' },
  { code: 'hi', label: 'हिन्दी' },
  { code: 'es', label: 'Español' },
  { code: 'ar', label: 'العربية' },
  { code: 'fr', label: 'Français' },
  { code: 'bn', label: 'বাংলা' },
  { code: 'pt', label: 'Português' },
  { code: 'id', label: 'Bahasa Indonesia' },
  { code: 'ru', label: 'Русский' },
  { code: 'de', label: 'Deutsch' },
  { code: 'vi', label: 'Tiếng Việt' },
  { code: 'my', label: 'ဗမာစာ' },
  { code: 'ko', label: '한국어' },
  { code: 'it', label: 'Italiano' },
  { code: 'th', label: 'ภาษาไทย' },
  { code: 'tr', label: 'Türkçe' },
  { code: 'ne', label: 'नेपाली' },
  { code: 'km', label: 'ភាសាខ្មែរ' },
] as const

export const localeCodes = supportedLocales.map((locale) => locale.code)

export type AppLocale = (typeof localeCodes)[number]

export const defaultLocale: AppLocale = 'ja'

export const translationTargetLocales = localeCodes.filter(
  (locale): locale is Exclude<AppLocale, 'ja'> => locale !== defaultLocale,
)
