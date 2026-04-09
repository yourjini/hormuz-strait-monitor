'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

const navItems = [
  { href: '/', label: '해협 현황', icon: 'M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418' },
  { href: '/economy', label: '경제 영향', icon: 'M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941' },
  { href: '/calculator', label: '내 지갑 계산기', icon: 'M15.75 15.75V18m-7.5-6.75h.008v.008H8.25v-.008zm0 2.25h.008v.008H8.25V13.5zm0 2.25h.008v.008H8.25v-.008zm0 2.25h.008v.008H8.25V18zm2.498-6.75h.007v.008h-.007v-.008zm0 2.25h.007v.008h-.007V13.5zm0 2.25h.007v.008h-.007v-.008zm0 2.25h.007v.008h-.007V18zm2.504-6.75h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V13.5zm0 2.25h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V18zm2.498-6.75h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V13.5zM8.25 6h7.5v2.25h-7.5V6zM12 2.25c-1.892 0-3.758.11-5.593.322C5.307 2.7 4.5 3.65 4.5 4.757V19.5a2.25 2.25 0 002.25 2.25h10.5a2.25 2.25 0 002.25-2.25V4.757c0-1.108-.806-2.057-1.907-2.185A48.507 48.507 0 0012 2.25z' },
]

export default function Header() {
  const pathname = usePathname()
  const [rates, setRates] = useState(null)

  useEffect(() => {
    let alive = true
    const load = async () => {
      try {
        const res = await fetch('/api/live-rates')
        if (!res.ok) return
        const json = await res.json()
        if (alive) setRates(json)
      } catch {}
    }
    load()
    const id = setInterval(load, 5 * 60 * 1000) // 5분마다 폴링
    return () => {
      alive = false
      clearInterval(id)
    }
  }, [])

  const oil = rates?.oilPrice
  const fx = rates?.exchangeRate
  const oilChange = oil?.changePct
  const oilUp = typeof oilChange === 'number' && oilChange >= 0

  return (
    <header className="border-b border-[#6b5432] bg-[#1c1509]/90 backdrop-blur sticky top-0 z-50">
      <div className="max-w-[1600px] mx-auto px-3 sm:px-4 py-2 sm:py-3 flex items-center justify-between">
        <div className="flex items-center gap-3 sm:gap-6 min-w-0">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <svg className="w-5 h-5 sm:w-6 sm:h-6 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3" />
            </svg>
            <div>
              <h1 className="text-sm sm:text-base font-bold text-[#e8dcc8] tracking-tight leading-none">HORMUZ</h1>
              <p className="text-[8px] sm:text-[9px] text-[#8a7e6a] hidden sm:block">호르무즈 해협 실시간 모니터링</p>
            </div>
          </Link>

          {/* Nav */}
          <nav className="flex gap-1 overflow-x-auto scrollbar-hide">
            {navItems.map(item => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 rounded text-[11px] sm:text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                    isActive
                      ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                      : 'text-[#8a7e6a] hover:text-[#c4b89a] border border-transparent hover:border-[#6b5432]'
                  }`}
                >
                  <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                  </svg>
                  <span className="hidden xs:inline sm:inline">{item.label}</span>
                </Link>
              )
            })}
          </nav>
        </div>

        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
          {/* 실시간 유가 · 환율 */}
          <div className="hidden md:flex items-center gap-3 pr-3 border-r border-[#6b5432]">
            <div className="flex flex-col items-end leading-tight" title={oil?.source ? `${oil.name} · ${oil.source}` : 'Brent crude'}>
              <span className="text-[9px] text-[#8a7e6a] uppercase tracking-wide">Brent</span>
              {oil?.value != null ? (
                <div className="flex items-baseline gap-1">
                  <span className="text-xs font-mono text-amber-300 font-semibold tabular-nums">
                    ${oil.value.toFixed(2)}
                  </span>
                  {typeof oilChange === 'number' && (
                    <span className={`text-[9px] font-mono tabular-nums ${oilUp ? 'text-red-400' : 'text-green-400'}`}>
                      {oilUp ? '▲' : '▼'}{Math.abs(oilChange).toFixed(2)}%
                    </span>
                  )}
                </div>
              ) : (
                <span className="text-xs font-mono text-[#5a5243]">—</span>
              )}
            </div>
            <div className="flex flex-col items-end leading-tight" title={fx?.source ? `USD/KRW · ${fx.source}` : 'USD/KRW'}>
              <span className="text-[9px] text-[#8a7e6a] uppercase tracking-wide">USD/KRW</span>
              {fx?.value != null ? (
                <span className="text-xs font-mono text-amber-300 font-semibold tabular-nums">
                  ₩{Math.round(fx.value).toLocaleString()}
                </span>
              ) : (
                <span className="text-xs font-mono text-[#5a5243]">—</span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-[10px] sm:text-xs text-green-400 font-medium">LIVE</span>
          </div>
        </div>
      </div>
    </header>
  )
}
