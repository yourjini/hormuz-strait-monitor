'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navItems = [
  { href: '/', label: 'Monitoring', labelKo: '해협 현황' },
  { href: '/economy', label: 'Economic Impact', labelKo: '경제 영향' },
  { href: '/calculator', label: 'Wallet Calculator', labelKo: '내 지갑 계산기' },
]

export default function Header() {
  const pathname = usePathname()

  return (
    <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-4 sm:px-8 h-14 sm:h-16 bg-[#031428] border-b border-white/5">
      <div className="flex items-center gap-4 sm:gap-8">
        <Link href="/" className="text-lg sm:text-xl font-bold tracking-widest text-primary uppercase font-headline">
          HORMUZ SENTINEL
        </Link>
        <nav className="hidden md:flex gap-4 sm:gap-6">
          {navItems.map(item => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`pb-1 font-medium transition-all text-sm ${
                  isActive
                    ? 'text-primary border-b-2 border-primary font-bold'
                    : 'text-slate-400 hover:text-[#22d3ee]'
                }`}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>
        {/* Mobile nav */}
        <nav className="flex md:hidden gap-2 overflow-x-auto scrollbar-hide">
          {navItems.map(item => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`text-[11px] whitespace-nowrap px-2 py-1 rounded font-medium transition-all ${
                  isActive
                    ? 'text-primary bg-primary/10'
                    : 'text-slate-400'
                }`}
              >
                {item.labelKo}
              </Link>
            )
          })}
        </nav>
      </div>
      <div className="flex items-center gap-3">
        <div className="hidden lg:flex items-center gap-3 text-[10px] text-slate-500">
          <span>유가·환율 <span className="text-primary/70">1h</span></span>
          <span>뉴스 <span className="text-primary/70">3h</span></span>
          <span>봉쇄현황 <span className="text-primary/70">6h</span></span>
        </div>
        <div className="flex items-center gap-1.5 bg-primary/10 px-2 py-1 rounded">
          <div className="w-2 h-2 rounded-full bg-primary animate-ping opacity-75" />
          <div className="w-1.5 h-1.5 rounded-full bg-primary absolute" />
          <span className="text-[10px] sm:text-xs text-primary font-bold uppercase tracking-widest">Live</span>
        </div>
      </div>
    </header>
  )
}
