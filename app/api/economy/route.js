import { readFileSync } from 'fs'
import { join } from 'path'
import { NextResponse } from 'next/server'

const FILE = join(process.cwd(), 'data', 'economy.json')

// 10분 재검증
export const revalidate = 600

const YAHOO_BASE = 'https://query1.finance.yahoo.com/v8/finance/chart'
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'

/**
 * Yahoo Finance chart API에서 일별 종가 시리즈를 가져와서
 * [{date: 'YYYY-MM-DD', value: number}, ...] 형식으로 반환
 */
async function fetchHistory(symbol, range = '1mo') {
  const url = `${YAHOO_BASE}/${encodeURIComponent(symbol)}?interval=1d&range=${range}`
  const res = await fetch(url, {
    next: { revalidate: 600 },
    headers: { 'User-Agent': UA, Accept: 'application/json' },
  })
  if (!res.ok) throw new Error(`Yahoo ${symbol} ${res.status}`)
  const json = await res.json()
  const result = json?.chart?.result?.[0]
  if (!result) throw new Error(`Yahoo ${symbol} empty`)

  const timestamps = result.timestamp || []
  const closes = result.indicators?.quote?.[0]?.close || []
  const meta = result.meta || {}

  const history = timestamps
    .map((ts, i) => ({
      date: new Date(ts * 1000).toISOString().slice(0, 10),
      value: closes[i],
    }))
    .filter((p) => p.value != null)

  const last = history[history.length - 1]?.value
  const first = history[0]?.value
  const prev = history[history.length - 2]?.value
  const weekAgo = history[Math.max(0, history.length - 6)]?.value

  return {
    current: round(last, 2),
    previousClose: round(prev, 2),
    preBlockade: round(first, 2),
    change24h: last && prev ? round(((last - prev) / prev) * 100, 2) : 0,
    changeWeek: last && weekAgo ? round(((last - weekAgo) / weekAgo) * 100, 2) : 0,
    history: history.slice(-14).map((p) => ({ date: p.date, value: round(p.value, 2) })),
    meta: {
      currency: meta.currency,
      symbol: meta.symbol,
    },
  }
}

function round(v, d = 2) {
  if (v == null || Number.isNaN(v)) return null
  const m = Math.pow(10, d)
  return Math.round(v * m) / m
}

export async function GET() {
  const fallback = JSON.parse(readFileSync(FILE, 'utf-8'))

  // 병렬로 3개 심볼 조회 (일부 실패해도 나머지는 유지)
  const [oilR, gasR, fxR] = await Promise.allSettled([
    fetchHistory('BZ=F'), // Brent
    fetchHistory('NG=F'), // Henry Hub Natural Gas
    fetchHistory('KRW=X'), // USD/KRW
  ])

  const liveMeta = { oil: false, gas: false, fx: false }

  // Yahoo가 null을 주면 샘플을 그대로 유지 (렌더 크래시 방지)
  const isValid = (live) =>
    live &&
    typeof live.current === 'number' &&
    typeof live.changeWeek === 'number' &&
    Array.isArray(live.history) &&
    live.history.length > 0

  if (oilR.status === 'fulfilled' && isValid(oilR.value)) {
    liveMeta.oil = true
    const live = oilR.value
    fallback.oilPrice = {
      ...fallback.oilPrice,
      current: live.current,
      change24h: live.change24h ?? fallback.oilPrice.change24h,
      changeWeek: live.changeWeek,
      history: live.history,
      // preBlockade는 봉쇄 전 기준값이라 샘플 유지
    }
  }

  if (gasR.status === 'fulfilled' && isValid(gasR.value)) {
    liveMeta.gas = true
    const live = gasR.value
    fallback.gasPrice = {
      ...fallback.gasPrice,
      current: live.current,
      change24h: live.change24h ?? fallback.gasPrice.change24h,
      changeWeek: live.changeWeek,
      history: live.history,
    }
  }

  if (fxR.status === 'fulfilled' && isValid(fxR.value)) {
    liveMeta.fx = true
    const live = fxR.value
    fallback.exchangeRate = {
      ...fallback.exchangeRate,
      current: Math.round(live.current),
      change24h: live.change24h ?? fallback.exchangeRate.change24h,
      changeWeek: live.changeWeek,
      history: live.history.map((p) => ({ date: p.date, value: Math.round(p.value) })),
    }
  }

  fallback._meta = {
    live: liveMeta,
    updatedAt: new Date().toISOString(),
    provider: 'Yahoo Finance',
  }

  return NextResponse.json(fallback, {
    headers: {
      'Cache-Control': 'public, s-maxage=600, stale-while-revalidate=1800',
    },
  })
}
