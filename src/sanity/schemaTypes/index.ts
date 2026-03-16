import { type SchemaTypeDefinition } from 'sanity'
import { authorType } from './author'
import { categoryType } from './category'
import { postType } from './post'
import { siteSettingsType } from './siteSettings'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [authorType, categoryType, postType, siteSettingsType],
}
