'use client'

import { useState, useEffect, useCallback } from 'react'
import StatusPanel from './StatusPanel'
import StraitMap from './StraitMap'
import Timeline from './Timeline'
import NewsFeed from './NewsFeed'
import Header from './Header'
import Footer from './Footer'

export default function Dashboard({ initialData }) {
  const [data, setData] = useState(initialData)
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
    } catch (err) {
      console.error('Refresh failed:', err)
    }
    setRefreshing(false)
  }, [])

  useEffect(() => {
    const interval = setInterval(refresh, 60000)
    return () => clearInterval(interval)
  }, [refresh])

  const { status, ships, timeline, news } = data

  return (
    <div className="min-h-screen bg-surface">
      <Header />

      <main className="pt-16 min-h-screen">
        <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-screen-2xl mx-auto">

          {/* Hero: Status Panel (full width) */}
          <StatusPanel data={status} />

          {/* Map + Timeline row */}
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Map - 9 cols */}
            <div className="lg:col-span-9 rounded-2xl overflow-hidden border border-white/5 shadow-2xl bg-surface-container-lowest min-h-[400px] lg:min-h-[500px]">
              <StraitMap ships={ships?.ships || []} summary={ships?.summary} />
            </div>
            {/* Timeline sidebar - 3 cols */}
            <div className="lg:col-span-3">
              <Timeline data={timeline} />
            </div>
          </section>

          {/* News Grid */}
          <NewsFeed data={news} />
        </div>
      </main>

      <Footer />
    </div>
  )
}
