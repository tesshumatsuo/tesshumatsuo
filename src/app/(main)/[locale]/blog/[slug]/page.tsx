import Link from 'next/link'
import { notFound } from 'next/navigation'
import { PortableText } from '@portabletext/react'
import CategoryBadge from '@/components/CategoryBadge'
import ArticleCard from '@/components/ArticleCard'
import KaiwaBubble from '@/components/KaiwaBubble'
import TocBlock from '@/components/TocBlock'
import TwitterEmbed from '@/components/TwitterEmbed'
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
          // 従来の強制改行をもう少しマイルドに調整
          let updatedText = child.text.replace(/。\s*/g, '。\n').replace(/\n{2,}/g, '\n');
          if (index === 0) updatedText = updatedText.trimStart(); 
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
    kaiwa: ({ value }: any) => <KaiwaBubble value={value} components={tightPtComponents} />,
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
    },
    youtube: ({ value }: any) => {
      if (!value?.url) return null;
      let videoId = '';
      try {
        const url = new URL(value.url);
        videoId = url.searchParams.get('v') || url.pathname.split('/').pop() || '';
      } catch (e) {
        return null;
      }
      return (
        <div className="my-8 aspect-video w-full rounded-2xl overflow-hidden shadow-sm">
          <iframe
            src={`https://www.youtube.com/embed/${videoId}`}
            title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full border-0"
          ></iframe>
        </div>
      );
    },
    instagram: ({ value }: any) => {
      if (!value?.url) return null;
      let shortcode = '';
      try {
        const url = new URL(value.url);
        const pathSegments = url.pathname.split('/').filter(Boolean);
        if (pathSegments[0] === 'p' || pathSegments[0] === 'reels' || pathSegments[0] === 'reel') {
          shortcode = pathSegments[1];
        }
      } catch (e) {
        return null;
      }
      if (!shortcode) return null;
      return (
        <div className="my-8 flex justify-center w-full">
          <div className="w-full max-w-[540px] border border-gray-100 rounded-xl overflow-hidden shadow-sm bg-white">
            <iframe
              src={`https://www.instagram.com/p/${shortcode}/embed`}
              className="w-full"
              height="600"
              frameBorder="0"
              scrolling="no"
              allow="encrypted-media"
            ></iframe>
          </div>
        </div>
      );
    },
    linkCard: ({ value }: any) => {
      if (!value?.url) return null;
      return (
        <div className="my-10">
          <a 
            href={value.url} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="flex flex-col sm:flex-row gap-0 sm:gap-6 border border-gray-200 rounded-xl overflow-hidden hover:border-blue-400 transition-all group bg-white shadow-sm"
          >
            {value.image && (
              <div className="sm:w-1/3 aspect-[1.91/1] sm:aspect-square relative overflow-hidden bg-gray-100 shrink-0 border-b sm:border-b-0 sm:border-r border-gray-100">
                <img 
                  src={value.image} 
                  alt={value.title || ''} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
            )}
            <div className="p-5 sm:p-6 flex flex-col justify-center gap-2 flex-1">
              <h3 className="text-base font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug">
                {value.title || value.url}
              </h3>
              {value.description && (
                <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                  {value.description}
                </p>
              )}
              <div className="mt-2 flex items-center gap-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path></svg>
                <span className="truncate max-w-[200px]">{new URL(value.url).hostname}</span>
              </div>
            </div>
          </a>
        </div>
      );
    },
    spotify: ({ value }: any) => {
      if (!value?.url) return null;
      let embedId = '';
      try {
        const url = new URL(value.url);
        const parts = url.pathname.split('/').filter(Boolean);
        if (parts.length >= 2 && ['show', 'episode', 'track', 'playlist'].includes(parts[0])) {
          embedId = `${parts[0]}/${parts[1]}`;
        }
      } catch (e) {
        return null;
      }
      if (!embedId) return null;
      return (
        <div className="my-10 w-full flex justify-center">
          <iframe 
            style={{ borderRadius: '12px' }} 
            src={`https://open.spotify.com/embed/${embedId}?utm_source=generator`} 
            width="100%" 
            height="352" 
            lang="en"
            frameBorder="0" 
            allowFullScreen={false} 
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
            loading="lazy"
            className="shadow-sm border border-gray-100 max-w-3xl"
          ></iframe>
        </div>
      );
    },
    twitter: ({ value }: any) => {
      if (!value?.url) return null;
      return <TwitterEmbed url={value.url} />;
    },
    check: ({ value }: any) => {
      if (!value?.text) return null;
      return (
        <div className="flex items-center gap-3 my-8">
          <div className="w-8 h-8 rounded-full bg-[#fca311] flex items-center justify-center shrink-0 shadow-sm">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
          </div>
          <span className="text-gray-900 font-bold text-lg md:text-xl leading-snug">
            {value.text}
          </span>
        </div>
      )
    },
    box: ({ value }: any) => {
      if (!value?.content) return null;
      return (
        <div className="my-10 border border-gray-300 bg-gray-50/50 p-6 md:p-8 rounded text-gray-800 shadow-sm">
          {/* Note: since components is passed implicitly by PortableText to its children, we just need to render PortableText */}
          <PortableText value={value.content} components={tightPtComponents} />
        </div>
      )
    }
  },
  block: {
    h2: ({children}: any) => {
      const id = children?.toString().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
      return (
        <h2 id={id} className="text-[1.1rem] md:text-[1.3rem] font-bold text-white bg-[#397a9f] px-4 py-3 md:px-5 md:py-4 mt-10 mb-5 leading-snug scroll-mt-24 shadow-sm">
          {children}
        </h2>
      )
    },
    h3: ({children}: any) => {
      const id = children?.toString().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
      return (
        <div className="relative mt-8 mb-4 scroll-mt-24">
          <h3 id={id} className="text-lg md:text-xl font-bold text-gray-900 pb-2 border-b-2 border-gray-200 leading-snug">
            {children}
          </h3>
          <span className="absolute bottom-[-2px] left-0 w-2/5 h-[3px] bg-[#397a9f]" />
        </div>
      )
    },
    h4: ({children}: any) => {
      const id = children?.toString().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
      return (
        <h4 id={id} className="text-base md:text-lg font-bold text-gray-900 border-l-[6px] border-[#397a9f] bg-[#f0f8ff] rounded-r-md px-4 py-3 mt-6 mb-3 scroll-mt-24 leading-snug">
          {children}
        </h4>
      )
    },
    normal: ({children, value}: any) => {
      // Auto-detect bare URLs and render as embeds
      const rawText = value?.children?.map((c: any) => c.text || '').join('').trim();
      if (rawText) {
        // YouTube
        const ytMatch = rawText.match(/^https?:\/\/(www\.)?(youtube\.com\/watch\?.*v=|youtu\.be\/)([a-zA-Z0-9_-]+)/);
        if (ytMatch) {
          const videoId = ytMatch[3];
          return (
            <div className="my-8 aspect-video w-full rounded-2xl overflow-hidden shadow-sm">
              <iframe
                src={`https://www.youtube.com/embed/${videoId}`}
                title="YouTube video player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full border-0"
              />
            </div>
          );
        }
        // Instagram
        const igMatch = rawText.match(/^https?:\/\/(www\.)?instagram\.com\/(p|reels?|reel)\/([^/?]+)/);
        if (igMatch) {
          const shortcode = igMatch[3];
          return (
            <div className="my-8 flex justify-center w-full">
              <div className="w-full max-w-[540px] border border-gray-100 rounded-xl overflow-hidden shadow-sm bg-white">
                <iframe
                  src={`https://www.instagram.com/p/${shortcode}/embed`}
                  className="w-full"
                  height="600"
                  frameBorder="0"
                  scrolling="no"
                  allow="encrypted-media"
                />
              </div>
            </div>
          );
        }
        // Spotify
        const spotifyMatch = rawText.match(/^https?:\/\/open\.spotify\.com\/(show|episode|track|playlist)\/([^?&\s]+)/);
        if (spotifyMatch) {
          const embedId = `${spotifyMatch[1]}/${spotifyMatch[2]}`;
          return (
            <div className="my-10 w-full flex justify-center">
              <iframe
                style={{ borderRadius: '12px' }}
                src={`https://open.spotify.com/embed/${embedId}?utm_source=generator`}
                width="100%"
                height="352"
                frameBorder="0"
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
                className="shadow-sm border border-gray-100 max-w-3xl"
              />
            </div>
          );
        }
        // X / Twitter
        const twitterMatch = rawText.match(/^https?:\/\/(www\.)?(twitter|x)\.com\/.+\/status\/\d+/);
        if (twitterMatch) {
          return <TwitterEmbed url={rawText} />;
        }
      }
      return <p className="mb-6 leading-loose">{children}</p>;
    },
    blockquote: ({children}: any) => <blockquote className="border-l-4 border-blue-600 pl-6 italic text-gray-700 my-8 py-2">{children}</blockquote>
  }
}

