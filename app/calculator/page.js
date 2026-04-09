import { readFileSync } from 'fs'
import { join } from 'path'
import CalculatorPage from '../../components/CalculatorPage'

export const metadata = {
  title: '내 지갑 계산기 — 호르무즈 해협 봉쇄가 내 지갑에 미치는 영향',
  description: '호르무즈 해협 봉쇄 시 유가·가스·전기·장바구니 물가 상승이 우리집 가계에 미치는 영향을 계산해보세요.',
  openGraph: {
    title: '내 지갑 계산기 — 호르무즈 봉쇄 영향',
    description: '호르무즈 봉쇄가 내 지갑에 미치는 영향은? 지금 바로 계산해보세요!',
  },
}

function readJson(filename) {
  const filePath = join(process.cwd(), 'data', filename)
  return JSON.parse(readFileSync(filePath, 'utf-8'))
}

export default function Calculator() {
  const calculator = readJson('calculator.json')
  return <CalculatorPage initialData={calculator} />
}
