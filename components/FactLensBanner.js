'use client'

const FACTLENS_URL = 'https://p4-sigma-eight.vercel.app/'

/**
 * FactLens 배너 — 다크 웜톤 사이트에서 확실히 "외부 광고"로 인지되도록
 * 의도적으로 **밝은 크림 배경 + 진한 텍스트 + AD 라벨**로 완전 반전.
 * 세 배너 모두 같은 디자인 언어, 크기/레이아웃만 다름.
 */

const BASE =
  'relative block overflow-hidden bg-[#f5f0e4] text-[#1a1509] ' +
  'border border-[#d4c4a8] ' +
  'shadow-[0_8px_24px_-6px_rgba(0,0,0,0.5),0_2px_0_rgba(255,255,255,0.15)_inset] ' +
  'hover:shadow-[0_12px_32px_-6px_rgba(0,0,0,0.6),0_2px_0_rgba(255,255,255,0.2)_inset] ' +
  'transition-shadow group'

function AdLabel({ size = 'md' }) {
  const sizeCls =
    size === 'sm' ? 'text-[8px] px-1.5 py-0.5' : 'text-[9px] px-2 py-0.5'
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-sm bg-[#1a1509] text-[#f5f0e4] font-black tracking-widest ${sizeCls}`}
    >
      AD
    </span>
  )
}

export function DashboardBanner() {
  return (
    <a
      href={FACTLENS_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={`${BASE} w-full rounded-xl`}
    >
      {/* 종이질감 도트 */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(#1a1509 1px, transparent 1px)',
          backgroundSize: '14px 14px',
        }}
      />

      <div className="relative px-4 sm:px-6 py-4 sm:py-5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 sm:gap-4 min-w-0">
          <div className="shrink-0 w-11 h-11 sm:w-12 sm:h-12 rounded-lg bg-[#1a1509] text-[#f5f0e4] flex items-center justify-center text-2xl">
            🔍
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <AdLabel />
              <span className="text-[10px] text-[#6b5432] font-semibold tracking-wide">
                FactLens · 파트너 서비스
              </span>
            </div>
            <div className="font-black text-sm sm:text-base leading-tight text-[#1a1509]">
              이 뉴스, <span className="underline decoration-2 underline-offset-2 decoration-[#d97706]">진짜일까?</span>
            </div>
            <div className="text-[#4d3c25] text-[11px] sm:text-xs mt-0.5 leading-snug">
              호르무즈 관련 뉴스의 진위를 AI가 실시간 판별합니다
            </div>
          </div>
        </div>

        <div className="shrink-0">
          <span className="inline-flex items-center gap-1 bg-[#1a1509] text-[#f5f0e4] px-3 sm:px-4 py-2 rounded-md text-[11px] sm:text-xs font-black whitespace-nowrap group-hover:bg-[#d97706] transition-colors">
            팩트체크 열기 →
          </span>
        </div>
      </div>
    </a>
  )
}

export function EconomyBanner() {
  return (
    <a
      href={FACTLENS_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={`${BASE} rounded-xl`}
    >
      {/* 종이질감 도트 */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(#1a1509 1px, transparent 1px)',
          backgroundSize: '14px 14px',
        }}
      />

      <div className="relative px-5 py-6 text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <AdLabel />
          <span className="text-[10px] text-[#6b5432] font-semibold tracking-wide">
            FactLens · 파트너 서비스
          </span>
        </div>

        <div className="w-14 h-14 mx-auto rounded-xl bg-[#1a1509] text-[#f5f0e4] flex items-center justify-center text-3xl mb-3">
          🧠
        </div>

        <div className="text-[#1a1509] font-black text-base leading-tight mb-1">
          가짜 뉴스에 속지 마세요
        </div>
        <div className="text-[#d97706] font-black text-xs leading-tight mb-3">
          AI가 팩트를 검증합니다
        </div>

        <div className="text-[#4d3c25] text-[11px] leading-snug mb-4">
          경제 뉴스 속 과장·왜곡·오보를
          <br />
          FactLens가 걸러드립니다
        </div>

        <span className="inline-block bg-[#1a1509] text-[#f5f0e4] px-5 py-2 rounded-md text-xs font-black group-hover:bg-[#d97706] transition-colors">
          팩트체크 해보기 →
        </span>
      </div>
    </a>
  )
}

export function CalculatorBanner() {
  return (
    <a
      href={FACTLENS_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={`${BASE} w-full rounded-lg`}
    >
      <div className="relative px-4 py-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="shrink-0 w-9 h-9 rounded-md bg-[#1a1509] text-[#f5f0e4] flex items-center justify-center text-lg">
            ✅
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 mb-0.5">
              <AdLabel size="sm" />
              <span className="text-[9px] text-[#6b5432] font-semibold">FactLens</span>
            </div>
            <div className="text-[#1a1509] text-xs sm:text-sm font-bold truncate">
              &ldquo;유가 200달러 간다&rdquo;{' '}
              <span className="underline decoration-2 underline-offset-2 decoration-[#d97706]">진짜일까?</span>
            </div>
          </div>
        </div>
        <div className="shrink-0">
          <span className="inline-block bg-[#1a1509] text-[#f5f0e4] px-3 py-1.5 rounded text-[11px] font-black whitespace-nowrap group-hover:bg-[#d97706] transition-colors">
            확인 →
          </span>
        </div>
      </div>
    </a>
  )
}
