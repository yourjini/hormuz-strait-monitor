'use client'

import { useState } from 'react'

export default function StraitMap({ ships = [], summary }) {
  const [hovered, setHovered] = useState(null)

  // Ship positions by zone (randomized within zone bounds)
  const getShipPos = (ship, idx) => {
    const seed = ship.id.charCodeAt(3) + idx * 17
    const jitterX = (seed % 40) - 20
    const jitterY = ((seed * 7) % 30) - 15

    const zones = {
      persian_gulf: { cx: 150, cy: 180 },
      strait: { cx: 370, cy: 200 },
      gulf_of_oman: { cx: 540, cy: 220 },
    }
    const zone = zones[ship.zone] || zones.persian_gulf
    return { x: zone.cx + jitterX, y: zone.cy + jitterY }
  }

  const statusColors = {
    trapped: '#ef4444',
    blocked: '#dc2626',
    waiting: '#ef4444',
    passing: '#22c55e',
    passed: '#06b6d4',
    diverted: '#f59e0b',
    escort: '#ffffff',
    patrol: '#a78bfa',
  }

  const typeLabels = {
    oil_tanker: '유조선',
    lng_carrier: 'LNG선',
    container: '컨테이너선',
    bulk_carrier: '벌크선',
    naval: '군함',
  }

  return (
    <div className="rounded-lg border border-[#2a4a6f] bg-[#182f4a] p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="text-xs text-gray-500 uppercase tracking-wider">Strait Map</div>
        <div className="flex flex-wrap justify-end gap-x-2 gap-y-1 text-[9px] sm:text-[10px]">
          {Object.entries({ trapped: '고립', passing: '통과중', diverted: '우회', blocked: '봉쇄', escort: '호위', patrol: '순찰' }).map(([key, label]) => (
            <div key={key} className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full" style={{ backgroundColor: statusColors[key] }} />
              <span className="text-gray-400">{label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="relative">
        {/* Ship stats overlay */}
        {summary && (
          <div className="absolute top-2 left-2 z-10 flex flex-wrap gap-1.5 sm:gap-2 max-w-[calc(100%-16px)]">
            <div className="bg-[#0e1e30]/90 backdrop-blur border border-[#2a4a6f] rounded px-1.5 sm:px-2.5 py-1 sm:py-1.5 text-center">
              <div className="text-sm sm:text-lg font-black text-red-400 leading-none">{summary.trapped?.toLocaleString()}</div>
              <div className="text-[8px] sm:text-[9px] text-gray-400">고립</div>
            </div>
            <div className="bg-[#0e1e30]/90 backdrop-blur border border-[#2a4a6f] rounded px-1.5 sm:px-2.5 py-1 sm:py-1.5 text-center">
              <div className="text-sm sm:text-lg font-black text-cyan-400 leading-none">{summary.koreanShips}</div>
              <div className="text-[8px] sm:text-[9px] text-gray-400">한국</div>
            </div>
            <div className="bg-[#0e1e30]/90 backdrop-blur border border-[#2a4a6f] rounded px-1.5 sm:px-2.5 py-1 sm:py-1.5 text-center">
              <div className="text-sm sm:text-lg font-black text-green-400 leading-none">{summary.transitToday}</div>
              <div className="text-[8px] sm:text-[9px] text-gray-400">통과</div>
            </div>
            <div className="bg-[#0e1e30]/90 backdrop-blur border border-[#2a4a6f] rounded px-1.5 sm:px-2.5 py-1 sm:py-1.5 text-center">
              <div className="text-sm sm:text-lg font-black text-amber-400 leading-none">{summary.insuranceSurcharge}%</div>
              <div className="text-[8px] sm:text-[9px] text-gray-400">보험료↑</div>
            </div>
          </div>
        )}
        <svg viewBox="0 0 700 350" className="w-full h-auto" style={{ minHeight: 250 }}>
          {/* Water background — brighter ocean */}
          <rect width="700" height="350" fill="#132d4a" rx="8" />

          {/* Water gradient for depth feel */}
          <defs>
            <radialGradient id="waterGlow" cx="50%" cy="55%" r="60%">
              <stop offset="0%" stopColor="#1a3d5c" />
              <stop offset="100%" stopColor="#132d4a" />
            </radialGradient>
          </defs>
          <rect width="700" height="350" fill="url(#waterGlow)" rx="8" />

          {/* Grid lines — slightly brighter */}
          {[100, 200, 300, 400, 500, 600].map(x => (
            <line key={`gx${x}`} x1={x} y1="0" x2={x} y2="350" stroke="#1e3a5a" strokeWidth="0.5" />
          ))}
          {[70, 140, 210, 280].map(y => (
            <line key={`gy${y}`} x1="0" y1={y} x2="700" y2={y} stroke="#1e3a5a" strokeWidth="0.5" />
          ))}

          {/* Iran (top landmass) — brighter land */}
          <path
            d="M 0 0 L 700 0 L 700 80 C 650 85, 600 95, 550 110 C 500 130, 460 150, 420 165 C 400 172, 380 170, 350 160 C 320 150, 300 135, 270 120 C 240 105, 200 95, 150 90 C 100 85, 50 80, 0 75 Z"
            fill="#2a4a6f"
            stroke="#3d6490"
            strokeWidth="1"
          />
          <text x="300" y="55" fill="#7a9fc4" fontSize="14" fontWeight="bold" textAnchor="middle">IRAN</text>

          {/* UAE (bottom-left) */}
          <path
            d="M 0 350 L 0 260 C 30 255, 60 250, 100 252 C 140 254, 180 260, 220 270 C 250 278, 270 290, 280 310 C 285 325, 285 340, 280 350 Z"
            fill="#2a4a6f"
            stroke="#3d6490"
            strokeWidth="1"
          />
          <text x="100" y="310" fill="#7a9fc4" fontSize="12" fontWeight="bold" textAnchor="middle">UAE</text>

          {/* Oman (bottom-right) */}
          <path
            d="M 380 350 C 385 330, 400 305, 420 290 C 445 272, 475 260, 510 255 C 550 250, 590 252, 630 258 C 660 262, 685 270, 700 280 L 700 350 Z"
            fill="#2a4a6f"
            stroke="#3d6490"
            strokeWidth="1"
          />
          <text x="550" y="310" fill="#7a9fc4" fontSize="12" fontWeight="bold" textAnchor="middle">OMAN</text>

          {/* Compass rose — top right */}
          <g transform="translate(655, 45)">
            {/* Compass circle */}
            <circle cx="0" cy="0" r="22" fill="#132d4a" stroke="#3d6490" strokeWidth="0.8" opacity="0.9" />
            {/* N arrow */}
            <polygon points="0,-18 -4,-8 4,-8" fill="#ef4444" />
            {/* S arrow */}
            <polygon points="0,18 -4,8 4,8" fill="#5a7a9f" />
            {/* E arrow */}
            <polygon points="18,0 8,-4 8,4" fill="#5a7a9f" />
            {/* W arrow */}
            <polygon points="-18,0 -8,-4 -8,4" fill="#5a7a9f" />
            {/* Cross lines */}
            <line x1="0" y1="-7" x2="0" y2="7" stroke="#3d6490" strokeWidth="0.5" />
            <line x1="-7" y1="0" x2="7" y2="0" stroke="#3d6490" strokeWidth="0.5" />
            {/* Labels */}
            <text x="0" y="-11" fill="#ef4444" fontSize="7" fontWeight="bold" textAnchor="middle">N</text>
            <text x="0" y="16" fill="#7a9fc4" fontSize="6" textAnchor="middle">S</text>
            <text x="13" y="2.5" fill="#7a9fc4" fontSize="6" textAnchor="middle">E</text>
            <text x="-13" y="2.5" fill="#7a9fc4" fontSize="6" textAnchor="middle">W</text>
          </g>

          {/* Strait channel - dashed shipping lanes — brighter */}
          <path
            d="M 100 200 C 200 195, 280 185, 350 190 C 400 195, 430 210, 500 230 C 550 240, 620 245, 680 240"
            fill="none"
            stroke="#3a6a9f"
            strokeWidth="2"
            strokeDasharray="8 4"
          />
          <path
            d="M 100 220 C 200 215, 280 205, 350 210 C 400 215, 430 230, 500 250 C 550 258, 620 260, 680 255"
            fill="none"
            stroke="#3a6a9f"
            strokeWidth="2"
            strokeDasharray="8 4"
          />

          {/* Zone labels — brighter */}
          <text x="130" y="170" fill="#3a6a9f" fontSize="11" fontWeight="bold" textAnchor="middle">PERSIAN GULF</text>
          <text x="370" y="240" fill="#3a6a9f" fontSize="9" textAnchor="middle">STRAIT OF HORMUZ</text>
          <text x="570" y="205" fill="#3a6a9f" fontSize="11" fontWeight="bold" textAnchor="middle">GULF OF OMAN</text>

          {/* Blockade indicator - red zone */}
          <ellipse cx="370" cy="195" rx="55" ry="30" fill="rgba(239,68,68,0.1)" stroke="rgba(239,68,68,0.35)" strokeWidth="1" strokeDasharray="4 2" />
          <text x="370" y="175" fill="#ef4444" fontSize="8" textAnchor="middle" className="animate-blink">⚠ BLOCKADE ZONE</text>

          {/* Ships */}
          {ships.map((ship, idx) => {
            const pos = getShipPos(ship, idx)
            const color = statusColors[ship.status] || '#666'
            const isNaval = ship.type === 'naval'
            const r = isNaval ? 5 : 4

            return (
              <g key={ship.id}
                onMouseEnter={() => setHovered(ship)}
                onMouseLeave={() => setHovered(null)}
                style={{ cursor: 'pointer' }}
              >
                <circle cx={pos.x} cy={pos.y} r={r + 3} fill={color} opacity="0.15" />
                <circle cx={pos.x} cy={pos.y} r={r} fill={color} stroke={isNaval ? '#fff' : 'none'} strokeWidth={isNaval ? 1 : 0} />
                {ship.status === 'passing' && (
                  <circle cx={pos.x} cy={pos.y} r={r + 6} fill="none" stroke={color} strokeWidth="0.5" opacity="0.5">
                    <animate attributeName="r" from={r + 2} to={r + 10} dur="2s" repeatCount="indefinite" />
                    <animate attributeName="opacity" from="0.6" to="0" dur="2s" repeatCount="indefinite" />
                  </circle>
                )}
              </g>
            )
          })}
        </svg>

        {/* Hover tooltip */}
        {hovered && (
          <div className="absolute top-3 right-3 bg-[#142840] border border-[#2a4a6f] rounded-lg p-3 text-xs shadow-lg min-w-[180px]">
            <div className="font-bold text-gray-100 mb-1">{hovered.name}</div>
            <div className="space-y-0.5 text-gray-400">
              <div>유형: <span className="text-gray-200">{typeLabels[hovered.type] || hovered.type}</span></div>
              <div>국적: <span className="text-gray-200">{hovered.flag}</span></div>
              <div>상태: <span style={{ color: statusColors[hovered.status] }}>{hovered.status.toUpperCase()}</span></div>
              {hovered.dwt && <div>DWT: <span className="text-gray-200">{(hovered.dwt / 1000).toFixed(0)}K</span></div>}
              {hovered.waitingSince && (
                <div>대기: <span className="text-gray-200">{getWaitTime(hovered.waitingSince)}</span></div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function getWaitTime(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const hours = Math.floor(diff / (1000 * 60 * 60))
  if (hours < 24) return `${hours}시간`
  const days = Math.floor(hours / 24)
  const rem = hours % 24
  return `${days}일 ${rem}시간`
}
