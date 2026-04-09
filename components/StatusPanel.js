'use client'

export default function StatusPanel({ data }) {
  if (!data) return null

  const statusConfig = {
    blocked: { label: 'BLOCKED', labelKo: '전면 봉쇄', color: 'bg-red-500', text: 'text-red-400', glow: 'shadow-red-500/20', border: 'border-red-500/30', barColor: '#ef4444' },
    partially_blocked: { label: 'PARTIAL', labelKo: '부분 봉쇄', color: 'bg-amber-500', text: 'text-amber-400', glow: 'shadow-amber-500/20', border: 'border-amber-500/30', barColor: '#f59e0b' },
    open: { label: 'OPEN', labelKo: '정상 통항', color: 'bg-green-500', text: 'text-green-400', glow: '', border: 'border-green-500/30', barColor: '#22c55e' },
  }

  const config = statusConfig[data.status] || statusConfig.open
  const daysSinceStart = data.blockadeStarted
    ? Math.floor((Date.now() - new Date(data.blockadeStarted).getTime()) / (1000 * 60 * 60 * 24))
    : 0

  const updatedAgo = getRelativeTime(data.updatedAt)

  // Blockade progress (out of 180 days as max scale)
  const progressPercent = Math.min((daysSinceStart / 180) * 100, 100)

  return (
    <div className={`rounded-lg border ${config.border} bg-[#3a2d1c] p-4 sm:p-5`}>
      {/* Status header - big and bold */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="text-[10px] text-gray-500 uppercase tracking-wider mb-2">Strait Status</div>
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="relative">
              <div className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full ${config.color}`} />
              <div className={`absolute inset-0 w-4 h-4 sm:w-5 sm:h-5 rounded-full ${config.color} animate-ping opacity-30`} />
            </div>
            <span className={`text-2xl sm:text-3xl font-black ${config.text} tracking-tight`}>{config.label}</span>
          </div>
          <span className="text-xs text-gray-400 ml-7 sm:ml-8">{config.labelKo}</span>
        </div>
        <div className="text-right">
          <div className="text-[10px] text-gray-500 mb-1">봉쇄 경과</div>
          <div className="text-3xl sm:text-4xl font-black text-amber-300 leading-none">{daysSinceStart}</div>
          <div className="text-[10px] text-amber-300/60">일째</div>
        </div>
      </div>

      {/* Blockade duration progress bar */}
      <div className="mb-4">
        <div className="flex justify-between text-[9px] text-gray-500 mb-1">
          <span>2/28 봉쇄 시작</span>
          <span>180일 (6개월)</span>
        </div>
        <div className="h-2 bg-[#1c1509] rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-1000 relative"
            style={{
              width: `${progressPercent}%`,
              background: `linear-gradient(90deg, #f59e0b, ${config.barColor})`,
            }}
          >
            <div className="absolute right-0 top-0 w-2 h-full bg-white/30 rounded-full animate-pulse" />
          </div>
        </div>
        <div className="flex justify-between text-[9px] mt-1">
          <span className="text-gray-500">D+0</span>
          <span className={`font-bold ${config.text}`}>D+{daysSinceStart} (현재)</span>
          <span className="text-gray-600">D+180</span>
        </div>
      </div>

      {/* Severity meter - visual gauge */}
      <div className="flex items-center gap-3 mb-4 bg-[#1c1509] rounded-lg p-3">
        <span className="text-[10px] text-gray-500 shrink-0">위험도</span>
        <div className="flex-1 flex gap-1">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="flex-1 relative">
              <div className={`h-4 rounded ${i <= data.severity ? '' : 'bg-gray-700/50'}`}
                style={i <= data.severity ? {
                  background: i <= 2 ? '#f59e0b' : i <= 3 ? '#d97706' : '#ef4444',
                  boxShadow: i === data.severity ? `0 0 8px ${i <= 2 ? '#f59e0b' : '#ef4444'}40` : 'none',
                } : {}}
              />
              {i === data.severity && (
                <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[4px] border-r-[4px] border-t-[5px] border-transparent border-t-white/60" />
              )}
            </div>
          ))}
        </div>
        <span className={`text-lg font-black ${config.text} shrink-0`}>{data.severity}<span className="text-xs text-gray-500">/5</span></span>
      </div>

      {/* Lanes - inbound/outbound */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        <div className={`rounded-lg px-3 py-2.5 text-center ${data.inboundOpen ? 'bg-green-500/10 border border-green-500/20' : 'bg-red-500/8 border border-red-500/20'}`}>
          <div className="text-[10px] text-gray-400 mb-1">Inbound →</div>
          <div className={`text-sm font-black ${data.inboundOpen ? 'text-green-400' : 'text-red-400'}`}>
            {data.inboundOpen ? '✓ OPEN' : '✕ CLOSED'}
          </div>
          <div className="text-[9px] text-gray-500">동향 (페르시아만 → 오만만)</div>
        </div>
        <div className={`rounded-lg px-3 py-2.5 text-center ${data.outboundOpen ? 'bg-green-500/10 border border-green-500/20' : 'bg-red-500/8 border border-red-500/20'}`}>
          <div className="text-[10px] text-gray-400 mb-1">← Outbound</div>
          <div className={`text-sm font-black ${data.outboundOpen ? 'text-green-400' : 'text-red-400'}`}>
            {data.outboundOpen ? '✓ OPEN' : '✕ CLOSED'}
          </div>
          <div className="text-[9px] text-gray-500">서향 (오만만 → 페르시아만)</div>
        </div>
      </div>

      {/* Ceasefire banner */}
      {data.ceasefire?.active && (
        <div className="rounded-lg px-3 py-2.5 mb-4 bg-cyan-500/10 border border-cyan-500/20">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-base">🕊️</span>
            <span className="text-cyan-400 font-bold text-xs">휴전 진행중</span>
            <span className="text-[10px] text-gray-500">{data.ceasefire.duration} ({data.ceasefire.startDate?.slice(0, 10)}~)</span>
          </div>
          <p className="text-xs text-gray-400 leading-relaxed">{data.ceasefire.note}</p>
        </div>
      )}

      {/* Description */}
      <p className="text-sm text-gray-300 leading-relaxed mb-3">{data.description}</p>

      {/* Transit system */}
      {data.transitSystem && (
        <div className="rounded-lg bg-[#1c1509] border border-[#6b5432]/50 px-3 py-2.5 mb-3">
          <div className="text-[10px] text-gray-500 font-bold mb-2">이란 3단계 통행 체계</div>
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-xs">
              <span className="w-5 h-5 rounded bg-green-500/15 flex items-center justify-center text-green-400 text-[10px] shrink-0">1</span>
              <span className="text-green-400">{data.transitSystem.tier1}</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="w-5 h-5 rounded bg-amber-500/15 flex items-center justify-center text-amber-400 text-[10px] shrink-0">2</span>
              <span className="text-amber-400">{data.transitSystem.tier2}</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="w-5 h-5 rounded bg-red-500/15 flex items-center justify-center text-red-400 text-[10px] shrink-0">3</span>
              <span className="text-red-400">{data.transitSystem.tier3}</span>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between text-[10px] text-gray-500 pt-2 border-t border-[#6b5432]/30">
        <span>{updatedAgo} 업데이트</span>
        <span>출처: {data.source}</span>
      </div>
    </div>
  )
}

function getRelativeTime(dateStr) {
  const d = new Date(dateStr)
  const diff = Date.now() - d.getTime()

  if (diff < 0) {
    const m = (d.getMonth() + 1).toString().padStart(2, '0')
    const day = d.getDate().toString().padStart(2, '0')
    const h = d.getHours().toString().padStart(2, '0')
    const min = d.getMinutes().toString().padStart(2, '0')
    return `${m}.${day} ${h}:${min}`
  }

  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `${mins}분 전`
  const hours = Math.floor(mins / 60)
  const remainMins = mins % 60
  if (hours < 24) {
    return remainMins > 0 ? `${hours}시간 ${remainMins}분 전` : `${hours}시간 전`
  }
  const days = Math.floor(hours / 24)
  return `${days}일 전`
}
