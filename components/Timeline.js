'use client'

export default function Timeline({ data = [] }) {
  const statusColors = {
    blocked: { dot: 'bg-red-500', text: 'text-red-400', label: '봉쇄' },
    partially_blocked: { dot: 'bg-amber-500', text: 'text-amber-400', label: '부분봉쇄' },
    open: { dot: 'bg-green-500', text: 'text-green-400', label: '정상' },
  }

  return (
    <div className="rounded-lg border border-[#2a4a6f] bg-[#182f4a] p-4">
      <div className="text-xs text-gray-500 uppercase tracking-wider mb-3">Status Timeline</div>
      <div className="space-y-0 max-h-[300px] overflow-y-auto pr-2">
        {data.map((entry, idx) => {
          const config = statusColors[entry.status] || statusColors.open
          return (
            <div key={entry.id} className="relative pl-6 pb-4">
              {/* Vertical line */}
              {idx < data.length - 1 && (
                <div className="absolute left-[7px] top-3 bottom-0 w-px bg-[#2a4a6f]" />
              )}
              {/* Dot */}
              <div className={`absolute left-0 top-1 w-[15px] h-[15px] rounded-full ${config.dot} border-2 border-[#182f4a]`} />

              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${config.text} bg-[#142840]`}>
                      {config.label}
                    </span>
                    <span className="text-[10px] text-gray-500">{formatTime(entry.timestamp)}</span>
                  </div>
                  <div className="text-sm font-medium text-gray-200 mb-0.5">{entry.title}</div>
                  <div className="text-xs text-gray-400 leading-relaxed">{entry.description}</div>
                  <div className="text-[10px] text-gray-500 mt-1">— {entry.source}</div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function formatTime(dateStr) {
  const d = new Date(dateStr)
  const diff = Date.now() - d.getTime()

  // 미래 또는 24시간 이상이면 절대 시간
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
