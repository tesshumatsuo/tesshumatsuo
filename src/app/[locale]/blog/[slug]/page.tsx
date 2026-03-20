import Link from 'next/link'
import { notFound } from 'next/navigation'
import { PortableText } from '@portabletext/react'
import CategoryBadge from '@/components/CategoryBadge'
import ArticleCard from '@/components/ArticleCard'
import KaiwaBubble from '@/components/KaiwaBubble'
import { client } from '@/sanity/lib/client'
import { urlFor } from '@/sanity/lib/image'
import Image from 'next/image'
import { Noto_Serif_JP } from 'next/font/google'

interface PostPageProps {
  params: Promise<{ locale: string, slug: string }>
}

function extractHeadings(blocks: any[] = []) {
  return blocks
    .filter((block) => block._type === 'block' && /^h[2-4]$/.test(block.style))
    .map((block) => {
      const text = block.children?.map((child: any) => child.text).join('') || ''
      const id = text.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
      return { id, text, level: parseInt(block.style.replace('h', '')) }
    })
}

function processKaiwaBlocks(blocks: any[]) {
  if (!blocks || !Array.isArray(blocks)) return blocks;
  
  const processed: any[] = [];
  let isKaiwa = false;
  let kaiwaType = 'l';
  let kaiwaContent: any[] = [];

  for (let i = 0; i < blocks.length; i++) {
    const rawBlock = blocks[i];
    
    // 記事全体のテキストに対して「。」での改行とスペース除去を適用
    const block = (rawBlock._type === 'block' && rawBlock.children) ? {
      ...rawBlock,
      children: rawBlock.children.map((child: any, index: number) => {
        if (child._type === 'span' && child.text) {
          let updatedText = child.text.replace(/。\s*/g, '。\n').replace(/\n{2,}/g, '\n');
          if (index === 0) updatedText = updatedText.trimStart(); // ブロック先頭の空白も除去
          return { ...child, text: updatedText };
        }
        return child;
      })
    } : rawBlock;
    
    if (block._type !== 'block') {
      if (isKaiwa) kaiwaContent.push(block);
      else processed.push(block);
      continue;
    }

    const originalText = block.children?.map((c: any) => c.text).join('') || '';

    const openMatch = originalText.match(/\[st-kaiwa\d*([^\]]*)\]/);
    const closeMatch = originalText.match(/\[\/st-kaiwa\d*\]/);

    if (openMatch && closeMatch) {
      const type = openMatch[1].includes('r') ? 'r' : 'l';
      const innerText = originalText.substring(
        originalText.indexOf(openMatch[0]) + openMatch[0].length,
        originalText.indexOf(closeMatch[0])
      ).trim();
      
      const newBlock = { ...block, children: [{ _type: 'span', text: innerText, marks: [] }] };
      processed.push({
        _type: 'kaiwa',
        _key: `kaiwa-${Math.random()}`,
        direction: type,
        content: [newBlock]
      });
      continue;
    }

    if (openMatch && !isKaiwa) {
      isKaiwa = true;
      kaiwaType = openMatch[1].includes('r') ? 'r' : 'l';
      
      const innerText = originalText.substring(originalText.indexOf(openMatch[0]) + openMatch[0].length).trim();
      if (innerText) {
        kaiwaContent.push({ ...block, children: [{ _type: 'span', text: innerText, marks: [] }] });
      }
      continue;
    }

    if (closeMatch && isKaiwa) {
      isKaiwa = false;
      
      const innerText = originalText.substring(0, originalText.indexOf(closeMatch[0])).trim();
      if (innerText) {
        kaiwaContent.push({ ...block, children: [{ _type: 'span', text: innerText, marks: [] }] });
      }
      
      processed.push({
        _type: 'kaiwa',
        _key: `kaiwa-${Math.random()}`,
        direction: kaiwaType,
        content: kaiwaContent
      });
      kaiwaContent = [];
      continue;
    }

    if (isKaiwa) {
      kaiwaContent.push(block);
    } else {
      processed.push(block);
    }
  }
  
  if (isKaiwa && kaiwaContent.length > 0) {
    processed.push({
      _type: 'kaiwa',
      _key: `kaiwa-${Math.random()}`,
      direction: kaiwaType,
      content: kaiwaContent
    });
  }

  return processed;
}

