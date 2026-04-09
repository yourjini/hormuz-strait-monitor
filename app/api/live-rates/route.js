// Real-time oil price (Brent) and USD/KRW exchange rate.
// Both sources are free and key-less.
export const revalidate = 600 // 10 minutes server-side cache

export async function GET() {
  const [fxResult, oilResult] = await Promise.allSettled([
    fetchExchangeRate(),
    fetchOilPrice(),
  ])

  return Response.json(
    {
      exchangeRate: fxResult.status === 'fulfilled' ? fxResult.value : null,
      oilPrice: oilResult.status === 'fulfilled' ? oilResult.value : null,
      updatedAt: new Date().toISOString(),
      errors: {
        exchangeRate: fxResult.status === 'rejected' ? String(fxResult.reason) : null,
        oilPrice: oilResult.status === 'rejected' ? String(oilResult.reason) : null,
      },
    },
    {
      headers: {
        'Cache-Control': 'public, s-maxage=600, stale-while-revalidate=1800',
      },
    }
  )
}

async function fetchExchangeRate() {
  // open.er-api.com — free, no key, ~hourly updates
  const res = await fetch('https://open.er-api.com/v6/latest/USD', {
    next: { revalidate: 600 },
  })
  if (!res.ok) throw new Error(`fx http ${res.status}`)
  const json = await res.json()
  const krw = json?.rates?.KRW
  if (!krw) throw new Error('fx KRW missing')
  return {
    value: krw,
    base: 'USD',
    quote: 'KRW',
    updatedAt: json.time_last_update_utc || null,
    source: 'open.er-api.com',
  }
}

async function fetchOilPrice() {
  // Yahoo Finance unofficial chart endpoint for Brent crude (BZ=F)
  const url =
    'https://query1.finance.yahoo.com/v8/finance/chart/BZ=F?interval=1d&range=5d'
  const res = await fetch(url, {
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36',
      Accept: 'application/json',
    },
    next: { revalidate: 600 },
  })
  if (!res.ok) throw new Error(`oil http ${res.status}`)
  const json = await res.json()
  const meta = json?.chart?.result?.[0]?.meta
  const price = meta?.regularMarketPrice
  const prev = meta?.chartPreviousClose
  if (typeof price !== 'number') throw new Error('oil price missing')
  const changePct =
    typeof prev === 'number' && prev > 0 ? ((price - prev) / prev) * 100 : null
  return {
    value: price,
    previous: prev ?? null,
    changePct,
    currency: meta?.currency || 'USD',
    symbol: 'BZ=F',
    name: 'Brent',
    source: 'Yahoo Finance',
  }
}
