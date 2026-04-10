import { defineType, defineField } from 'sanity'

export const twitterType = defineType({
  name: 'twitter',
  type: 'object',
  title: 'X (Twitter) Embed',
  fields: [
    defineField({
      name: 'url',
      type: 'url',
      title: 'X (Twitter) post URL',
      description: '例: https://twitter.com/user/status/123456789',
    }),
  ],
  preview: {
    select: {
      url: 'url',
    },
    prepare({ url }: any) {
      return {
        title: 'X (Twitter) Post',
        subtitle: url,
      }
    },
  },
})
