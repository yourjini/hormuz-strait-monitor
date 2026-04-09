'use client'

export default function StatusPanel({ data }) {
  if (!data) return null

  const statusConfig = {
    blocked: { label: 'BLOCKED', labelKo: '전면 봉쇄', color: '#ef4444', textClass: 'text-red-400' },
    partially_blocked: { label: 'PARTIAL', labelKo: '부분 봉쇄', color: '#f59e0b', textClass: 'text-amber-400' },
    open: { label: 'OPEN', labelKo: '정상 통항', color: '#22c55e', textClass: 'text-green-400' },
  }

  const config = statusConfig[data.status] || statusConfig.open
  const daysSinceStart = data.blockadeStarted
    ? Math.floor((Date.now() - new Date(data.blockadeStarted).getTime()) / (1000 * 60 * 60 * 24))
    : 0

  // Efficiency percentage (inverse of severity)
  const efficiency = Math.max(100 - (data.severity * 15 + daysSinceStart * 0.3), 10)
  const effPercent = Math.round(efficiency)
  // SVG circle math
  const circumference = 2 * Math.PI * 70 // r=70
  const dashoffset = circumference - (circumference * effPercent) / 100

  const updatedAgo = getRelativeTime(data.updatedAt)

  return (
    <div className="space-y-6">
      {/* Row 1: Strait Status + Circular Gauge */}
      <div className="bg-surface-container-low p-6 sm:p-8 rounded-xl border border-white/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-3 text-center md:text-left">
            <h2 className="text-slate-500 font-headline uppercase tracking-[0.2em] text-xs">Current Strait Status</h2>
            <div className={`text-5xl sm:text-6xl md:text-7xl font-headline font-bold tracking-tighter ${config.textClass}`}>
              {config.label}
            </div>
            <p className="text-on-surface-variant text-sm max-w-xs leading-relaxed opacity-70">
              {data.description}
            </p>
            <div className="text-[10px] text-slate-500 mt-2">{updatedAgo} 업데이트 · {data.source}</div>
          </div>
          {/* Circular gauge */}
          <div className="relative w-36 h-36 sm:w-40 sm:h-40 flex items-center justify-center shrink-0">
            <svg className="w-full h-full transform -rotate-90">
              <circle className="text-surface-container-highest" cx="50%" cy="50%" fill="transparent" r="70" stroke="currentColor" strokeWidth="8" />
              <circle
                cx="50%" cy="50%" fill="transparent" r="70"
                stroke={config.color}
                strokeWidth="12"
                strokeDasharray={circumference}
                strokeDashoffset={dashoffset}
                strokeLinecap="round"
                className="transition-all duration-1000"
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-2xl sm:text-3xl font-headline font-bold text-white">{effPercent}%</span>
              <span className="text-[10px] uppercase text-slate-500 font-bold tracking-widest">Efficiency</span>
            </div>
          </div>
        </div>
      </div>

      {/* Row 2: Blockade Duration + Risk Scale */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Blockade Duration */}
        <div className="bg-surface-container-high p-6 rounded-xl border border-white/5 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-slate-500 font-headline uppercase tracking-widest text-[10px]">Blockade Duration</span>
            <span className="material-symbols-outlined text-primary/50">timer</span>
          </div>
          <div className="py-4">
            <div className="text-5xl font-headline font-bold text-on-surface tracking-tighter">
              {daysSinceStart} <span className="text-xl text-primary/60 font-light tracking-normal">DAYS</span>
            </div>
          </div>
          <div className="w-full bg-surface-container-lowest h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-primary h-full rounded-full transition-all duration-1000"
              style={{ width: `${Math.min((daysSinceStart / 180) * 100, 100)}%` }}
            />
          </div>
          <div className="flex justify-between text-[9px] text-slate-500 mt-1">
            <span>D+0</span>
            <span className="text-primary">D+{daysSinceStart}</span>
            <span>D+180</span>
          </div>
        </div>

        {/* Sector Risk Scale */}
        <div className="bg-surface-container-high p-6 rounded-xl border border-white/5 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-slate-500 font-headline uppercase tracking-widest text-[10px]">Sector Risk Scale</span>
            <span className="material-symbols-outlined text-error/50">warning</span>
          </div>
          <div className="flex items-end gap-1 py-4">
            {[1, 2, 3, 4, 5].map(i => (
              <div
                key={i}
                className={`w-8 rounded-sm transition-all ${i <= data.severity ? '' : 'border border-white/10'}`}
                style={{
                  height: `${i * 16 + 4}px`,
                  background: i <= data.severity
                    ? `rgba(138, 235, 255, ${0.2 + i * 0.2})`
                    : 'transparent',
                }}
              />
            ))}
            <div className="ml-4">
              <span className="text-4xl font-headline font-bold text-primary">
                0{data.severity}
              </span>
              <span className="text-sm text-slate-500 uppercase tracking-tighter ml-1">
                {data.severity >= 4 ? 'Critical' : data.severity >= 3 ? 'High' : data.severity >= 2 ? 'Medium' : 'Low'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Row 3: Lanes + Transit System */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Lanes */}
        <div className="bg-surface-container-high p-6 rounded-xl border border-white/5">
          <span className="text-slate-500 font-headline uppercase tracking-widest text-[10px]">Maritime Corridors</span>
          <div className="grid grid-cols-2 gap-3 mt-4">
            <div className={`rounded-lg px-3 py-3 text-center ${data.inboundOpen ? 'bg-green-500/10 border border-green-500/20' : 'bg-red-500/10 border border-red-500/20'}`}>
              <div className="text-[10px] text-slate-400 mb-1">Inbound →</div>
              <div className={`text-sm font-bold ${data.inboundOpen ? 'text-green-400' : 'text-red-400'}`}>
                {data.inboundOpen ? '✓ OPEN' : '✕ CLOSED'}
              </div>
              <div className="text-[9px] text-slate-500 mt-1">페르시아만 → 오만만</div>
            </div>
            <div className={`rounded-lg px-3 py-3 text-center ${data.outboundOpen ? 'bg-green-500/10 border border-green-500/20' : 'bg-red-500/10 border border-red-500/20'}`}>
              <div className="text-[10px] text-slate-400 mb-1">← Outbound</div>
              <div className={`text-sm font-bold ${data.outboundOpen ? 'text-green-400' : 'text-red-400'}`}>
                {data.outboundOpen ? '✓ OPEN' : '✕ CLOSED'}
              </div>
              <div className="text-[9px] text-slate-500 mt-1">오만만 → 페르시아만</div>
            </div>
          </div>
        </div>

        {/* Transit System */}
        {data.transitSystem && (
          <div className="bg-surface-container-high p-6 rounded-xl border border-white/5">
            <span className="text-slate-500 font-headline uppercase tracking-widest text-[10px]">Transit Protocol</span>
            <div className="space-y-2 mt-4">
              <div className="flex items-center gap-3 text-xs">
                <span className="w-6 h-6 rounded bg-green-500/15 flex items-center justify-center text-green-400 text-[10px] font-bold shrink-0">1</span>
                <span className="text-green-400">{data.transitSystem.tier1}</span>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <span className="w-6 h-6 rounded bg-amber-500/15 flex items-center justify-center text-amber-400 text-[10px] font-bold shrink-0">2</span>
                <span className="text-amber-400">{data.transitSystem.tier2}</span>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <span className="w-6 h-6 rounded bg-red-500/15 flex items-center justify-center text-red-400 text-[10px] font-bold shrink-0">3</span>
                <span className="text-red-400">{data.transitSystem.tier3}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Ceasefire banner */}
      {data.ceasefire?.active && (
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">🕊️</span>
            <span className="text-blue-400 font-headline font-bold text-sm">휴전 진행중</span>
            <span className="text-[10px] text-slate-500">{data.ceasefire.duration} ({data.ceasefire.startDate?.slice(0, 10)}~)</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">{data.ceasefire.note}</p>
        </div>
      )}
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
  if (hours < 24) return remainMins > 0 ? `${hours}시간 ${remainMins}분 전` : `${hours}시간 전`
  return `${Math.floor(hours / 24)}일 전`
}
