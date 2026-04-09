import { NextResponse } from 'next/server'

// 30분마다 재검증 (유가는 하루 단위로 갱신)
export const revalidate = 1800

/**
 * 한국석유공사 Opinet Open API로 국내 평균 유가 조회.
 *
 * 필요 환경변수: OPINET_API_KEY
 *   https://www.opinet.co.kr/user/main/mainView.do → 오픈API → 활용신청
 *
 * 응답 코드:
 *   B027: 휘발유 (가솔린)
 *   D047: 경유 (자동차용)
 *   B034: 실내등유
 *   K015: LPG
 */
const PRODUCT_LABELS = {
  B027: { name: '휘발유', unit: '원/L', icon: '⛽' },
  D047: { name: '경유', unit: '원/L', icon: '🛢️' },
  B034: { name: '실내등유', unit: '원/L', icon: '🔥' },
  K015: { name: 'LPG', unit: '원/L', icon: '💨' },
}

async function fetchOpinet(key) {
  const url = `https://www.opinet.co.kr/api/avgAllPrice.do?code=${key}&out=json`
  const res = await fetch(url, {
    next: { revalidate: 1800 },
    headers: { 'User-Agent': 'Mozilla/5.0 HormuzMonitor/1.0' },
  })
  if (!res.ok) throw new Error(`Opinet ${res.status}`)
  const json = await res.json()
  const rows = json?.RESULT?.OIL || []
  return rows
    .filter((r) => PRODUCT_LABELS[r.PRODCD])
    .map((r) => {
      const label = PRODUCT_LABELS[r.PRODCD]
      return {
        code: r.PRODCD,
        name: label.name,
        unit: label.unit,
        icon: label.icon,
        price: Number(r.PRICE),
        diff: Number(r.DIFF), // 전일 대비
        date: r.TRADE_DT,
      }
    })
}

// 폴백 샘플 (키 없거나 API 실패 시)
const SAMPLE = [
  { code: 'B027', name: '휘발유', unit: '원/L', icon: '⛽', price: 1980, diff: 8.3, date: '' },
  { code: 'D047', name: '경유', unit: '원/L', icon: '🛢️', price: 1820, diff: 12.1, date: '' },
  { code: 'B034', name: '실내등유', unit: '원/L', icon: '🔥', price: 1520, diff: 5.4, date: '' },
  { code: 'K015', name: 'LPG', unit: '원/L', icon: '💨', price: 1080, diff: 2.8, date: '' },
]

export async function GET() {
  const key = process.env.OPINET_API_KEY

  if (!key) {
    return NextResponse.json(
      {
        items: SAMPLE,
        source: 'sample',
        provider: '샘플',
        note: 'OPINET_API_KEY 환경변수가 설정되지 않음',
      },
      { headers: { 'Cache-Control': 'public, s-maxage=1800' } }
    )
  }

  try {
    const items = await fetchOpinet(key)
    if (items.length === 0) throw new Error('empty')
    return NextResponse.json(
      {
        items,
        source: 'live',
        provider: '한국석유공사 Opinet',
        updatedAt: new Date().toISOString(),
      },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=1800, stale-while-revalidate=3600',
        },
      }
    )
  } catch (err) {
    console.error('Opinet fetch failed:', err?.message)
    return NextResponse.json(
      { items: SAMPLE, source: 'sample', provider: '샘플 (API 오류)' },
      { headers: { 'Cache-Control': 'public, s-maxage=300' } }
    )
  }
}
