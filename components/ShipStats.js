'use client'

export default function ShipStats({ data }) {
  if (!data?.summary) return null
  const s = data.summary

  const cards = [
    {
      label: '대기 선박',
      value: s.waiting,
      prev: s.waitingYesterday,
      unit: '척',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'text-red-400',
      bg: 'bg-red-500/10',
    },
    {
      label: '오늘 통과',
      value: s.passedToday,
      prev: s.passedYesterday,
      unit: '척',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
        </svg>
      ),
      color: 'text-green-400',
      bg: 'bg-green-500/10',
      invertTrend: true,
    },
    {
      label: '평균 대기',
      value: s.avgWaitHours,
      prev: s.avgWaitYesterday,
      unit: '시간',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'text-amber-400',
      bg: 'bg-amber-500/10',
    },
    {
      label: '유조선 대기',
      value: s.oilTankers,
      prev: s.oilTankersYesterday,
      unit: '척',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z" />
        </svg>
      ),
      color: 'text-cyan-400',
      bg: 'bg-cyan-500/10',
    },
  ]

  return (
    <div className="grid grid-cols-2 gap-3">
      {cards.map((card) => {
        const diff = card.value - card.prev
        const isUp = diff > 0
        const isNeutral = diff === 0
        const trendBad = card.invertTrend ? !isUp : isUp

        return (
          <div key={card.label} className="rounded-lg border border-[#1e3a5f] bg-[#111d32] p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className={`${card.bg} ${card.color} p-1.5 rounded`}>{card.icon}</div>
              <span className="text-xs text-gray-400">{card.label}</span>
            </div>
            <div className="flex items-end gap-2">
              <span className={`text-2xl font-bold ${card.color}`}>{card.value}</span>
              <span className="text-sm text-gray-500 mb-0.5">{card.unit}</span>
            </div>
            {!isNeutral && (
              <div className={`flex items-center gap-1 mt-1 text-xs ${trendBad ? 'text-red-400' : 'text-green-400'}`}>
                <span>{isUp ? '▲' : '▼'}</span>
                <span>{Math.abs(diff).toFixed(diff % 1 ? 1 : 0)} vs 어제</span>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
