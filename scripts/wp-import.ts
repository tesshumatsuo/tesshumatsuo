import fs from 'fs'
import path from 'path'
const envContent = fs.readFileSync(path.join(process.cwd(), '.env.local'), 'utf-8')
const tokenMatch = envContent.match(/SANITY_API_TOKEN="?([^"\n]+)"?/)
if (tokenMatch) {
  process.env.SANITY_API_TOKEN = tokenMatch[1]
}

import { parseStringPromise } from 'xml2js'
import { createClient } from '@sanity/client'
import { htmlToBlocks } from '@portabletext/block-tools'
import { JSDOM } from 'jsdom'
import { Schema } from '@sanity/schema'

// Initialize Sanity Client
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'z79nhht7',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
  apiVersion: '2024-03-19'
})

async function run() {
  if (!process.env.SANITY_API_TOKEN) {
    console.error('❌ SANITY_API_TOKEN is missing in environment variables (.env.local). Please configure it.')
    process.exit(1)
  }

  const xmlPath = path.join(process.cwd(), 'wp-data', 'tesshublog.WordPress.2026-03-13.xml')
  if (!fs.existsSync(xmlPath)) {
    console.error(`❌ XML file not found at ${xmlPath}`)
    process.exit(1)
  }

  console.log('📖 Reading XML file...')
  const xmlContent = fs.readFileSync(xmlPath, 'utf8')
  
  console.log('🔍 Parsing XML...')
  const parsed = await parseStringPromise(xmlContent)
  
  const items = parsed.rss.channel[0].item || []
  const posts = items.filter((item: any) => 
    item['wp:post_type'] && item['wp:post_type'][0] === 'post' &&
    item['wp:status'] && item['wp:status'][0] === 'publish'
  )

  console.log(`🚀 Found ${posts.length} published posts to import.`)

  for (const post of posts) {
    const title = post.title?.[0] || 'Untitled'
    const slug = post['wp:post_name']?.[0] || null
    const excerpt = post['excerpt:encoded']?.[0] || ''
    const content = post['content:encoded']?.[0] || ''
    const publishedAt = post['wp:post_date']?.[0] ? new Date(post['wp:post_date'][0]).toISOString() : new Date().toISOString()
    
    if (!slug) continue;

    console.log(`⏳ Processing: "${title}"...`)

    // Extract categories & tags
    const catsAndTags = post.category || []
    const categoryNames = catsAndTags.filter((c: any) => c.$?.domain === 'category').map((c: any) => c._)
    const tagNames = catsAndTags.filter((c: any) => c.$?.domain === 'post_tag').map((c: any) => c._)

    // Ensure Categories exist in Sanity
    const catRefs = []
    for (const catName of categoryNames) {
      if (!catName) continue
      const catSlug = Buffer.from(catName).toString('hex').substring(0, 32)
      const doc = { _type: 'category', _id: `cat-${catSlug}`, title: catName, slug: { current: encodeURIComponent(catName.toLowerCase()) } }
      await client.createIfNotExists(doc)
      catRefs.push({ _key: catSlug, _type: 'reference', _ref: `cat-${catSlug}` })
    }

    // Ensure Tags exist
    const tagRefs = []
    for (const tagName of tagNames) {
      if (!tagName) continue
      const tagSlug = Buffer.from(tagName).toString('hex').substring(0, 32)
      const doc = { _type: 'tag', _id: `tag-${tagSlug}`, title: tagName, slug: { current: encodeURIComponent(tagName.toLowerCase()) } }
      await client.createIfNotExists(doc)
      tagRefs.push({ _key: tagSlug, _type: 'reference', _ref: `tag-${tagSlug}` })
    }



const defaultSchema = Schema.compile({
  name: 'default',
  types: [
    {
      type: 'object',
      name: 'post',
      fields: [
        {
          name: 'body',
          type: 'array',
          of: [
            { type: 'block' },
            { type: 'object', name: 'sanityImage', fields: [{ name: 'asset', type: 'object', fields: [] }] }
          ]
        }
      ]
    }
  ]
})
const blockContentType = defaultSchema.get('post').fields.find((f: any) => f.name === 'body').type

    // Image Extraction and Uploading
    let modifiedContent = content
    const imgRegex = /<img[^>]+src="([^">]+)"/gi
    let match
    const assetIdMap: Record<string, string> = {}

    while ((match = imgRegex.exec(content)) !== null) {
      const originalUrl = match[1]
      if (!assetIdMap[originalUrl]) {
        try {
          const urlObj = new URL(originalUrl)
          if (urlObj.pathname.includes('/wp-content/uploads/')) {
            const relativePath = urlObj.pathname.split('/wp-content/uploads/')[1]
            // Decode URI component in case of URL encoded characters like spaces
            const decodedRelativePath = decodeURIComponent(relativePath)
            const localFilePath = path.join(process.cwd(), 'wp-data', 'uploads', decodedRelativePath)
            
            if (fs.existsSync(localFilePath)) {
              console.log(`  -> 🖼️ Uploading image: ${decodedRelativePath}`)
              const asset = await client.assets.upload('image', fs.createReadStream(localFilePath), {
                filename: path.basename(localFilePath)
              })
              assetIdMap[originalUrl] = asset._id
            } else {
              console.warn(`  -> ⚠️ Local image not found: ${decodedRelativePath}`)
            }
          }
        } catch (e) {
          console.warn(`  -> ⚠️ Invalid image URL: ${originalUrl}`)
        }
      }
    }

    // Replace original URLs in HTML with Sanity asset IDs
    for (const [url, assetId] of Object.entries(assetIdMap)) {
      modifiedContent = modifiedContent.split(url).join(assetId)
    }

    // Convert HTML to Portable Text blocks
    const blocks = htmlToBlocks(modifiedContent, blockContentType, {
      parseHtml: html => new JSDOM(html).window.document,
      rules: [
        {
          deserialize(el, next, block) {
            if (el.nodeType === 1 && (el as Element).tagName.toLowerCase() === 'img') {
              const src = (el as Element).getAttribute('src') || ''
              if (src.startsWith('image-')) {
                return block({
                  _type: 'sanityImage',
                  asset: { _type: 'reference', _ref: src }
                })
              }
              return { _type: 'span', text: `[画像見つからず: ${src}]` }
            }
            return undefined
          }
        }
      ]
    })

    // Rename 'sanityImage' back to native 'image' type before saving
    const finalBlocks = blocks.map((b: any) => 
      b._type === 'sanityImage' ? { ...b, _type: 'image' } : b
    )

    // Create Post Document
    const postDoc = {
      _type: 'post',
      _id: `post-${slug}`,
      title,
      slug: { current: slug },
      publishedAt,
      excerpt,
      body: finalBlocks,
      categories: catRefs.length > 0 ? catRefs : undefined,
      tags: tagRefs.length > 0 ? tagRefs : undefined
    }

    await client.createOrReplace(postDoc)
    console.log(`✅ Success: ${title}`)
  }

  console.log('🎉 Migration completed successfully!')
}

run().catch(console.error)
