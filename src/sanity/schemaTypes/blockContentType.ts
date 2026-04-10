import {defineType, defineArrayMember} from 'sanity'
import {ImageIcon} from '@sanity/icons'

export const blockContentType = defineType({
  title: 'Block Content',
  name: 'blockContent',
  type: 'array',
  of: [
    defineArrayMember({
      type: 'block',
      styles: [
        {title: '標準', value: 'normal'},
        {title: '見出し H2', value: 'h2'},
        {title: '見出し H3', value: 'h3'},
        {title: '見出し H4', value: 'h4'},
        {title: '引用', value: 'blockquote'},
      ],
      lists: [
        {title: '箇条書き', value: 'bullet'},
        {title: '番号付きリスト', value: 'number'},
      ],
      marks: {
        decorators: [
          {title: '太字', value: 'strong'},
          {title: '斜体', value: 'em'},
          {title: '下線', value: 'underline'},
          {title: '取り消し線', value: 'strike-through'},
          {title: 'コード', value: 'code'},
        ],
        annotations: [
          {
            title: 'URL リンク',
            name: 'link',
            type: 'object',
            fields: [
              {
                title: 'URL',
                name: 'href',
                type: 'url',
              },
            ],
          },
        ],
      },
    }),
    defineArrayMember({
      type: 'image',
      icon: ImageIcon,
      options: {hotspot: true},
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alt テキスト',
        }
      ]
    }),
    defineArrayMember({ type: 'youtube' }),
    defineArrayMember({ type: 'instagram' }),
    defineArrayMember({ type: 'spotify' }),
    defineArrayMember({ type: 'twitter' }),
  ],
})
