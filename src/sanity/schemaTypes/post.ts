import React from 'react'
import { defineType, defineField } from 'sanity'
import { UrlDisplay } from '../components/UrlDisplay'

export const postType = defineType({
  name: 'post',
  title: 'Post',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'language',
      title: 'Language (言語)',
      type: 'string',
      options: {
        list: [
          { title: 'Japanese (日本語)', value: 'ja' },
          { title: 'English (英語)', value: 'en' },
        ],
      },
      initialValue: 'ja',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'previewUrl',
      title: 'Preview URL',
      type: 'string',
      components: {
        field: (props: any) => React.createElement(UrlDisplay, { ...props, type: 'preview' })
      },
      readOnly: true,
    }),
    defineField({
      name: 'publishedUrl',
      title: 'Published URL',
      type: 'string',
      components: {
        field: (props: any) => React.createElement(UrlDisplay, { ...props, type: 'published' })
      },
      readOnly: true,
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published at',
      type: 'datetime',
    }),
    defineField({
      name: 'updatedAt',
      title: 'Updated at (更新日)',
      type: 'datetime',
      description: '空欄にすると、自動で最後に編集した日時が使われます',
    }),
    defineField({
      name: 'mainImage',
      title: 'Main Image (アイキャッチ画像)',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alternative text',
        }
      ]
    }),
    defineField({
      name: 'excerpt',
      title: 'Excerpt (抜粋)',
      type: 'text',
      rows: 3,
      description: '記事の抜粋文です。',
    }),

    defineField({
      name: 'body',
      title: 'Body',
      type: 'array',
      of: [
        { type: 'block' },
        { 
          type: 'image',
          options: { hotspot: true },
          fields: [
            {
              name: 'alt',
              type: 'string',
              title: 'Alternative text',
            }
          ]
        },
        { type: 'kaiwa' },
        { type: 'toc' },
        { type: 'check' },
        { type: 'box' },
        { type: 'youtube' },
        { type: 'instagram' },
        { type: 'linkCard' },
        { type: 'spotify' },
      ],
    }),
    defineField({
      name: 'author',
      title: 'Author',
      type: 'reference',
      to: [{ type: 'author' }],
    }),
    defineField({
      name: 'categories',
      title: 'Categories',
      type: 'array',
      of: [{ type: 'reference', to: { type: 'category' } }],
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{ type: 'reference', to: { type: 'tag' } }],
    }),
  ],
})
