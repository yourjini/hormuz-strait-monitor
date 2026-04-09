'use client'

const categoryConfig = {
  geopolitics: { label: 'Geopolitical', color: 'bg-primary/90 text-on-primary', icon: 'public' },
  oil_market: { label: 'Oil Market', color: 'bg-tertiary-container text-on-tertiary-container', icon: 'query_stats' },
  military: { label: 'Military', color: 'bg-error-container text-on-error-container', icon: 'security' },
  shipping: { label: 'Logistics', color: 'bg-secondary-container text-on-secondary-container', icon: 'anchor' },
  diplomacy: { label: 'Diplomacy', color: 'bg-blue-500/80 text-white', icon: 'handshake' },
  domestic: { label: 'Domestic', color: 'bg-green-500/80 text-white', icon: 'home' },
}

export default function NewsFeed({ data = [] }) {
  const sorted = [...data].sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))

  return (
    <section className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="font-headline font-bold text-xl tracking-tight text-white">Related Intelligence</h2>
        <span className="text-xs text-primary hover:underline cursor-pointer">{data.length}건</span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {sorted.map(article => {
          const cat = categoryConfig[article.category] || { label: article.category, color: 'bg-surface-variant text-slate-400', icon: 'article' }

          return (
            <a
              key={article.id}
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-surface-container-high rounded-xl overflow-hidden border border-white/5 hover:border-primary/20 transition-all cursor-pointer"
            >
              {/* Category color bar */}
              <div className="h-1 w-full" style={{ background: article.category === 'oil_market' ? '#ffb147' : article.category === 'geopolitics' ? '#8aebff' : article.category === 'military' ? '#ef4444' : '#a9c9f4' }} />

              <div className="p-5 space-y-3">
                <div className="flex items-center gap-2">
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-widest ${cat.color}`}>
                    {cat.label}
                  </span>
                </div>
                <h3 className="font-headline font-bold text-on-surface text-base leading-tight group-hover:text-primary transition-colors line-clamp-2">
                  {article.headline}
                </h3>
                <p className="text-[11px] text-on-surface-variant leading-relaxed line-clamp-2">
                  {article.summary}
                </p>
                <div className="flex items-center justify-between text-[10px] text-slate-500 font-medium pt-1">
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined" style={{ fontSize: '12px' }}>{cat.icon}</span>
                    {article.source}
                  </span>
                  <span>{formatNewsTime(article.publishedAt)}</span>
                </div>
              </div>
            </a>
          )
        })}
      </div>
    </section>
  )
}

function formatNewsTime(dateStr) {
  const d = new Date(dateStr)
  const diff = Date.now() - d.getTime()
  if (diff < 0) return formatAbsolute(d)
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `${mins}분 전`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}시간 전`
  return `${Math.floor(hours / 24)}일 전`
}

function formatAbsolute(d) {
  const m = (d.getMonth() + 1).toString().padStart(2, '0')
  const day = d.getDate().toString().padStart(2, '0')
  const h = d.getHours().toString().padStart(2, '0')
  const min = d.getMinutes().toString().padStart(2, '0')
  return `${m}.${day} ${h}:${min}`
}
