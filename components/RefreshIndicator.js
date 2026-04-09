'use client'

import { useEffect, useState } from 'react'

/**
 * 마지막 갱신 시각을 보여주는 작은 인디케이터.
 * "HH:MM:SS · N초 전" 포맷. 1초마다 상대시간 재계산.
 */
export default function RefreshIndicator({ lastRefresh, refreshing, intervalLabel = '1분' }) {
  const [, tick] = useState(0)

  useEffect(() => {
    const id = setInterval(() => tick(t => t + 1), 1000)
    return () => clearInterval(id)
  }, [])

  if (!lastRefresh) return null

  const d = lastRefresh instanceof Date ? lastRefresh : new Date(lastRefresh)
  const hh = d.getHours().toString().padStart(2, '0')
  const mm = d.getMinutes().toString().padStart(2, '0')
  const ss = d.getSeconds().toString().padStart(2, '0')

  const diffSec = Math.max(0, Math.floor((Date.now() - d.getTime()) / 1000))
  let rel
  if (diffSec < 60) rel = `${diffSec}초 전`
  else if (diffSec < 3600) rel = `${Math.floor(diffSec / 60)}분 ${diffSec % 60}초 전`
  else rel = `${Math.floor(diffSec / 3600)}시간 전`

  return (
    <div className="flex items-center justify-end gap-2 text-[10px] text-[#8a7e6a]">
      <div className="flex items-center gap-1.5">
        {refreshing ? (
          <>
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-amber-300">갱신 중…</span>
          </>
        ) : (
          <>
            <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
            <span>
              마지막 갱신 <span className="text-[#c4b89a] font-mono tabular-nums">{hh}:{mm}:{ss}</span>
              <span className="text-[#6b5432]"> · {rel}</span>
            </span>
          </>
        )}
      </div>
      <span className="text-[#6b5432]">/ {intervalLabel}마다 자동</span>
    </div>
  )
}
