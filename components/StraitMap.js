'use client'

import { useState, useRef, useCallback } from 'react'

export default function StraitMap({ ships = [], summary }) {
  const [hovered, setHovered] = useState(null)
  const [zoom, setZoom] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [dragging, setDragging] = useState(false)
  const dragStart = useRef(null)
  const svgRef = useRef(null)

  const MIN_ZOOM = 1
  const MAX_ZOOM = 3

  const handleZoomIn = () => setZoom(z => Math.min(z + 0.5, MAX_ZOOM))
  const handleZoomOut = () => {
    setZoom(z => {
      const next = Math.max(z - 0.5, MIN_ZOOM)
      if (next === MIN_ZOOM) setPan({ x: 0, y: 0 })
      return next
    })
  }
  const handleReset = () => { setZoom(1); setPan({ x: 0, y: 0 }) }

  const handleWheel = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    const delta = e.deltaY > 0 ? -0.25 : 0.25
    setZoom(z => {
      const next = Math.min(Math.max(z + delta, MIN_ZOOM), MAX_ZOOM)
      if (next === MIN_ZOOM) setPan({ x: 0, y: 0 })
      return next
    })
  }, [])

  // Attach wheel as non-passive so preventDefault works
  const wheelRef = useRef(null)
  const setRefs = useCallback((node) => {
    svgRef.current = node
    if (wheelRef.current) {
      wheelRef.current.removeEventListener('wheel', handleWheel)
    }
    if (node) {
      node.addEventListener('wheel', handleWheel, { passive: false })
    }
    wheelRef.current = node
  }, [handleWheel])

  const handlePointerDown = (e) => {
    if (zoom <= 1) return
    setDragging(true)
    dragStart.current = { x: e.clientX - pan.x, y: e.clientY - pan.y }
    e.currentTarget.setPointerCapture(e.pointerId)
  }
  const handlePointerMove = (e) => {
    if (!dragging || !dragStart.current) return
    const maxPan = (zoom - 1) * 175
    setPan({
      x: Math.min(maxPan, Math.max(-maxPan, e.clientX - dragStart.current.x)),
      y: Math.min(maxPan, Math.max(-maxPan, e.clientY - dragStart.current.y)),
    })
  }
  const handlePointerUp = () => { setDragging(false); dragStart.current = null }

  // Ship positions by zone
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
    trapped: '#ef4444', blocked: '#dc2626', waiting: '#ef4444',
    passing: '#22c55e', passed: '#06b6d4', diverted: '#f59e0b',
    escort: '#ffffff', patrol: '#a78bfa',
  }

  const typeLabels = {
    oil_tanker: '유조선', lng_carrier: 'LNG선', container: '컨테이너선',
    bulk_carrier: '벌크선', naval: '군함',
  }

  return (
    <div className="rounded-lg border border-[#3d3526] bg-[#241f16] p-4">
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

      <div className="relative overflow-hidden rounded-lg">
        {/* Ship stats overlay */}
        {summary && (
          <div className="absolute top-2 left-2 z-20 flex flex-wrap gap-1.5 sm:gap-2 max-w-[calc(100%-80px)]">
            <div className="bg-[#1a1610]/90 backdrop-blur border border-[#3d3526] rounded px-1.5 sm:px-2.5 py-1 sm:py-1.5 text-center">
              <div className="text-sm sm:text-lg font-black text-red-400 leading-none">{summary.trapped?.toLocaleString()}</div>
              <div className="text-[8px] sm:text-[9px] text-gray-400">고립</div>
            </div>
            <div className="bg-[#1a1610]/90 backdrop-blur border border-[#3d3526] rounded px-1.5 sm:px-2.5 py-1 sm:py-1.5 text-center">
              <div className="text-sm sm:text-lg font-black text-cyan-400 leading-none">{summary.koreanShips}</div>
              <div className="text-[8px] sm:text-[9px] text-gray-400">한국</div>
            </div>
            <div className="bg-[#1a1610]/90 backdrop-blur border border-[#3d3526] rounded px-1.5 sm:px-2.5 py-1 sm:py-1.5 text-center">
              <div className="text-sm sm:text-lg font-black text-green-400 leading-none">{summary.transitToday}</div>
              <div className="text-[8px] sm:text-[9px] text-gray-400">통과</div>
            </div>
            <div className="bg-[#1a1610]/90 backdrop-blur border border-[#3d3526] rounded px-1.5 sm:px-2.5 py-1 sm:py-1.5 text-center">
              <div className="text-sm sm:text-lg font-black text-amber-400 leading-none">{summary.insuranceSurcharge}%</div>
              <div className="text-[8px] sm:text-[9px] text-gray-400">보험료↑</div>
            </div>
          </div>
        )}

        {/* Zoom controls */}
        <div className="absolute top-2 right-2 z-20 flex flex-col gap-1">
          <button onClick={handleZoomIn} className="w-7 h-7 rounded bg-[#1a1610]/90 backdrop-blur border border-[#3d3526] text-gray-300 hover:text-white hover:border-cyan-500/50 flex items-center justify-center text-sm font-bold transition-colors">+</button>
          <button onClick={handleZoomOut} className="w-7 h-7 rounded bg-[#1a1610]/90 backdrop-blur border border-[#3d3526] text-gray-300 hover:text-white hover:border-cyan-500/50 flex items-center justify-center text-sm font-bold transition-colors">−</button>
          {zoom > 1 && (
            <button onClick={handleReset} className="w-7 h-7 rounded bg-[#1a1610]/90 backdrop-blur border border-[#3d3526] text-gray-400 hover:text-white hover:border-cyan-500/50 flex items-center justify-center text-[10px] transition-colors">⟲</button>
          )}
          {zoom > 1 && (
            <div className="text-[9px] text-center text-cyan-400 font-bold mt-0.5">{zoom.toFixed(1)}x</div>
          )}
        </div>

        {/* SVG map with zoom/pan */}
        <div
          ref={setRefs}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          style={{ cursor: zoom > 1 ? (dragging ? 'grabbing' : 'grab') : 'default', touchAction: 'none' }}
        >
          <svg
            viewBox="0 0 700 350"
            className="w-full h-auto"
            style={{
              minHeight: 250,
              transform: `scale(${zoom}) translate(${pan.x / zoom}px, ${pan.y / zoom}px)`,
              transformOrigin: 'center center',
              transition: dragging ? 'none' : 'transform 0.2s ease-out',
            }}
          >
            <defs>
              {/* Ocean gradient - sky blue */}
              <radialGradient id="oceanGrad" cx="50%" cy="50%" r="65%">
                <stop offset="0%" stopColor="#2a7ab5" />
                <stop offset="60%" stopColor="#1e6a9e" />
                <stop offset="100%" stopColor="#155880" />
              </radialGradient>
              {/* Land texture gradient */}
              <linearGradient id="landGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#8B7355" />
                <stop offset="50%" stopColor="#7a6548" />
                <stop offset="100%" stopColor="#6d5a3f" />
              </linearGradient>
            </defs>

            {/* Water background - bright sky blue */}
            <rect width="700" height="350" fill="url(#oceanGrad)" rx="8" />

            {/* Subtle wave pattern */}
            {[90, 160, 230].map(y => (
              <path key={`wave${y}`} d={`M 0 ${y} Q 175 ${y - 5}, 350 ${y} T 700 ${y}`} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
            ))}

            {/* Grid lines */}
            {[100, 200, 300, 400, 500, 600].map(x => (
              <line key={`gx${x}`} x1={x} y1="0" x2={x} y2="350" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />
            ))}
            {[70, 140, 210, 280].map(y => (
              <line key={`gy${y}`} x1="0" y1={y} x2="700" y2={y} stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />
            ))}

            {/* Iran (top landmass) - earth brown */}
            <path
              d="M 0 0 L 700 0 L 700 80 C 650 85, 600 95, 550 110 C 500 130, 460 150, 420 165 C 400 172, 380 170, 350 160 C 320 150, 300 135, 270 120 C 240 105, 200 95, 150 90 C 100 85, 50 80, 0 75 Z"
              fill="url(#landGrad)"
              stroke="#a08a6f"
              strokeWidth="1.2"
            />
            {/* Iran coastline highlight */}
            <path
              d="M 0 75 C 50 80, 100 85, 150 90 C 200 95, 240 105, 270 120 C 300 135, 320 150, 350 160 C 380 170, 400 172, 420 165 C 460 150, 500 130, 550 110 C 600 95, 650 85, 700 80"
              fill="none" stroke="#c4a97a" strokeWidth="0.8" opacity="0.5"
            />
            <text x="300" y="42" fill="#f5e6d0" fontSize="14" fontWeight="bold" textAnchor="middle" letterSpacing="3">IRAN</text>
            <text x="300" y="58" fill="#d4c4a8" fontSize="9" textAnchor="middle">이란</text>

            {/* UAE (bottom-left) - earth brown */}
            <path
              d="M 0 350 L 0 260 C 30 255, 60 250, 100 252 C 140 254, 180 260, 220 270 C 250 278, 270 290, 280 310 C 285 325, 285 340, 280 350 Z"
              fill="url(#landGrad)"
              stroke="#a08a6f"
              strokeWidth="1.2"
            />
            <path
              d="M 0 260 C 30 255, 60 250, 100 252 C 140 254, 180 260, 220 270 C 250 278, 270 290, 280 310"
              fill="none" stroke="#c4a97a" strokeWidth="0.8" opacity="0.5"
            />
            <text x="100" y="298" fill="#f5e6d0" fontSize="12" fontWeight="bold" textAnchor="middle" letterSpacing="2">UAE</text>
            <text x="100" y="314" fill="#d4c4a8" fontSize="8" textAnchor="middle">아랍에미리트</text>

            {/* Oman (bottom-right) - earth brown */}
            <path
              d="M 380 350 C 385 330, 400 305, 420 290 C 445 272, 475 260, 510 255 C 550 250, 590 252, 630 258 C 660 262, 685 270, 700 280 L 700 350 Z"
              fill="url(#landGrad)"
              stroke="#a08a6f"
              strokeWidth="1.2"
            />
            <path
              d="M 380 350 C 385 330, 400 305, 420 290 C 445 272, 475 260, 510 255 C 550 250, 590 252, 630 258 C 660 262, 685 270, 700 280"
              fill="none" stroke="#c4a97a" strokeWidth="0.8" opacity="0.5"
            />
            <text x="550" y="298" fill="#f5e6d0" fontSize="12" fontWeight="bold" textAnchor="middle" letterSpacing="2">OMAN</text>
            <text x="550" y="314" fill="#d4c4a8" fontSize="8" textAnchor="middle">오만</text>

            {/* Compass rose — top right */}
            <g transform="translate(655, 42)">
              <circle cx="0" cy="0" r="20" fill="rgba(0,0,0,0.35)" stroke="#c4a97a" strokeWidth="0.8" />
              <polygon points="0,-16 -3.5,-7 3.5,-7" fill="#ef4444" />
              <polygon points="0,16 -3.5,7 3.5,7" fill="#8aa4c0" />
              <polygon points="16,0 7,-3.5 7,3.5" fill="#8aa4c0" />
              <polygon points="-16,0 -7,-3.5 -7,3.5" fill="#8aa4c0" />
              <line x1="0" y1="-6" x2="0" y2="6" stroke="#c4a97a" strokeWidth="0.4" />
              <line x1="-6" y1="0" x2="6" y2="0" stroke="#c4a97a" strokeWidth="0.4" />
              <text x="0" y="-9.5" fill="#ef4444" fontSize="7" fontWeight="bold" textAnchor="middle">N</text>
              <text x="0" y="14.5" fill="#c4d8ee" fontSize="5.5" textAnchor="middle">S</text>
              <text x="11.5" y="2" fill="#c4d8ee" fontSize="5.5" textAnchor="middle">E</text>
              <text x="-11.5" y="2" fill="#c4d8ee" fontSize="5.5" textAnchor="middle">W</text>
            </g>

            {/* Shipping lanes - dashed */}
            <path
              d="M 100 200 C 200 195, 280 185, 350 190 C 400 195, 430 210, 500 230 C 550 240, 620 245, 680 240"
              fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="2" strokeDasharray="8 4"
            />
            <path
              d="M 100 220 C 200 215, 280 205, 350 210 C 400 215, 430 230, 500 250 C 550 258, 620 260, 680 255"
              fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="2" strokeDasharray="8 4"
            />

            {/* Zone labels */}
            <text x="130" y="165" fill="rgba(255,255,255,0.3)" fontSize="11" fontWeight="bold" textAnchor="middle">PERSIAN GULF</text>
            <text x="130" y="178" fill="rgba(255,255,255,0.2)" fontSize="8" textAnchor="middle">페르시아만</text>
            <text x="370" y="242" fill="rgba(255,255,255,0.3)" fontSize="9" fontWeight="bold" textAnchor="middle">STRAIT OF HORMUZ</text>
            <text x="370" y="254" fill="rgba(255,255,255,0.2)" fontSize="7" textAnchor="middle">호르무즈 해협</text>
            <text x="575" y="200" fill="rgba(255,255,255,0.3)" fontSize="11" fontWeight="bold" textAnchor="middle">GULF OF OMAN</text>
            <text x="575" y="213" fill="rgba(255,255,255,0.2)" fontSize="8" textAnchor="middle">오만만</text>

            {/* Blockade indicator - red zone */}
            <ellipse cx="370" cy="195" rx="55" ry="30" fill="rgba(239,68,68,0.12)" stroke="rgba(239,68,68,0.4)" strokeWidth="1.2" strokeDasharray="4 2" />
            <text x="370" y="176" fill="#ef4444" fontSize="8" fontWeight="bold" textAnchor="middle" className="animate-blink">⚠ BLOCKADE ZONE</text>

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
                  <circle cx={pos.x} cy={pos.y} r={r + 3} fill={color} opacity="0.2" />
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
        </div>

        {/* Hover tooltip */}
        {hovered && (
          <div className="absolute top-3 right-12 z-20 bg-[#211c15]/95 backdrop-blur border border-[#3d3526] rounded-lg p-3 text-xs shadow-lg min-w-[180px]">
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
