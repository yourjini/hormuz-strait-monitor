'use client'

import { useEffect, useState } from 'react'
import DataBadge from './DataBadge'

/**
 * 국내 평균 유가 (한국석유공사 Opinet Open API)
 * 30분마다 client-side polling
 */
export default function FuelPrices() {
  const [data, setData] = useState(null)

  useEffect(() => {
    let alive = true
    const load = async () => {
      try {
        const res = await fetch('/api/fuel-prices')
        if (!res.ok) return
        const json = await res.json()
        if (alive) setData(json)
      } catch {}
    }
    load()
    const id = setInterval(load, 30 * 60 * 1000)
    return () => {
      alive = false
      clearInterval(id)
    }
  }, [])

  if (!data) {
    return (
      <div className="rounded-lg border border-[#6b5432] bg-[#3a2d1c] p-4">
        <div className="text-xs text-gray-500 uppercase tracking-wider mb-2">국내 평균 유가</div>
        <div className="text-xs text-gray-500">로딩 중…</div>
      </div>
    )
  }

  const { items = [], source, provider, updatedAt } = data

  return (
    <div className="rounded-lg border border-[#6b5432] bg-[#3a2d1c] p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500 uppercase tracking-wider">국내 평균 유가</span>
          <DataBadge
            kind={source === 'live' ? 'live' : 'scenario'}
            source={provider || (source === 'live' ? 'Opinet' : '샘플')}
          />
        </div>
        {updatedAt && (
          <span className="text-[9px] text-[#6b5432]">
            {new Date(updatedAt).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {items.map((item) => {
          const up = item.diff > 0
          const down = item.diff < 0
          return (
            <div
              key={item.code}
              className="rounded-lg bg-[#1c1509] border border-[#6b5432]/50 p-3"
            >
              <div className="flex items-center gap-1.5 mb-1">
                <span className="text-base leading-none">{item.icon}</span>
                <span className="text-[11px] text-gray-400">{item.name}</span>
              </div>
              <div className="flex items-end gap-1">
                <span className="text-lg font-bold text-[#e8d9b8] font-mono tabular-nums">
                  {item.price.toLocaleString()}
                </span>
                <span className="text-[10px] text-gray-500 mb-0.5">{item.unit}</span>
              </div>
              <div
                className={`text-[10px] mt-0.5 ${
                  up ? 'text-red-400' : down ? 'text-green-400' : 'text-gray-500'
                }`}
              >
                전일 대비{' '}
                {up ? '▲' : down ? '▼' : '—'}
                {item.diff !== 0 && Math.abs(item.diff).toFixed(1)}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