// Tight components for Box and Kaiwa
const tightPtComponents: any = {
  ...ptComponents,
  block: {
    ...ptComponents.block,
    normal: ({children}: any) => <p className="mb-2 leading-normal">{children}</p>,
  }
}

export default async function ArticlePage(props: PostPageProps) {
  const { locale, slug } = await props.params

  const query = `*[_type == "post" && slug.current == $slug][0] {
    title,
    "slug": slug.current,
    "date": publishedAt,
    "updatedAt": coalesce(updatedAt, _updatedAt),
    excerpt,
    body,
    "categories": categories[]->{title, "slug": slug.current},
    "tags": tags[]->{title, "slug": slug.current},
    "author": author->{name, "bio": bio[0].children[0].text, image},
    "imageUrl": coalesce(mainImage.asset->url, body[_type == "image"][0].asset->url)
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

  const formattedUpdatedDate = post.updatedAt ? new Date(post.updatedAt).toLocaleDateString(locale === 'ja' ? 'ja-JP' : 'en-US', {
    year: 'numeric', month: 'short', day: 'numeric'
  }) : ''

  // Generate TOC
  const headings = extractHeadings(post.body || [])

  // Fetch related articles
  // Using a GROQ query that finds other posts sharing at least one category
  const relatedQuery = `*[_type == "post" && slug.current != $slug && count((categories[]->slug.current)[@ in $catSlugs]) > 0] | order(publishedAt desc)[0...2] {
    title, excerpt, "slug": slug.current, "date": publishedAt, "category": categories[0]->title, "imageUrl": coalesce(mainImage.asset->url, body[_type == "image"][0].asset->url)
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
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3 text-sm font-medium text-gray-500">
            <CategoryBadge name={categoryName} />
            {formattedDate && <time dateTime={post.date}>{formattedDate}</time>}
          </div>
          {formattedUpdatedDate && formattedUpdatedDate !== formattedDate && (
             <div className="flex items-center gap-1.5 text-xs font-medium text-gray-400 pl-1 mt-1">
               <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
               <time dateTime={post.updatedAt}>更新日: {formattedUpdatedDate}</time>
             </div>
          )}
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
          {/* Excerpt was removed here to prevent duplicating the first paragraph of the body */}
          
          <div className="prose prose-blue max-w-none text-sm text-black leading-loose tracking-wide whitespace-pre-wrap prose-p:text-black prose-headings:text-black prose-li:text-black prose-strong:text-black prose-ol:text-black prose-p:mb-6 prose-p:mt-0 prose-li:my-3">
            {post.body ? (() => {
               let contentBlocks = [...post.body];
               
               // Remove any top-level block that shares a _key with an inner block of a kaiwa
               // This fixes a migration artifact where the original text block was duplicated
               const kaiwaInnerKeys = new Set();
               contentBlocks.forEach(b => {
                 if (b._type === 'kaiwa' && b.content) {
                   b.content.forEach((inner: any) => {
                     if (inner._key) kaiwaInnerKeys.add(inner._key);
                   });
                 }
               });
               
               contentBlocks = contentBlocks.filter(b => {
                 // Skip normal text blocks that are actually inside a kaiwa block
                 if (b._type === 'block' && b._key && kaiwaInnerKeys.has(b._key)) {
                   return false; 
                 }
                 return true;
               });

               // If there was no mainImage, we assume the first image in the body is the featured image from WP migration.
               // We should remove it from the body only if mainImage was not set.
               if (!post.mainImage) {
                 const firstImgIndex = contentBlocks.findIndex(b => b._type === 'image');
                 if (firstImgIndex !== -1) {
                   contentBlocks.splice(firstImgIndex, 1);
                 }
               }
               const customPtComponents = {
                 ...ptComponents,
                 types: {
                   ...ptComponents.types,
                   toc: () => <TocBlock headings={headings} />
                 }
               };
               return <PortableText value={processKaiwaBlocks(contentBlocks)} components={customPtComponents} />;
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
               imageUrl={article.imageUrl}
             />
            ))}
          </div>
        </div>
      )}

    </article>
  )
}
