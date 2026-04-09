import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = '호르무즈 해협 실시간 모니터링 — 유가·환율·내 지갑 영향'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          background: 'linear-gradient(135deg, #0a1628 0%, #132d4a 100%)',
          padding: '60px 80px',
          fontFamily: 'sans-serif',
        }}
      >
        {/* Top section */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          {/* Alert badge */}
          <div
            style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: '#ef4444',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '48px',
              fontWeight: 'bold',
              color: 'white',
            }}
          >
            !
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '56px', fontWeight: 'bold', color: '#ffffff', letterSpacing: '-1px' }}>
              HORMUZ STRAIT
            </span>
            <span style={{ fontSize: '44px', fontWeight: 'bold', color: '#06b6d4', marginTop: '-8px' }}>
              MONITOR
            </span>
          </div>
        </div>

        {/* Divider */}
        <div style={{ width: '100%', height: '2px', background: '#1e3a5f', margin: '32px 0' }} />

        {/* Korean title */}
        <span style={{ fontSize: '36px', color: '#e2e8f0', textAlign: 'center', width: '100%' }}>
          호르무즈 해협 봉쇄 실시간 모니터링
        </span>

        {/* Feature pills */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '36px' }}>
          <div
            style={{
              padding: '14px 32px',
              borderRadius: '30px',
              background: '#1e3a5f',
              fontSize: '24px',
              fontWeight: 'bold',
              color: '#f59e0b',
            }}
          >
            유가 영향
          </div>
          <div
            style={{
              padding: '14px 32px',
              borderRadius: '30px',
              background: '#1e3a5f',
              fontSize: '24px',
              fontWeight: 'bold',
              color: '#06b6d4',
            }}
          >
            환율 변동
          </div>
          <div
            style={{
              padding: '14px 32px',
              borderRadius: '30px',
              background: '#1e3a5f',
              fontSize: '24px',
              fontWeight: 'bold',
              color: '#22c55e',
            }}
          >
            내 지갑 계산기
          </div>
        </div>

        {/* Bottom */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 'auto' }}>
          <span style={{ fontSize: '20px', color: '#64748b' }}>
            봉쇄 현황 · 유가/환율 영향 · 산업별 타격 · 내 지갑 계산기
          </span>
        </div>

        {/* Wave decoration */}
        <div
          style={{
            position: 'absolute',
            bottom: '0',
            left: '0',
            right: '0',
            height: '80px',
            background: 'linear-gradient(180deg, transparent 0%, rgba(6,182,212,0.08) 100%)',
          }}
        />
      </div>
    ),
    { ...size }
  )
}
