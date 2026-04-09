'use client'

import { useState, useEffect, useCallback } from 'react'
import Header from './Header'
import EconomyCharts from './EconomyCharts'
import IndustryImpact from './IndustryImpact'
import DominoTimeline from './DominoTimeline'

export default function EconomyPage({ initialData }) {
  const [data, setData] = useState(initialData)
  const [refreshing, setRefreshing] = useState(false)

  const refresh = useCallback(async () => {
    setRefreshing(true)
    try {
      const [economyRes, industriesRes, dominoRes] = await Promise.all([
        fetch('/api/economy'),
        fetch('/api/industries'),
        fetch('/api/domino'),
      ])
      const [economy, industries, domino] = await Promise.all([
        economyRes.json(),
        industriesRes.json(),
        dominoRes.json(),
      ])
      setData({ economy, industries, domino })
    } catch (err) {
      console.error('Refresh failed:', err)
    }
    setRefreshing(false)
  }, [])

  useEffect(() => {
    const interval = setInterval(refresh, 60000)
    return () => clearInterval(interval)
  }, [refresh])

  const { economy, industries, domino } = data

  return (
    <div className="min-h-screen bg-[#0a1628]">
      <Header />

      <main className="max-w-[1600px] mx-auto p-4 space-y-4">
        {/* Economy indicators */}
        <EconomyCharts data={economy} />

        {/* Two column: Industry + Domino */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <IndustryImpact data={industries} />
          <DominoTimeline data={domino} />
        </div>
      </main>

      <footer className="border-t border-[#1e3a5f] mt-8 py-4 text-center text-[10px] text-gray-600">
        Hormuz Strait Monitor — Sample data for demonstration purposes. Not real-time data.
      </footer>
    </div>
  )
}
