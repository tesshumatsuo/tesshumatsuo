import { defineField, defineType } from 'sanity'

export const spotifyType = defineType({
  name: 'spotify',
  title: 'Spotify Podcast',
  type: 'object',
  fields: [
    defineField({
      name: 'url',
      title: 'Spotify URL',
      type: 'url',
      description: 'Spotifyのエピソードまたは番組のURLを入力してください。(例: https://open.spotify.com/show/...)',
      validation: (Rule) => Rule.required().uri({ scheme: ['http', 'https'] })
    })
  ],
  preview: {
    select: {
      url: 'url'
    },
    prepare({ url }) {
      return {
        title: 'Spotify Embed',
        subtitle: url || 'URL not set'
      }
    }
  }
})
