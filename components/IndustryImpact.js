'use client'

import { useState } from 'react'

const sectorIcons = {
  oil: '🛢️', plane: '✈️', ship: '🚢', factory: '🏭', farm: '🌾', building: '🏗️',
  globe: '🌍', gas: '💨', anchor: '⚓', chart: '📈',
}

export default function IndustryImpact({ data }) {
  const [tab, setTab] = useState('domestic')

  if (!data) return null

  const industries = tab === 'domestic' ? data.domestic : data.global

  return (
    <div className="rounded-lg border border-[#6b5432] bg-[#3a2d1c] p-4">
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs text-gray-500 uppercase tracking-wider">피해 산업 분석</span>
        <div className="flex gap-1">
          {[
            { key: 'domestic', label: '국내' },
            { key: 'global', label: '글로벌' },
          ].map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`text-xs px-3 py-1 rounded transition-colors ${
                tab === t.key
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                  : 'text-gray-400 border border-[#6b5432] hover:text-gray-200'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {industries.map((ind) => (
          <IndustryCard key={ind.name} industry={ind} />
        ))}
      </div>
    </div>
  )
}

function IndustryCard({ industry }) {
  const [expanded, setExpanded] = useState(false)

  const severityBars = Array.from({ length: 5 }, (_, i) => {
    const active = i < industry.severity
    const barColor = industry.severity >= 4
      ? (active ? 'bg-red-500' : 'bg-gray-700')
      : (active ? 'bg-amber-500' : 'bg-gray-700')
    return <div key={i} className={`w-5 h-1.5 rounded-full ${barColor}`} />
  })

  return (
    <div
      className="rounded-lg bg-[#1c1509] border border-[#6b5432]/50 p-3 cursor-pointer hover:border-cyan-500/20 transition-colors"
      onClick={() => setExpanded(!expanded)}
    >
      <div className="flex items-start gap-3">
        <span className="text-lg mt-0.5">{sectorIcons[industry.icon] || '📊'}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-bold text-gray-200">{industry.name}</span>
            <div className="flex items-center gap-2">
              <div className="flex gap-0.5">{severityBars}</div>
              <svg className={`w-3 h-3 text-gray-500 transition-transform ${expanded ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
          <p className="text-xs text-gray-400 leading-relaxed">{industry.description}</p>

          {expanded && (
            <div className="mt-3 pt-3 border-t border-[#6b5432]/50 space-y-2">
              <div className="text-xs">
                <span className="text-gray-500">영향: </span>
                <span className="text-gray-300">{industry.impact}</span>
              </div>
              {industry.companies?.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {industry.companies.map(c => (
                    <span key={c} className="text-[10px] px-1.5 py-0.5 rounded bg-[#3a2d1c] text-gray-400 border border-[#6b5432]/30">
                      {c}
                    </span>
                  ))}
                </div>
              )}
              {industry.regions?.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {industry.regions.map(r => (
                    <span key={r} className="text-[10px] px-1.5 py-0.5 rounded bg-[#3a2d1c] text-gray-400 border border-[#6b5432]/30">
                      {r}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
