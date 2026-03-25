import { defineType, defineField } from 'sanity'
import { LinkIcon } from '@sanity/icons'
import { LinkCardInput } from '../components/LinkCardInput'

export const linkCardType = defineType({
  name: 'linkCard',
  type: 'object',
  title: 'Blog Card (Link Preview)',
  icon: LinkIcon,
  fields: [
    defineField({
      name: 'url',
      type: 'url',
      title: 'URL',
    }),
    defineField({
      name: 'title',
      type: 'string',
      title: 'Title',
    }),
    defineField({
      name: 'description',
      type: 'text',
      title: 'Description',
    }),
    defineField({
      name: 'image',
      type: 'string',
      title: 'Image URL',
    }),
  ],
  components: {
    input: LinkCardInput,
  },
  preview: {
    select: {
      title: 'title',
      subtitle: 'url',
      media: 'LinkIcon',
    },
    prepare({ title, subtitle }: any) {
      return {
        title: title || 'Link Card',
        subtitle: subtitle,
        icon: LinkIcon,
      }
    },
  },
})
