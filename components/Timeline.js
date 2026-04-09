'use client'

import { useState } from 'react'

const sectorIcons = {
  blocked: '🚫',
  partially_blocked: '⚠️',
  open: '✅',
}

export default function Timeline({ data = [] }) {
  const [expanded, setExpanded] = useState(false)
  const displayData = expanded ? data : data.slice(0, 4)

  const statusColors = {
    blocked: { dot: 'bg-red-500', text: 'text-red-400', label: '봉쇄', bg: 'bg-red-500/10', ring: 'ring-red-500/30' },
    partially_blocked: { dot: 'bg-amber-500', text: 'text-amber-400', label: '부분봉쇄', bg: 'bg-amber-500/10', ring: 'ring-amber-500/30' },
    open: { dot: 'bg-green-500', text: 'text-green-400', label: '정상', bg: 'bg-green-500/10', ring: 'ring-green-500/30' },
  }

  return (
    <div className="rounded-lg border border-[#3d3526] bg-[#241f16] p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="text-xs text-gray-500 uppercase tracking-wider">Status Timeline</div>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#211c15] text-gray-400">{data.length}건</span>
        </div>
        {/* Mini status summary */}
        <div className="flex gap-1">
          {data.slice(0, 6).map((entry, i) => {
            const c = statusColors[entry.status] || statusColors.open
            return (
              <div key={i} className={`w-2.5 h-2.5 rounded-full ${c.dot} ${i === 0 ? 'ring-2 ' + c.ring : ''}`}
                title={entry.title}
              />
            )
          })}
          {data.length > 6 && <span className="text-[9px] text-gray-500 ml-1">+{data.length - 6}</span>}
        </div>
      </div>

      <div className="space-y-0">
        {displayData.map((entry, idx) => {
          const config = statusColors[entry.status] || statusColors.open
          const isFirst = idx === 0
          const prevStatus = idx > 0 ? displayData[idx - 1].status : null
          const statusChanged = prevStatus && prevStatus !== entry.status

          return (
            <div key={entry.id} className="relative pl-8 pb-5 group">
              {/* Vertical line */}
              {idx < displayData.length - 1 && (
                <div className="absolute left-[11px] top-6 bottom-0 w-0.5 bg-gradient-to-b from-[#3d3526] to-[#3d3526]/30" />
              )}

              {/* Dot with glow for latest */}
              <div className="absolute left-0 top-1">
                {isFirst && (
                  <div className={`absolute inset-0 w-6 h-6 -left-[3px] -top-[3px] rounded-full ${config.dot} opacity-20 animate-ping`} />
                )}
                <div className={`w-[22px] h-[22px] rounded-full ${config.bg} ring-2 ${config.ring} flex items-center justify-center`}>
                  <div className={`w-2.5 h-2.5 rounded-full ${config.dot}`} />
                </div>
              </div>

              {/* Content card */}
              <div className={`rounded-lg p-3 transition-colors ${
                isFirst
                  ? `${config.bg} border border-${entry.status === 'blocked' ? 'red' : 'amber'}-500/20`
                  : 'bg-[#211c15]/50 border border-transparent hover:border-[#3d3526]/50'
              }`}>
                {/* Header row */}
                <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                  <span className="text-base leading-none">{sectorIcons[entry.status] || '📌'}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${config.text} ${config.bg}`}>
                    {config.label}
                  </span>
                  {statusChanged && (
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400 font-bold">
                      상태변경
                    </span>
                  )}
                  {isFirst && (
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-red-500/15 text-red-400 font-bold animate-pulse">
                      LATEST
                    </span>
                  )}
                  <span className="text-[10px] text-gray-500 ml-auto shrink-0">{formatTime(entry.timestamp)}</span>
                </div>

                {/* Title */}
                <div className={`text-sm font-bold mb-1 ${isFirst ? 'text-gray-100' : 'text-gray-200'}`}>
                  {entry.title}
                </div>

                {/* Description */}
                <div className="text-xs text-gray-400 leading-relaxed">{entry.description}</div>

                {/* Source */}
                <div className="flex items-center gap-1.5 mt-2">
                  <svg className="w-3 h-3 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
                  </svg>
                  <span className="text-[10px] text-gray-500">{entry.source}</span>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Expand/Collapse */}
      {data.length > 4 && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full mt-2 py-2 rounded-lg border border-[#3d3526]/50 text-xs text-gray-400 hover:text-gray-200 hover:border-[#3d3526] transition-colors flex items-center justify-center gap-1.5"
        >
          {expanded ? (
            <>접기 <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" /></svg></>
          ) : (
            <>이전 이력 {data.length - 4}건 더 보기 <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg></>
          )}
        </button>
      )}
    </div>
  )
}

function formatTime(dateStr) {
  const d = new Date(dateStr)
  const diff = Date.now() - d.getTime()

  if (diff < 0 || diff >= 24 * 60 * 60 * 1000) {
    const month = d.getMonth() + 1
    const day = d.getDate()
    const h = d.getHours().toString().padStart(2, '0')
    const m = d.getMinutes().toString().padStart(2, '0')
    return `${month}/${day} ${h}:${m}`
  }

  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `${mins}분 전`
  const hours = Math.floor(mins / 60)
  const remainMins = mins % 60
  return remainMins > 0 ? `${hours}시간 ${remainMins}분 전` : `${hours}시간 전`
}
