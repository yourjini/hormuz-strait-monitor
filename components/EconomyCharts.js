'use client'

export default function EconomyCharts({ data }) {
  if (!data) return null

  const indicators = [
    { key: 'oilPrice', data: data.oilPrice, color: '#f59e0b', bgColor: 'rgba(245,158,11,0.1)' },
    { key: 'gasPrice', data: data.gasPrice, color: '#ef4444', bgColor: 'rgba(239,68,68,0.1)' },
    { key: 'exchangeRate', data: data.exchangeRate, color: '#06b6d4', bgColor: 'rgba(6,182,212,0.1)' },
  ]

  return (
    <div className="space-y-4">
      {/* Top indicator cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {indicators.map(({ key, data: ind, color, bgColor }) => (
          <div key={key} className="rounded-lg border border-[#6b5432] bg-[#3a2d1c] p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-500">{ind.name}</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded font-bold"
                style={{ color, backgroundColor: bgColor }}>
                +{ind.changeWeek.toFixed(1)}% (주간)
              </span>
            </div>
            <div className="flex items-end gap-2 mb-3">
              <span className="text-3xl font-bold" style={{ color }}>
                {ind.current.toLocaleString()}
              </span>
              <span className="text-sm text-gray-500 mb-1">{ind.unit}</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-gray-400 mb-3">
              <span>봉쇄 전: {ind.preBlockade.toLocaleString()}</span>
              <span className="text-red-400">
                +{((ind.current - ind.preBlockade) / ind.preBlockade * 100).toFixed(1)}%
              </span>
            </div>
            {/* Mini chart */}
            <MiniChart history={ind.history} color={color} />
          </div>
        ))}
      </div>

      {/* Consumer prices */}
      <div className="rounded-lg border border-[#6b5432] bg-[#3a2d1c] p-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <span className="text-xs text-gray-500 uppercase tracking-wider">국내 물가 영향</span>
            <div className="flex items-end gap-2 mt-1">
              <span className="text-2xl font-bold text-red-400">{data.consumerPrice.current}%</span>
              <span className="text-sm text-gray-500">소비자물가 상승률</span>
              <span className="text-xs text-gray-500">(봉쇄 전 {data.consumerPrice.preBlockade}%)</span>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 sm:gap-3">
          {data.consumerPrice.items.map((item) => (
            <div key={item.name} className="rounded bg-[#1c1509] border border-[#6b5432]/50 p-3 text-center">
              <div className="text-xs text-gray-400 mb-1">{item.name}</div>
              {item.price && (
                <div className="text-sm font-bold text-gray-200">
                  {item.price.toLocaleString()}<span className="text-[10px] text-gray-500"> {item.unit}</span>
                </div>
              )}
              <div className="text-xs text-red-400 font-bold mt-0.5">+{item.change}%</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function MiniChart({ history, color }) {
  if (!history || history.length < 2) return null

  const values = history.map(h => h.value)
  const min = Math.min(...values) * 0.98
  const max = Math.max(...values) * 1.02
  const range = max - min || 1

  const width = 300
  const height = 60
  const points = history.map((h, i) => {
    const x = (i / (history.length - 1)) * width
    const y = height - ((h.value - min) / range) * height
    return `${x},${y}`
  })

  const areaPoints = `0,${height} ${points.join(' ')} ${width},${height}`

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-[60px]">
      {/* Area fill */}
      <polygon points={areaPoints} fill={color} opacity="0.08" />
      {/* Line */}
      <polyline
        points={points.join(' ')}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Current value dot */}
      {(() => {
        const lastX = width
        const lastY = height - ((values[values.length - 1] - min) / range) * height
        return <circle cx={lastX} cy={lastY} r="3" fill={color} />
      })()}
      {/* Date labels */}
      <text x="0" y={height + 12} fill="#4a5568" fontSize="8">{history[0].date.slice(5)}</text>
      <text x={width} y={height + 12} fill="#4a5568" fontSize="8" textAnchor="end">{history[history.length - 1].date.slice(5)}</text>
    </svg>
  )
}