// Custom Portable Text components to add IDs to headings
const ptComponents: any = {
  types: {
    kaiwa: ({ value }: any) => <KaiwaBubble value={value} components={ptComponents} />,
    image: ({ value }: any) => {
      if (!value?.asset?._ref) {
        return null
      }
      return (
        <figure className="my-8 flex justify-center">
          <Image
            src={urlFor(value).url()}
            alt={value.alt || '画像'}
            width={800}
            height={600}
            className="rounded-2xl border border-gray-100 shadow-sm w-full h-auto object-cover"
          />
        </figure>
      )
    }
  },
  block: {
    h2: ({children}: any) => {
      const id = children?.toString().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
      return (
        <h2 id={id} className="text-[1.2rem] md:text-[1.4rem] font-bold text-white bg-[#397A9F] p-4 md:p-5 mt-6 mb-3 leading-snug">
          {children}
        </h2>
      )
    },
    h3: ({children}: any) => {
      const id = children?.toString().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
      return (
        <div className="relative mt-5 mb-3">
          <h3 id={id} className="text-base md:text-lg font-bold text-gray-900 pb-2 border-b-2 border-gray-200 leading-snug scroll-mt-24">
            {children}
          </h3>
          <span className="absolute bottom-0 left-0 w-12 h-0.5 bg-[#4175a4]" />
        </div>
      )
    },
    h4: ({children}: any) => {
      const id = children?.toString().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
      return (
        <h4 id={id} className="text-sm md:text-base font-bold text-gray-900 border-l-4 border-[#4175a4] bg-blue-50 px-4 py-2 mt-4 mb-2 scroll-mt-24 leading-snug">
          {children}
        </h4>
      )
    },
    normal: ({children}: any) => <p className="mb-6">{children}</p>,
    blockquote: ({children}: any) => <blockquote className="border-l-4 border-blue-600 pl-6 italic text-gray-700 my-8 py-2">{children}</blockquote>
  }
}

