import { NextResponse } from 'next/server';
import { JSDOM } from 'jsdom';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url');

  if (!url) {
    return NextResponse.json({ error: 'URL is required' }, { status: 400 });
  }

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch URL: ${response.statusText}`);
    }

    const html = await response.text();
    const dom = new JSDOM(html);
    const doc = dom.window.document;

    const getMeta = (property: string) => 
      doc.querySelector(`meta[property="${property}"]`)?.getAttribute('content') ||
      doc.querySelector(`meta[name="${property}"]`)?.getAttribute('content');

    const title = getMeta('og:title') || doc.title || '';
    const description = getMeta('og:description') || getMeta('description') || '';
    const image = getMeta('og:image') || '';

    return NextResponse.json({
      title,
      description,
      image,
    });
  } catch (error: any) {
    console.error('OG fetch error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
