import { type SchemaTypeDefinition } from 'sanity'
import { authorType } from './author'
import { categoryType } from './category'
import { postType } from './post'
import { siteSettingsType } from './siteSettings'
import { tagType } from './tag'
import { kaiwaType } from './kaiwa'
import { youtubeType } from './youtube'
import { tocType } from './toc'
import { checkType } from './check'
import { boxType } from './box'
import { instagramType } from './instagram'
import { linkCardType } from './linkCard'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [authorType, categoryType, tagType, kaiwaType, youtubeType, tocType, checkType, boxType, instagramType, linkCardType, postType, siteSettingsType],
}
