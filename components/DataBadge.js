'use client'

/**
 * 데이터 출처를 투명하게 표시하는 배지.
 *
 * kind:
 *  - 'live'     : 실시간 API 데이터 (녹색)
 *  - 'scenario' : 시나리오·샘플 데이터 (앰버) — 실제 AIS/공개 API가 없어 추정·구성한 데이터
 *  - 'curated'  : 언론/공공 발표 기반 큐레이션 (시안)
 */
export default function DataBadge({ kind = 'scenario', source, className = '' }) {
  const config = {
    live: {
      label: '실시간',
      dot: 'bg-green-500',
      text: 'text-green-400',
      bg: 'bg-green-500/10',
      border: 'border-green-500/20',
      tooltip: '외부 API로부터 실시간으로 가져온 데이터입니다.',
    },
    scenario: {
      label: '시나리오',
      dot: 'bg-amber-500',
      text: 'text-amber-400',
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/20',
      tooltip: '공개 AIS API가 유료이기 때문에, 언론·정부 발표·과거 사례 기반으로 구성한 시나리오 데이터입니다.',
    },
    curated: {
      label: '큐레이션',
      dot: 'bg-cyan-500',
      text: 'text-cyan-400',
      bg: 'bg-cyan-500/10',
      border: 'border-cyan-500/20',
      tooltip: '언론 보도·공공 발표를 수동 수집한 데이터입니다.',
    },
  }[kind] || null

  if (!config) return null

  return (
    <span
      title={`${config.tooltip}${source ? ` (출처: ${source})` : ''}`}
      className={`inline-flex items-center gap-1 text-[9px] px-1.5 py-0.5 rounded border ${config.bg} ${config.border} ${config.text} ${className}`}
    >
      <span className={`w-1 h-1 rounded-full ${config.dot} ${kind === 'live' ? 'animate-pulse' : ''}`} />
      {config.label}
      {source && <span className="text-[#8a7e6a] font-normal">· {source}</span>}
    </span>
  )
}
