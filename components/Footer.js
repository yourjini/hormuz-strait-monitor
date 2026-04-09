export default function Footer() {
  return (
    <footer className="w-full py-4 px-4 sm:px-8 border-t border-white/5 bg-[#031428]">
      <div className="max-w-screen-2xl mx-auto space-y-4">
        {/* Update schedule */}
        <div className="text-center text-[10px] text-slate-600 font-label uppercase tracking-widest">
          Hormuz Sentinel — 갱신 주기: 유가·환율 1시간 | 뉴스 3시간 | 봉쇄 현황 6시간 | 출처: Bloomberg, Reuters, CNBC, 연합뉴스 등
        </div>

        {/* Disclaimer */}
        <div className="rounded-lg border border-white/5 bg-surface-container-low px-4 py-3 max-w-3xl mx-auto">
          <div className="text-[10px] text-amber-400/80 font-bold mb-1">면책 고지 (Disclaimer)</div>
          <p className="text-[10px] text-slate-500 leading-relaxed">
            본 사이트는 호르무즈 해협 관련 공개 정보를 정리·시각화한 <span className="text-slate-400">참고용 정보 서비스</span>입니다.
            제공되는 데이터는 실시간 데이터가 아니며, 실제 상황과 차이가 있을 수 있습니다.
            투자·경영 판단의 근거로 사용할 수 없으며, 이로 인한 손실에 대해 어떠한 책임도 지지 않습니다.
            정확한 정보는 Bloomberg, Reuters, 정부 공식 발표 등 원출처를 직접 확인하시기 바랍니다.
          </p>
        </div>

        {/* Bottom row */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-2 text-[10px] text-slate-600 font-label uppercase tracking-widest">
          <span>&copy; {new Date().getFullYear()} HORMUZ SENTINEL. DATA CLASSIFICATION: PUBLIC.</span>
          <div className="flex gap-6">
            <span className="hover:text-white transition-colors cursor-pointer">Data Sources</span>
            <span className="hover:text-white transition-colors cursor-pointer">Legal Disclaimer</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
