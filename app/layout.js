import './globals.css'

export const metadata = {
  title: 'Hormuz Strait Monitor — 호르무즈 해협 실시간 모니터링',
  description: '호르무즈 해협 봉쇄 현황, 유가·환율 영향, 내 지갑 계산기를 한눈에. 실시간 모니터링 대시보드.',
  openGraph: {
    title: 'Hormuz Strait Monitor — 호르무즈 해협 봉쇄 모니터링',
    description: '호르무즈 봉쇄가 내 지갑에 미치는 영향은? 유가·환율·물가 변동과 산업 타격을 한눈에 확인하세요.',
    type: 'website',
    locale: 'ko_KR',
    siteName: 'Hormuz Strait Monitor',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Hormuz Strait Monitor',
    description: '호르무즈 해협 봉쇄 현황 + 내 지갑 계산기',
  },
  keywords: ['호르무즈', '해협', '봉쇄', '유가', '환율', '이란', '원유', '모니터링', 'Hormuz', 'Strait'],
}

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <head>
        <meta charSet="utf-8" />
        <script src="https://t1.kakaocdn.net/kakao_js_sdk/2.7.4/kakao.min.js" crossOrigin="anonymous" />
      </head>
      <body>{children}</body>
    </html>
  )
}
