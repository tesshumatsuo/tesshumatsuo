import { defineType, defineField, defineArrayMember } from 'sanity'
import { SquareIcon } from '@sanity/icons'

export const boxType = defineType({
  name: 'box',
  type: 'object',
  title: '枠線ボックス (Box)',
  icon: SquareIcon,
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
