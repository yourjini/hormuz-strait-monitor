'use client'

import { useState, useEffect, useCallback } from 'react'
import StatusPanel from './StatusPanel'
import ShipStats from './ShipStats'
import StraitMap from './StraitMap'
import Timeline from './Timeline'
import NewsFeed from './NewsFeed'

export default function Dashboard({ initialData }) {
  const [data, setData] = useState(initialData)
  const [lastRefresh, setLastRefresh] = useState(new Date())
  const [refreshing, setRefreshing] = useState(false)

  const refresh = useCallback(async () => {
    setRefreshing(true)
    try {
      const [statusRes, shipsRes, timelineRes, newsRes] = await Promise.all([
        fetch('/api/status'),
        fetch('/api/ships'),
        fetch('/api/timeline'),
        fetch('/api/news'),
      ])
      const [status, ships, timeline, news] = await Promise.all([
        statusRes.json(),
        shipsRes.json(),
        timelineRes.json(),
        newsRes.json(),
      ])
      setData({ status, ships, timeline, news })
      setLastRefresh(new Date())
    } catch (err) {
      console.error('Refresh failed:', err)
    }
    setRefreshing(false)
  }, [])

  // Auto-refresh every 60s
  useEffect(() => {
    const interval = setInterval(refresh, 60000)
    return () => clearInterval(interval)
  }, [refresh])

  const { status, ships, timeline, news } = data

  return (
    <div className="min-h-screen bg-[#0a1628]">
      {/* Header */}
      <header className="border-b border-[#1e3a5f] bg-[#0d1b2a]/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-[1600px] mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <svg className="w-7 h-7 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
            </svg>
            <div>
              <h1 className="text-lg font-bold text-gray-100 tracking-tight">HORMUZ STRAIT MONITOR</h1>
              <p className="text-[10px] text-gray-500 -mt-0.5">호르무즈 해협 실시간 봉쇄 모니터링</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Live indicator */}
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs text-green-400 font-medium">LIVE</span>
            </div>

            {/* Last refresh */}
            <span className="text-[10px] text-gray-500 hidden sm:block">
              {lastRefresh.toLocaleTimeString('ko-KR')} 갱신
            </span>

            {/* Refresh button */}
            <button
              onClick={refresh}
              disabled={refreshing}
              className="text-xs px-3 py-1.5 rounded border border-[#1e3a5f] bg-[#111d32] text-gray-300 hover:border-cyan-500/50 hover:text-cyan-300 transition-colors disabled:opacity-50"
            >
              {refreshing ? '갱신 중...' : '새로고침'}
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-[1600px] mx-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Left column (2/3) */}
          <div className="lg:col-span-2 space-y-4">
            {/* Top: Status + Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <StatusPanel data={status} />
              <ShipStats data={ships} />
            </div>

            {/* Map */}
            <StraitMap ships={ships?.ships || []} />

            {/* Timeline */}
            <Timeline data={timeline} />
          </div>

          {/* Right column (1/3): News */}
          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-16">
              <NewsFeed data={news} />
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#1e3a5f] mt-8 py-4 text-center text-[10px] text-gray-600">
        Hormuz Strait Monitor — Sample data for demonstration purposes. Not real-time data.
      </footer>
    </div>
  )
}
