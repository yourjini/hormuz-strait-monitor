'use client'

export default function StatusPanel({ data }) {
  if (!data) return null

  const statusConfig = {
    blocked: { label: 'BLOCKED', labelKo: '전면 봉쇄', color: 'bg-red-500', text: 'text-red-400', pulse: 'status-pulse-red', border: 'border-red-500/30' },
    partially_blocked: { label: 'PARTIAL', labelKo: '부분 봉쇄', color: 'bg-amber-500', text: 'text-amber-400', pulse: 'status-pulse-amber', border: 'border-amber-500/30' },
    open: { label: 'OPEN', labelKo: '정상 통항', color: 'bg-green-500', text: 'text-green-400', pulse: '', border: 'border-green-500/30' },
  }

  const config = statusConfig[data.status] || statusConfig.open
  const daysSinceStart = data.blockadeStarted
    ? Math.floor((Date.now() - new Date(data.blockadeStarted).getTime()) / (1000 * 60 * 60 * 24))
    : 0

  const updatedAgo = getRelativeTime(data.updatedAt)

  return (
    <div className={`rounded-lg border ${config.border} bg-[#111d32] p-5`}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Strait Status</div>
          <div className="flex items-center gap-3">
            <div className={`w-4 h-4 rounded-full ${config.color} ${config.pulse}`} />
            <span className={`text-2xl font-bold ${config.text}`}>{config.label}</span>
            <span className="text-sm text-gray-400">({config.labelKo})</span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs text-gray-500">봉쇄 경과</div>
          <div className="text-xl font-bold text-cyan-400">{daysSinceStart}일</div>
        </div>
      </div>

      {/* Severity */}
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xs text-gray-500 w-14">심각도</span>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map(i => (
            <div
              key={i}
              className={`w-6 h-2 rounded-full ${i <= data.severity ? config.color : 'bg-gray-700'}`}
            />
          ))}
        </div>
        <span className={`text-sm font-bold ${config.text}`}>{data.severity}/5</span>
      </div>

      {/* Lanes */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className={`rounded px-3 py-2 text-center text-sm ${data.inboundOpen ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
          <div className="text-xs opacity-70">Inbound (동향)</div>
          <div className="font-bold">{data.inboundOpen ? 'OPEN' : 'CLOSED'}</div>
        </div>
        <div className={`rounded px-3 py-2 text-center text-sm ${data.outboundOpen ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
          <div className="text-xs opacity-70">Outbound (서향)</div>
          <div className="font-bold">{data.outboundOpen ? 'OPEN' : 'CLOSED'}</div>
        </div>
      </div>

      {/* Description */}
      <p className="text-sm text-gray-300 leading-relaxed mb-3">{data.description}</p>

      {/* Footer */}
      <div className="flex items-center justify-between text-xs text-gray-500">
        <span>{updatedAgo} 업데이트</span>
        <span>출처: {data.source}</span>
      </div>
    </div>
  )
}

function getRelativeTime(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `${mins}분 전`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}시간 전`
  const days = Math.floor(hours / 24)
  return `${days}일 전`
}
