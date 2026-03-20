import { defineType, defineField, defineArrayMember } from 'sanity'

export const boxType = defineType({
  name: 'box',
  type: 'object',
  title: '枠線ボックス (Box)',
  fields: [
    defineField({
      name: 'content',
      type: 'array',
      title: 'ボックス内の文章',
      of: [defineArrayMember({ type: 'block' })],
    }),
  ],
  preview: {
    prepare() {
      return { title: '枠線ボックス (Box)' }
    }
  }
})
