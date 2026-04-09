'use client'

export default function ShipStats({ data }) {
  if (!data?.summary) return null
  const s = data.summary

  const cards = [
    {
      label: '고립 선박',
      value: s.trapped,
      detail: s.trappedDetail,
      unit: '척',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126z" />
        </svg>
      ),
      color: 'text-red-400',
      bg: 'bg-red-500/10',
    },
    {
      label: '한국 선박',
      value: s.koreanShips,
      detail: '페르시아만 내 고립',
      unit: '척',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 3v1.5M3 21v-6m0 0l2.77-.693a9 9 0 016.208.682l.108.054a9 9 0 006.086.71l3.114-.732a48.524 48.524 0 01-.005-10.499l-3.11.732a9 9 0 01-6.085-.711l-.108-.054a9 9 0 00-6.208-.682L3 4.5M3 15V4.5" />
        </svg>
      ),
      color: 'text-cyan-400',
      bg: 'bg-cyan-500/10',
    },
    {
      label: '오늘 통과',
      value: s.transitToday,
      detail: `정상 대비 ${s.transitPercent}% (정상 ${s.normalTransitDaily}척/일)`,
      unit: '척',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
        </svg>
      ),
      color: 'text-green-400',
      bg: 'bg-green-500/10',
    },
    {
      label: '전쟁위험 할증료',
      value: s.insuranceSurcharge,
      detail: `War Risk Premium · 평균 대기 ${s.avgWaitDays}일`,
      unit: '%',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'text-amber-400',
      bg: 'bg-amber-500/10',
    },
  ]

  return (
    <div className="grid grid-cols-2 gap-3">
      {cards.map((card) => (
        <div key={card.label} className="rounded-lg border border-[#6b5432] bg-[#3a2d1c] p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className={`${card.bg} ${card.color} p-1.5 rounded`}>{card.icon}</div>
            <span className="text-xs text-gray-400">{card.label}</span>
          </div>
          <div className="flex items-end gap-2">
            <span className={`text-2xl font-bold ${card.color}`}>{card.value.toLocaleString()}</span>
            <span className="text-sm text-gray-500 mb-0.5">{card.unit}</span>
          </div>
          {card.detail && (
            <div className="text-[10px] text-gray-500 mt-1 leading-relaxed">{card.detail}</div>
          )}
        </div>
      ))}
    </div>
  )
}
