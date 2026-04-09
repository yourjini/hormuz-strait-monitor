import { readFileSync } from 'fs'
import { join } from 'path'
import EconomyPage from '../../components/EconomyPage'

function readJson(filename) {
  const filePath = join(process.cwd(), 'data', filename)
  return JSON.parse(readFileSync(filePath, 'utf-8'))
}

export default function Economy() {
  const economy = readJson('economy.json')
  const industries = readJson('industries.json')
  const domino = readJson('domino.json')

  return <EconomyPage initialData={{ economy, industries, domino }} />
}