export default async function ArticlePage(props: PostPageProps) {
  const { locale, slug } = await props.params

  const query = `*[_type == "post" && slug.current == $slug][0] {
    title,
    "slug": slug.current,
    "date": publishedAt,
    excerpt,
    body,
    "categories": categories[]->{title, "slug": slug.current},
    "tags": tags[]->{title, "slug": slug.current},
    "author": author->{name, "bio": bio[0].children[0].text, image},
    "imageUrl": body[_type == "image"][0].asset->url
  }`
  
  const post = await client.fetch(query, { slug })

  if (!post) {
    notFound()
  }

  const categoryName = post.categories?.[0]?.title || 'Uncategorized'
  const categorySlugs = post.categories?.map((c: any) => c.slug) || []
  
  // Format Date
  const formattedDate = post.date ? new Date(post.date).toLocaleDateString(locale === 'ja' ? 'ja-JP' : 'en-US', {
    year: 'numeric', month: 'short', day: 'numeric'
  }) : ''

  // Generate TOC
  const headings = extractHeadings(post.body || [])

  // Fetch related articles
  // Using a GROQ query that finds other posts sharing at least one category
  const relatedQuery = `*[_type == "post" && slug.current != $slug && count((categories[]->slug.current)[@ in $catSlugs]) > 0] | order(publishedAt desc)[0...2] {
    title, excerpt, "slug": slug.current, "date": publishedAt, "category": categories[0]->title, "imageUrl": body[_type == "image"][0].asset->url
  }`
  const relatedPosts = await client.fetch(relatedQuery, { slug, catSlugs: categorySlugs })

  // Share URLs
  const shareUrl = process.env.NEXT_PUBLIC_SITE_URL ? `${process.env.NEXT_PUBLIC_SITE_URL}/${locale}/blog/${slug}` : `https://tesshumatsuo.com/${locale}/blog/${slug}`
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(shareUrl)}`
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`
  const hatenaUrl = `https://b.hatena.ne.jp/entry/panel/?url=${encodeURIComponent(shareUrl)}`

  return (
    <article className="w-full space-y-12">
      <Link href={`/${locale}/blog`} className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors inline-block mb-4">
        &larr; Back to all articles
      </Link>

      <header className="space-y-6">
        <div className="flex items-center gap-3 text-xs font-medium text-gray-500">
          <CategoryBadge name={categoryName} />
          {formattedDate && <time dateTime={post.date}>{formattedDate}</time>}
        </div>
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-gray-900 leading-tight">
          {post.title}
        </h1>
      </header>

      {/* Featured Image */}
      {post.imageUrl && (
        <div className="relative w-full mb-2 shadow-sm rounded-sm overflow-hidden bg-gray-50 border border-gray-100 flex justify-center">
          <img src={post.imageUrl} alt={post.title} className="w-full h-auto max-h-[600px] object-contain" loading="eager" />
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-12 items-start pt-2">
        <article className="max-w-none md:w-3/4 text-gray-800 leading-loose text-sm">
          {post.excerpt && (
            <p className="text-sm md:text-base text-gray-500 font-light mb-4 leading-relaxed tracking-wide">
              {post.excerpt}
            </p>
          )}
          
          <div className="prose prose-blue max-w-none text-sm text-gray-700 leading-loose tracking-wide whitespace-pre-wrap prose-p:mb-6 prose-p:mt-0">
            {post.body ? (() => {
               // bodyの中から最初の画像（_type === 'image'）を探し、重複表示されないように配列から取り除く
               const contentBlocks = [...post.body];
               const firstImgIndex = contentBlocks.findIndex(b => b._type === 'image');
               if (firstImgIndex !== -1) {
                 contentBlocks.splice(firstImgIndex, 1);
               }
               return <PortableText value={processKaiwaBlocks(contentBlocks)} components={ptComponents} />;
            })() : (
              <p className="text-gray-500 italic">No content available.</p>
            )}
          </div>
        </article>

        <aside className="w-full md:w-1/4 sticky top-24 space-y-10 border-t md:border-t-0 border-gray-100 pt-8 md:pt-0">
          {headings.length > 0 && (
            <div>
              <h4 className="text-xs font-bold text-gray-900 mb-4 uppercase tracking-widest">目次</h4>
              <ul className="space-y-3 text-sm text-gray-500 font-medium">
                {headings.map((h, i) => (
                  <li key={i} className={h.level === 3 ? "pl-4 text-gray-400" : "text-blue-600 hover:text-blue-800 transition-colors"}>
                    <a href={`#${h.id}`}>{h.text}</a>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          <div className={headings.length > 0 ? "pt-8 border-t border-gray-100" : ""}>
            <h4 className="text-xs font-bold text-gray-900 mb-4 uppercase tracking-widest">シェア</h4>
            <div className="flex flex-wrap gap-4">
              <a href={twitterUrl} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-400 transition-colors text-sm font-medium">X (Twitter)</a>
              <a href={facebookUrl} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-600 transition-colors text-sm font-medium">Facebook</a>
              <a href={hatenaUrl} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-800 transition-colors text-sm font-medium">Hatena</a>
            </div>
          </div>
        </aside>
      </div>

      {post.author && (
        <div className="mt-24 bg-gray-50 border border-gray-100 rounded-2xl p-8 flex items-start gap-6">
          <div className="w-16 h-16 rounded-full bg-gray-200 shrink-0 overflow-hidden flex items-center justify-center text-gray-400 text-xs text-center border border-gray-300">Image</div>
          <div className="space-y-2">
            <h3 className="font-bold text-gray-900">{post.author.name}</h3>
            {post.author.bio && (
              <p className="text-gray-600 text-sm leading-relaxed">
                {post.author.bio}
              </p>
            )}
          </div>
        </div>
      )}

      {relatedPosts && relatedPosts.length > 0 && (
        <div className="pt-24 border-t border-gray-100 space-y-8">
          <h2 className="text-2xl font-bold tracking-tight">関連記事</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {relatedPosts.map((article: any) => (
               <ArticleCard 
               key={article.slug} 
               locale={locale}
               title={article.title}
               excerpt={article.excerpt}
               slug={article.slug}
               date={article.date}
               category={article.category}
             />
            ))}
          </div>
        </div>
      )}

    </article>
  )
}
