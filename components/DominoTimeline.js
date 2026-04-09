'use client'

import { useState } from 'react'
import DataBadge from './DataBadge'

export default function DominoTimeline({ data }) {
  const [selectedPhase, setSelectedPhase] = useState('day1')

  if (!data?.phases) return null

  const phase = data.phases.find(p => p.id === selectedPhase)

  return (
    <div className="rounded-lg border border-[#6b5432] bg-[#3a2d1c] p-4">
      <div className="flex items-center gap-2 mb-4">
        <div className="text-xs text-gray-500 uppercase tracking-wider">
          Domino Effect — 봉쇄 기간별 예상 충격
        </div>
        <DataBadge kind="scenario" />
      </div>

      {/* Phase selector - clickable timeline bar */}
      <div className="relative mb-6">
        {/* Background line */}
        <div className="absolute top-4 left-0 right-0 h-1 bg-[#6b5432] rounded-full" />

        {/* Progress fill */}
        <div
          className="absolute top-4 left-0 h-1 rounded-full transition-all duration-500"
          style={{
            width: `${(data.phases.findIndex(p => p.id === selectedPhase) / (data.phases.length - 1)) * 100}%`,
            background: phase?.color === 'red'
              ? 'linear-gradient(90deg, #f59e0b, #ef4444)'
              : 'linear-gradient(90deg, #06b6d4, #f59e0b)',
          }}
        />

        {/* Phase buttons */}
        <div className="relative flex justify-between">
          {data.phases.map((p, idx) => {
            const isActive = p.id === selectedPhase
            const isPast = idx <= data.phases.findIndex(pp => pp.id === selectedPhase)
            const dotColor = p.color === 'red' ? 'bg-red-500' : 'bg-amber-500'

            return (
              <button
                key={p.id}
                onClick={() => setSelectedPhase(p.id)}
                className="flex flex-col items-center gap-0.5 sm:gap-1 group"
              >
                <div className={`w-7 h-7 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-[10px] sm:text-xs font-bold border-2 transition-all duration-300 ${
                  isActive
                    ? `${dotColor} border-transparent text-white scale-110 shadow-lg`
                    : isPast
                      ? `${dotColor}/60 border-transparent text-white/80`
                      : 'bg-[#1c1509] border-[#6b5432] text-gray-500 group-hover:border-gray-400'
                }`}>
                  {p.label}
                </div>
                <span className={`text-[9px] sm:text-[10px] transition-colors ${isActive ? 'text-gray-200 font-bold' : 'text-gray-500'}`}>
                  <span className="hidden sm:inline">{p.period}</span>
                  <span className="sm:hidden">{p.label}</span>
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Selected phase content */}
      {phase && (
        <div className="animate-fadeIn">
          <div className="flex items-center gap-2 mb-4">
            <div className={`w-2 h-2 rounded-full ${phase.color === 'red' ? 'bg-red-500' : 'bg-amber-500'}`} />
            <h3 className="text-base font-bold text-gray-100">{phase.title}</h3>
          </div>

          <div className="space-y-2">
            {phase.effects.map((effect, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 rounded-lg bg-[#1c1509] border border-[#6b5432]/50 p-3"
              >
                {/* Severity indicator */}
                <div className="flex flex-col items-center gap-0.5 pt-0.5">
                  {[1, 2, 3, 4, 5].map(i => (
                    <div
                      key={i}
                      className={`w-1.5 h-1.5 rounded-full ${
                        i <= effect.severity
                          ? effect.severity >= 4 ? 'bg-red-500' : 'bg-amber-500'
                          : 'bg-gray-700'
                      }`}
                    />
                  ))}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                      effect.severity >= 4
                        ? 'text-red-400 bg-red-500/10'
                        : 'text-amber-400 bg-amber-500/10'
                    }`}>
                      {effect.sector}
                    </span>
                  </div>
                  <p className="text-sm text-gray-300 leading-relaxed">{effect.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
