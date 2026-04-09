export default function Footer() {
  return (
    <footer className="border-t border-[#3d3526] mt-8 py-6 px-4">
      <div className="max-w-[1600px] mx-auto space-y-3">
        {/* Update schedule */}
        <div className="text-center text-[10px] text-gray-600">
          Hormuz Strait Monitor — 갱신 주기: 유가·환율 1시간 | 뉴스 3시간 | 봉쇄 현황 6시간 | 출처: Bloomberg, Reuters, CNBC, 연합뉴스 등
        </div>

        {/* Disclaimer */}
        <div className="rounded-lg border border-[#3d3526]/50 bg-[#211c15]/50 px-4 py-3 max-w-3xl mx-auto">
          <div className="text-[10px] text-amber-400/80 font-bold mb-1">면책 고지 (Disclaimer)</div>
          <p className="text-[10px] text-gray-500 leading-relaxed">
            본 사이트는 호르무즈 해협 관련 공개 정보를 정리·시각화한 <span className="text-gray-400">참고용 정보 서비스</span>입니다.
            제공되는 데이터는 실시간 데이터가 아니며, 실제 상황과 차이가 있을 수 있습니다.
            투자·경영 판단의 근거로 사용할 수 없으며, 이로 인한 손실에 대해 어떠한 책임도 지지 않습니다.
            정확한 정보는 Bloomberg, Reuters, 정부 공식 발표 등 원출처를 직접 확인하시기 바랍니다.
          </p>
        </div>

        {/* Copyright */}
        <div className="text-center text-[9px] text-gray-700">
          &copy; {new Date().getFullYear()} Hormuz Strait Monitor. 본 사이트는 교육·정보 제공 목적으로 운영됩니다.
        </div>
      </div>
    </footer>
  )
}
