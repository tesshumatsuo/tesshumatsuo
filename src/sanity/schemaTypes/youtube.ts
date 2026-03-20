import { defineType, defineField } from 'sanity'

export const youtubeType = defineType({
  name: 'youtube',
  type: 'object',
  title: 'YouTube Embed',
  fields: [
    defineField({
      name: 'url',
      type: 'url',
      title: 'YouTube video URL',
    }),
  ],
  preview: {
    select: {
      url: 'url',
    },
    prepare({ url }: any) {
      return {
        title: 'YouTube Video',
        subtitle: url,
      }
    },
  },
})
