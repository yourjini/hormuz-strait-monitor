'use client'

import { useState, useEffect, useCallback } from 'react'
import Header from './Header'
import Footer from './Footer'
import EconomyCharts from './EconomyCharts'
import IndustryImpact from './IndustryImpact'
import DominoTimeline from './DominoTimeline'
import { EconomyBanner } from './FactLensBanner'

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
    <div className="min-h-screen bg-[#1a1610]">
      <Header />

      <main className="max-w-[1600px] mx-auto p-4 space-y-4">
        {/* Economy indicators */}
        <EconomyCharts data={economy} />

        {/* Two column: Industry + Domino */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <IndustryImpact data={industries} />
          <DominoTimeline data={domino} />
          <EconomyBanner />
        </div>
      </main>

      <Footer />
    </div>
  )
}
