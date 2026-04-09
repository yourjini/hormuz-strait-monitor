'use client'

import { useState, useEffect, useCallback } from 'react'
import StatusPanel from './StatusPanel'
import ShipStats from './ShipStats'
import StraitMap from './StraitMap'
import Timeline from './Timeline'
import NewsFeed from './NewsFeed'
import Header from './Header'

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
    <div className="min-h-screen bg-[#0f2035]">
      <Header />

      {/* Main content */}
      <main className="max-w-[1600px] mx-auto p-4 space-y-4">
        {/* Row 1: Status + Map (나란히) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <StatusPanel data={status} />
          <StraitMap ships={ships?.ships || []} />
        </div>

        {/* Row 2: Ship Stats + Timeline */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <ShipStats data={ships} />
          <Timeline data={timeline} />
        </div>

        {/* Row 3: News (전체 너비) */}
        <NewsFeed data={news} />
      </main>

      {/* Footer */}
      <footer className="border-t border-[#2a4a6f] mt-8 py-4 text-center text-[10px] text-gray-600">
        Hormuz Strait Monitor — 갱신 주기: 유가·환율 1시간 | 뉴스 3시간 | 봉쇄 현황 6시간 | 출처: Bloomberg, Reuters, CNBC, 연합뉴스 등
      </footer>
    </div>
  )
}
