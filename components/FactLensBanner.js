'use client'

const FACTLENS_URL = 'https://p4-sigma-eight.vercel.app/'

/**
 * 페이지별 FactLens 배너
 * - dashboard: 가로형, 뉴스 섹션 위
 * - economy: 세로 카드형, 사이드 또는 중간
 * - calculator: 슬림 바, 결과 아래
 */
export function DashboardBanner() {
  return (
    <a
      href={FACTLENS_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="block w-full rounded-xl overflow-hidden border border-[#3d3526] hover:border-amber-500/40 transition-all hover:shadow-lg group"
    >
      <div className="bg-gradient-to-r from-[#1a1610] via-[#2a2118] to-[#1a1610] px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 sm:gap-4 min-w-0">
          <div className="text-2xl sm:text-3xl shrink-0">🔍</div>
          <div className="min-w-0">
            <div className="text-[#e8dcc8] font-bold text-xs sm:text-sm">
              이 뉴스, 진짜일까? — AI 팩트체크로 확인
            </div>
            <div className="text-[#8a7e6a] text-[10px] sm:text-xs mt-0.5">
              호르무즈 관련 뉴스의 진위를 AI가 실시간 판별합니다
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="hidden sm:block w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
          <span className="bg-amber-500 text-[#1a1610] px-3 py-1.5 rounded-lg text-[11px] sm:text-xs font-bold whitespace-nowrap group-hover:bg-amber-400 transition-colors">
            FactLens 열기 →
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
      className="block rounded-xl overflow-hidden border border-[#3d3526] hover:border-blue-500/30 transition-all hover:shadow-lg group"
    >
      <div className="bg-gradient-to-b from-[#211c15] via-[#1a1a2e] to-[#211c15] px-5 py-6 text-center">
        <div className="text-3xl mb-3">🧠</div>
        <div className="text-[#e8dcc8] font-bold text-sm leading-tight mb-1">
          가짜 뉴스에 속지 마세요
        </div>
        <div className="text-blue-300 font-bold text-xs leading-tight mb-3">
          AI가 팩트를 검증합니다
        </div>
        <div className="text-[#6a6050] text-[10px] leading-snug mb-4">
          경제 뉴스 속 과장·왜곡·오보를<br />FactLens가 걸러드립니다
        </div>
        <span className="inline-block bg-blue-500 hover:bg-blue-400 text-white px-4 py-2 rounded-lg text-[11px] font-bold transition-colors">
          팩트체크 해보기 →
        </span>
        <div className="text-[#4a4030] text-[9px] mt-3">AD · FactLens</div>
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
      className="block w-full rounded-lg overflow-hidden border border-[#3d3526] hover:border-emerald-500/30 transition-all group"
    >
      <div className="bg-gradient-to-r from-[#211c15] to-[#1a2018] px-4 py-2.5 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-lg">✅</span>
          <span className="text-[#c4b89a] text-xs font-medium truncate">
            "유가 200달러 간다" 진짜일까? — AI 팩트체크
          </span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-emerald-300 text-xs font-medium whitespace-nowrap group-hover:text-emerald-200">
            확인하기 →
          </span>
        </div>
      </div>
    </a>
  )
}
