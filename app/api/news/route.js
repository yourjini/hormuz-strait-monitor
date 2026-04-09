import { readFileSync } from 'fs'
import { join } from 'path'
import { NextResponse } from 'next/server'

const FILE = join(process.cwd(), 'data', 'news.json')

// 10분마다 재검증
export const revalidate = 600

/**
 * Google News RSS에서 "호르무즈 해협" 키워드 기사를 가져와 간단 파싱.
 * 키 불필요. CORS 이슈 없이 서버사이드에서 호출.
 */
const GOOGLE_NEWS_URL =
  'https://news.google.com/rss/search?q=%ED%98%B8%EB%A5%B4%EB%AC%B4%EC%A6%88+%ED%95%B4%ED%98%91&hl=ko&gl=KR&ceid=KR:ko'

async function fetchGoogleNews() {
  const res = await fetch(GOOGLE_NEWS_URL, {
    next: { revalidate: 600 },
    headers: {
      'User-Agent': 'Mozilla/5.0 (compatible; HormuzMonitor/1.0)',
    },
  })
  if (!res.ok) throw new Error(`Google News RSS ${res.status}`)
  const xml = await res.text()
  return parseRss(xml)
}

function parseRss(xml) {
  const items = []
  const itemRegex = /<item>([\s\S]*?)<\/item>/g
  let match
  while ((match = itemRegex.exec(xml)) !== null) {
    const block = match[1]
    const title = pick(block, 'title')
    const link = pick(block, 'link')
    const pubDate = pick(block, 'pubDate')
    const source = pick(block, 'source')
    const description = pick(block, 'description')

    if (!title || !link) continue

    items.push({
      id: `gn-${items.length}-${Date.parse(pubDate) || 0}`,
      headline: decode(title),
      summary: stripHtml(decode(description || '')).slice(0, 160),
      url: link.trim(),
      source: decode(source || 'Google News'),
      publishedAt: pubDate ? new Date(pubDate).toISOString() : new Date().toISOString(),
      category: inferCategory(title),
    })
  }
  return items.slice(0, 30)
}

function pick(block, tag) {
  const re = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`)
  const m = block.match(re)
  if (!m) return ''
  return m[1].replace(/^<!\[CDATA\[|\]\]>$/g, '').trim()
}

function stripHtml(s) {
  return s.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
}

function decode(s) {
  return s
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
}

function inferCategory(title) {
  const t = title.toLowerCase()
  if (/유가|oil|brent|wti|원유/.test(t)) return 'oil_market'
  if (/선박|화물|해운|탱커|유조선|tanker|shipping/.test(t)) return 'shipping'
  if (/미사일|드론|나포|공격|군|missile|drone|attack|military/.test(t)) return 'military'
  if (/외교|협상|대화|회담|diplomacy|talk/.test(t)) return 'diplomacy'
  if (/한국|국내|산업부|정부/.test(t)) return 'domestic'
  return 'geopolitics'
}

export async function GET() {
  try {
    const live = await fetchGoogleNews()
    if (live && live.length > 0) {
      return NextResponse.json(
        { items: live, source: 'live', provider: 'Google News' },
        {
          headers: {
            'Cache-Control': 'public, s-maxage=600, stale-while-revalidate=1800',
          },
        }
      )
    }
  } catch (err) {
    console.error('Google News fetch failed, falling back to sample:', err?.message)
  }

  // 폴백: 샘플 데이터
  const data = JSON.parse(readFileSync(FILE, 'utf-8'))
  return NextResponse.json({ items: data, source: 'sample', provider: '샘플' })
}
