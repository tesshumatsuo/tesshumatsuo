import { defineType, defineField } from 'sanity'
import { CheckmarkIcon } from '@sanity/icons'

export const checkType = defineType({
  name: 'check',
  type: 'object',
  title: 'チェック',
  icon: CheckmarkIcon,
  fields: [
    defineField({
      name: 'text',
      type: 'string',
      title: 'テキスト',
      description: 'チェックマークの横に表示する文章を入力してください',
    }),
  ],
  preview: {
    select: { title: 'text' },
    prepare({ title }: any) {
      return { title: `✅ ${title || 'テキスト未入力'}` }
    }
  }
})
