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
      name: 'translationStatus',
      title: '翻訳ステータス',
      type: 'string',
      initialValue: 'draft',
      options: {
        list: [
          { title: 'Draft', value: 'draft' },
          { title: 'Reviewing', value: 'reviewing' },
          { title: 'Published', value: 'published' },
        ],
        layout: 'radio',
      },
      description: '日本語記事から自動生成された各言語版の記事の進行状況を管理します。',
    }),
    defineField({
      name: 'translationLock',
      title: '自動翻訳の上書き保護',
      type: 'boolean',
      initialValue: false,
      description: 'オンにすると、日本語記事から一括再翻訳したときにこの言語版は上書きされません。',
      hidden: ({ document }) => !document?.__i18n_lang || document.__i18n_lang === 'ja',
    }),
    defineField({
      name: 'lastTranslatedAt',
      title: '最終自動翻訳日時',
      type: 'datetime',
      readOnly: true,
      description: '日本語の親記事から最後に一括翻訳された日時です。',
      hidden: ({ document }) => !document?.__i18n_lang || document.__i18n_lang === 'ja',
    }),
    defineField({
      name: 'sourceUpdatedAtAtTranslation',
      title: '翻訳元の最終更新日時',
      type: 'datetime',
      readOnly: true,
      description: 'この翻訳が生成された時点の日本語記事の更新日時です。',
      hidden: ({ document }) => !document?.__i18n_lang || document.__i18n_lang === 'ja',
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
  preview: {
    select: {
      title: 'title',
      media: 'mainImage',
      language: '__i18n_lang',
      status: 'translationStatus',
    },
    prepare({
      title,
      media,
      language,
      status,
    }: {
      title?: string
      media?: unknown
      language?: string
      status?: string
    }) {
      const locale = language || 'ja'
      const subtitle = [locale.toUpperCase(), status || 'draft'].join(' | ')
      return { title, media, subtitle }
    },
  },
})
