import { readFileSync } from 'fs'
import { join } from 'path'
import CalculatorPage from '../../components/CalculatorPage'

function readJson(filename) {
  const filePath = join(process.cwd(), 'data', filename)
  return JSON.parse(readFileSync(filePath, 'utf-8'))
}

export default function Calculator() {
  const calculator = readJson('calculator.json')
  return <CalculatorPage initialData={calculator} />
}
