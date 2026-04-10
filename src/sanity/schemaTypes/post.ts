import React from 'react'
import { defineType, defineField } from 'sanity'
import { UrlDisplay } from '../components/UrlDisplay'

export const postType = defineType({
  name: 'post',
  title: 'Post',
  type: 'document',
  fields: [
    // ── 主要フィールド（上部） ──────────────────
    defineField({
      name: 'title',
      title: 'タイトル',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'スラッグ（URL）',
      type: 'slug',
      options: {
        source: 'title',
      },
      description: '「Generate」を押すとタイトルから自動生成されます',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'body',
      title: '本文',
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
        { type: 'twitter' },
      ],
    }),

    // ── サイドバー的フィールド（下部） ─────────
    defineField({
      name: 'categories',
      title: 'カテゴリー',
      type: 'array',
      of: [{ type: 'reference', to: { type: 'category' } }],
    }),
    defineField({
      name: 'tags',
      title: 'タグ',
      type: 'array',
      of: [{ type: 'reference', to: { type: 'tag' } }],
    }),
    defineField({
      name: 'mainImage',
      title: 'アイキャッチ画像',
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
      title: '抜粋',
      type: 'text',
      rows: 3,
      description: '記事の抜粋文です。',
    }),
    defineField({
      name: 'language',
      title: '言語',
      type: 'string',
      options: {
        list: [
          { title: '日本語', value: 'ja' },
          { title: 'English', value: 'en' },
          { title: '中国語（普通話）', value: 'zh' },
          { title: 'ヒンディー語', value: 'hi' },
          { title: 'スペイン語', value: 'es' },
          { title: 'アラビア語（現代標準）', value: 'ar' },
          { title: 'フランス語', value: 'fr' },
          { title: 'ベンガル語', value: 'bn' },
          { title: 'ポルトガル語', value: 'pt' },
          { title: 'インドネシア語', value: 'id' },
          { title: 'ウルドゥー語', value: 'ur' },
          { title: 'ロシア語', value: 'ru' },
          { title: 'ドイツ語', value: 'de' },
          { title: 'ベトナム語', value: 'vi' },
          { title: 'ミャンマー語', value: 'my' },
        ],
      },
      initialValue: 'ja',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'author',
      title: '著者',
      type: 'reference',
      to: [{ type: 'author' }],
    }),
    defineField({
      name: 'publishedAt',
      title: '公開日',
      type: 'datetime',
    }),
    defineField({
      name: 'updatedAt',
      title: '更新日',
      type: 'datetime',
      description: '空欄にすると、自動で最後に編集した日時が使われます',
    }),
    defineField({
      name: 'previewUrl',
      title: 'プレビューURL',
      type: 'string',
      components: {
        field: (props: any) => React.createElement(UrlDisplay, { ...props, type: 'preview' })
      },
      readOnly: true,
    }),
    defineField({
      name: 'publishedUrl',
      title: '公開URL',
      type: 'string',
      components: {
        field: (props: any) => React.createElement(UrlDisplay, { ...props, type: 'published' })
      },
      readOnly: true,
    }),
  ],
})
