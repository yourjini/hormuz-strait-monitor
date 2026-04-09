import './globals.css'

export const metadata = {
  title: 'Hormuz Strait Monitor',
  description: 'Real-time Strait of Hormuz blockade monitoring dashboard',
}

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  )
}
