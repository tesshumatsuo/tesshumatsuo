import { defineType, defineField, defineArrayMember } from 'sanity'

export const kaiwaType = defineType({
  name: 'kaiwa',
  title: '会話バブル',
  type: 'object',
  fields: [
    defineField({
      name: 'direction',
      title: '方向',
      type: 'string',
      options: {
        list: [
          { title: '左（てっしゅう）', value: 'l' },
          { title: '右（相手）', value: 'r' },
        ],
        layout: 'radio',
      },
      initialValue: 'l',
    }),
    defineField({
      name: 'content',
      title: '本文',
      type: 'array',
      of: [
        defineArrayMember({ type: 'block' }),
      ],
    }),
  ],
  preview: {
    select: {
      content: 'content',
      direction: 'direction',
    },
    prepare({ content, direction }: any) {
      const block = (content || []).find((b: any) => b._type === 'block')
      const text = block?.children?.map((c: any) => c.text).join('') || '（空の吹き出し）'
      const side = direction === 'r' ? '→ 右' : '← 左'
      return {
        title: `💬 ${side}｜${text.slice(0, 40)}`,
      }
    },
  },
})
