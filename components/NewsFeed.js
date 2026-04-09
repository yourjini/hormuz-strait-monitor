'use client'

export default function NewsFeed({ data = [] }) {
  const categoryConfig = {
    geopolitics: { label: '지정학', color: 'text-red-400 bg-red-500/10' },
    oil_market: { label: '유가', color: 'text-amber-400 bg-amber-500/10' },
    military: { label: '군사', color: 'text-purple-400 bg-purple-500/10' },
    shipping: { label: '해운', color: 'text-cyan-400 bg-cyan-500/10' },
    diplomacy: { label: '외교', color: 'text-blue-400 bg-blue-500/10' },
    domestic: { label: '국내', color: 'text-green-400 bg-green-500/10' },
  }

  return (
    <div className="rounded-lg border border-[#3d3526] bg-[#241f16] p-4 h-full flex flex-col">
      <div className="flex items-center justify-between mb-3">
        <div className="text-xs text-gray-500 uppercase tracking-wider">Related News</div>
        <div className="text-[10px] text-gray-500">{data.length}건</div>
      </div>
      <div className="flex-1 overflow-y-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 pr-1">
        {[...data].sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt)).map((article) => {
          const cat = categoryConfig[article.category] || { label: article.category, color: 'text-gray-400 bg-gray-500/10' }
          const isRecent = (Date.now() - new Date(article.publishedAt).getTime()) < 3 * 60 * 60 * 1000

          return (
            <a
              key={article.id}
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block rounded-lg border border-[#3d3526]/50 bg-[#211c15] p-3 hover:border-cyan-500/30 transition-colors group"
            >
              <div className="flex items-center gap-2 mb-1.5">
                <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${cat.color}`}>
                  {cat.label}
                </span>
                {isRecent && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded font-bold text-red-400 bg-red-500/10 animate-pulse">
                    LIVE
                  </span>
                )}
                <span className="text-[10px] text-gray-500 ml-auto">{formatNewsTime(article.publishedAt)}</span>
              </div>
              <div className="text-sm font-medium text-gray-200 group-hover:text-cyan-300 transition-colors mb-1 leading-snug">
                {article.headline}
              </div>
              <div className="text-xs text-gray-400 leading-relaxed line-clamp-2">
                {article.summary}
              </div>
              <div className="text-[10px] text-gray-500 mt-1.5">{article.source}</div>
            </a>
          )
        })}
      </div>
    </div>
  )
}

function formatNewsTime(dateStr) {
  const d = new Date(dateStr)
  const diff = Date.now() - d.getTime()

  if (diff < 0) {
    // 미래 날짜인 경우 절대 시간 표시
    return formatAbsolute(d)
  }

  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `${mins}분 전`
  const hours = Math.floor(mins / 60)
  const remainMins = mins % 60
  if (hours < 24) {
    return remainMins > 0 ? `${hours}시간 ${remainMins}분 전` : `${hours}시간 전`
  }
  const days = Math.floor(hours / 24)
  return `${days}일 전`
}

function formatAbsolute(d) {
  const m = (d.getMonth() + 1).toString().padStart(2, '0')
  const day = d.getDate().toString().padStart(2, '0')
  const h = d.getHours().toString().padStart(2, '0')
  const min = d.getMinutes().toString().padStart(2, '0')
  return `${m}.${day} ${h}:${min}`
}
