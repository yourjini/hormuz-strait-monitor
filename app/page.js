import { readFileSync } from 'fs'
import { join } from 'path'
import Dashboard from '../components/Dashboard'

function readJson(filename) {
  const filePath = join(process.cwd(), 'data', filename)
  return JSON.parse(readFileSync(filePath, 'utf-8'))
}

/**
 * SSR 단계에서는 안정적으로 샘플 뉴스를 렌더링하고,
 * 클라이언트 마운트 후 Dashboard의 refresh()가 /api/news를 호출해
 * Google News RSS 실시간 데이터로 자동 교체됨.
 */
export default function Home() {
  const status = readJson('status.json')
  const ships = readJson('ships.json')
  const timeline = readJson('timeline.json')
  const news = { items: readJson('news.json'), source: 'sample', provider: '샘플 (초기 로딩)' }

  return <Dashboard initialData={{ status, ships, timeline, news }} />
}
