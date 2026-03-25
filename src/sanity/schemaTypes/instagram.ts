import { defineType, defineField } from 'sanity'
import { ImageIcon } from '@sanity/icons'

export const instagramType = defineType({
  name: 'instagram',
  type: 'object',
  title: 'Instagram Embed',
  icon: ImageIcon,
  fields: [
    defineField({
      name: 'url',
      type: 'url',
      title: 'Instagram post URL',
      description: '例: https://www.instagram.com/p/C47...',
    }),
  ],
  preview: {
    select: {
      url: 'url',
    },
    prepare({ url }: any) {
      return {
        title: 'Instagram Post',
        subtitle: url,
      }
    },
  },
})
