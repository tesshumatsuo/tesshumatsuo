import { type SchemaTypeDefinition } from 'sanity'
import { authorType } from './author'
import { categoryType } from './category'
import { postType } from './post'
import { siteSettingsType } from './siteSettings'
import { tagType } from './tag'
import { kaiwaType } from './kaiwa'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [authorType, categoryType, tagType, kaiwaType, postType, siteSettingsType],
}
