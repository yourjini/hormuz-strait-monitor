import { readFileSync } from 'fs'
import { join } from 'path'
import Dashboard from '../components/Dashboard'

function readJson(filename) {
  const filePath = join(process.cwd(), 'data', filename)
  return JSON.parse(readFileSync(filePath, 'utf-8'))
}

export default function Home() {
  const status = readJson('status.json')
  const ships = readJson('ships.json')
  const timeline = readJson('timeline.json')
  const news = readJson('news.json')

  return <Dashboard initialData={{ status, ships, timeline, news }} />
}
