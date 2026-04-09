'use client'

import { useState, useEffect, useCallback } from 'react'
import StatusPanel from './StatusPanel'
import StraitMap from './StraitMap'
import ShipStats from './ShipStats'
import Timeline from './Timeline'
import NewsFeed from './NewsFeed'
import Header from './Header'
import Footer from './Footer'
import { DashboardBanner } from './FactLensBanner'

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
    <div className="min-h-screen bg-[#1a1610]">
      <Header />

      {/* Main content */}
      <main className="max-w-[1600px] mx-auto p-3 sm:p-4 space-y-3 sm:space-y-4">
        {/* Row 1: Status + (Map + ShipStats) — 높이 맞춤 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <StatusPanel data={status} />
          <div className="flex flex-col gap-3">
            <StraitMap ships={ships?.ships || []} summary={ships?.summary} />
            <ShipStats data={ships} />
          </div>
        </div>

        {/* Row 2: Timeline */}
        <Timeline data={timeline} />

        {/* FactLens 배너 — 뉴스 섹션 위 */}
        <DashboardBanner />

        {/* Row 3: News (전체 너비) */}
        <NewsFeed data={news} />
      </main>

      <Footer />
    </div>
  )
}
