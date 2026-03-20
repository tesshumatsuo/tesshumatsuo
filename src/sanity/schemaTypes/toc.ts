import { defineType } from 'sanity'
import { ListIcon } from '@sanity/icons'

export const tocType = defineType({
  name: 'toc',
  type: 'object',
  title: '目次',
  icon: ListIcon,
  fields: [
    {
      name: 'placeholder',
      type: 'string',
      title: '設定不要（自動で目次が表示されます）',
      initialValue: 'このブロックを置いた場所に目次が表示されます',
      readOnly: true,
    }
  ],
  preview: {
    prepare() {
      return { title: '目次 (Table of Contents)' }
    }
  }
})
