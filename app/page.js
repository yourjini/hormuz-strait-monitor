import { readFileSync } from 'fs'
import { join } from 'path'
import { headers } from 'next/headers'
import Dashboard from '../components/Dashboard'

function readJson(filename) {
  const filePath = join(process.cwd(), 'data', filename)
  return JSON.parse(readFileSync(filePath, 'utf-8'))
}

// SSR 단계에서도 실시간 뉴스를 시도하도록 /api/news를 호출
// 실패 시 /api/news 내부에서 샘플로 폴백하므로 안전
async function fetchNews() {
  try {
    const h = await headers()
    const host = h.get('host')
    const proto = h.get('x-forwarded-proto') || 'http'
    const res = await fetch(`${proto}://${host}/api/news`, {
      next: { revalidate: 600 },
    })
    if (!res.ok) throw new Error('news api failed')
    return await res.json()
  } catch {
    return { items: readJson('news.json'), source: 'sample', provider: '샘플' }
  }
}

export default async function Home() {
  const status = readJson('status.json')
  const ships = readJson('ships.json')
  const timeline = readJson('timeline.json')
  const news = await fetchNews()

  return <Dashboard initialData={{ status, ships, timeline, news }} />
}
