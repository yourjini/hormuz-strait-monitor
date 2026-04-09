'use client'

import { useState } from 'react'

export default function Timeline({ data = [] }) {
  const [expanded, setExpanded] = useState(false)
  const displayData = expanded ? data : data.slice(0, 5)

  const statusBadge = {
    blocked: { label: 'Status Change', bg: 'bg-error-container', text: 'text-on-error-container' },
    partially_blocked: { label: 'Update', bg: 'bg-surface-variant', text: 'text-slate-400' },
    open: { label: 'Clear', bg: 'bg-green-500/15', text: 'text-green-400' },
  }

  return (
    <div className="bg-surface-container-low rounded-2xl p-5 sm:p-6 border border-white/5 flex flex-col h-full">
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-headline font-bold text-sm tracking-widest uppercase">Status Timeline</h3>
        <span className="text-[10px] text-primary bg-primary/10 px-2 py-0.5 rounded uppercase font-bold">Live</span>
      </div>

      <div className="flex-1 overflow-y-auto pr-1 space-y-5">
        {displayData.map((entry, idx) => {
          const isFirst = idx === 0
          const badge = statusBadge[entry.status] || statusBadge.partially_blocked
          const prevStatus = idx > 0 ? displayData[idx - 1].status : null
          const statusChanged = prevStatus && prevStatus !== entry.status

          return (
            <div key={entry.id} className={`relative pl-6 border-l border-white/10 ${!isFirst ? 'opacity-70' : ''}`}>
              {/* Dot */}
              <div className={`absolute -left-1 top-0 w-2 h-2 rounded-full ${
                isFirst ? 'bg-primary shadow-[0_0_8px_#8aebff]' : 'bg-slate-600'
              }`} />

              <div className="space-y-1">
                <div className="flex justify-between items-start gap-2">
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter">
                    {formatTime(entry.timestamp)}
                  </span>
                  <span className={`text-[8px] ${badge.bg} ${badge.text} px-1.5 py-0.5 rounded font-bold uppercase shrink-0`}>
                    {isFirst ? 'Latest' : statusChanged ? 'Status Change' : badge.label}
                  </span>
                </div>
                <h4 className="text-xs font-bold text-on-surface">{entry.title}</h4>
                <p className="text-[11px] text-on-surface-variant leading-relaxed">{entry.description}</p>
                <div className="text-[9px] text-slate-600">{entry.source}</div>
              </div>
            </div>
          )
        })}
      </div>

      {data.length > 5 && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-4 w-full py-2 text-[10px] uppercase tracking-widest text-primary/70 hover:text-primary border border-white/5 rounded-lg transition-colors font-bold"
        >
          {expanded ? '접기' : `이전 이력 ${data.length - 5}건 더 보기`}
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
