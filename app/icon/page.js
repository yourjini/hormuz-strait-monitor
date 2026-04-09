'use client'

import { useRef, useEffect, useState } from 'react'

export default function IconPage() {
  const [selected, setSelected] = useState(0)
  const canvasRefs = [useRef(null), useRef(null), useRef(null)]

  useEffect(() => {
    drawIcon1(canvasRefs[0].current)
    drawIcon2(canvasRefs[1].current)
    drawIcon3(canvasRefs[2].current)
  }, [])

  const download = (idx) => {
    const canvas = canvasRefs[idx].current
    const link = document.createElement('a')
    link.download = `hormuz-icon-${idx + 1}-128.png`
    link.href = canvas.toDataURL('image/png')
    link.click()
  }

  return (
    <div style={{ background: '#111', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 30, fontFamily: 'sans-serif', padding: 40 }}>
      <h1 style={{ color: '#fff', fontSize: 18 }}>앱 아이콘 선택 (128x128)</h1>

      <div style={{ display: 'flex', gap: 32 }}>
        {[0, 1, 2].map(i => (
          <div key={i} style={{ textAlign: 'center' }}>
            <div
              onClick={() => setSelected(i)}
              style={{
                padding: 16, borderRadius: 16, cursor: 'pointer',
                background: selected === i ? '#1a3a5c' : '#222',
                border: selected === i ? '2px solid #06b6d4' : '2px solid #333',
                transition: 'all 0.2s',
              }}
            >
              <canvas ref={canvasRefs[i]} width={128} height={128} style={{ borderRadius: 24, display: 'block' }} />
            </div>
            <p style={{ color: '#888', fontSize: 12, marginTop: 8 }}>디자인 {i + 1}</p>
          </div>
        ))}
      </div>

      <button
        onClick={() => download(selected)}
        style={{
          padding: '14px 40px', borderRadius: 10,
          background: '#FEE500', color: '#3C1E1E',
          fontWeight: 'bold', fontSize: 16, border: 'none', cursor: 'pointer',
        }}
      >
        선택한 아이콘 PNG 다운로드
      </button>

      <p style={{ color: '#555', fontSize: 11 }}>다운로드 후 카카오 디벨로퍼 앱 아이콘에 업로드</p>
    </div>
  )
}

/* ── 디자인 1: 미니멀 물결 + H ── */
function drawIcon1(canvas) {
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  const s = 128

  // BG - deep navy gradient
  const bg = ctx.createLinearGradient(0, 0, s, s)
  bg.addColorStop(0, '#0a1628')
  bg.addColorStop(1, '#132d4a')
  roundRect(ctx, 0, 0, s, s, 28)
  ctx.fillStyle = bg
  ctx.fill()

  // Wave lines
  ctx.strokeStyle = 'rgba(6, 182, 212, 0.3)'
  ctx.lineWidth = 1.5
  for (let i = 0; i < 3; i++) {
    const y = 70 + i * 12
    ctx.beginPath()
    ctx.moveTo(15, y)
    ctx.quadraticCurveTo(42, y - 6, 64, y)
    ctx.quadraticCurveTo(86, y + 6, 113, y)
    ctx.stroke()
  }

  // Big "H" letter
  ctx.fillStyle = '#ffffff'
  ctx.font = 'bold 56px Arial, Helvetica, sans-serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText('H', 64, 48)

  // Red alert dot
  ctx.fillStyle = '#ef4444'
  ctx.beginPath()
  ctx.arc(96, 24, 10, 0, Math.PI * 2)
  ctx.fill()
  ctx.fillStyle = '#fff'
  ctx.font = 'bold 12px Arial'
  ctx.fillText('!', 96, 25)

  // Bottom text
  ctx.fillStyle = 'rgba(6, 182, 212, 0.8)'
  ctx.font = 'bold 9px Arial'
  ctx.fillText('HORMUZ', 64, 108)
  ctx.fillStyle = 'rgba(255,255,255,0.4)'
  ctx.font = '7px Arial'
  ctx.fillText('MONITOR', 64, 119)
}

/* ── 디자인 2: 해협 실루엣 + 봉쇄 ── */
function drawIcon2(canvas) {
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  const s = 128

  // BG
  const bg = ctx.createLinearGradient(0, 0, 0, s)
  bg.addColorStop(0, '#1a5276')
  bg.addColorStop(1, '#0a1628')
  roundRect(ctx, 0, 0, s, s, 28)
  ctx.fillStyle = bg
  ctx.fill()

  // Sea shimmer
  ctx.fillStyle = 'rgba(52, 152, 219, 0.15)'
  ctx.beginPath()
  ctx.ellipse(64, 64, 50, 35, 0, 0, Math.PI * 2)
  ctx.fill()

  // Land shapes - simple triangular
  ctx.fillStyle = '#8B7355'
  // Top land
  ctx.beginPath()
  ctx.moveTo(0, 0)
  ctx.lineTo(128, 0)
  ctx.lineTo(128, 35)
  ctx.quadraticCurveTo(90, 50, 64, 48)
  ctx.quadraticCurveTo(38, 46, 0, 32)
  ctx.closePath()
  ctx.fill()

  // Bottom land
  ctx.beginPath()
  ctx.moveTo(0, 128)
  ctx.lineTo(0, 88)
  ctx.quadraticCurveTo(30, 80, 48, 85)
  ctx.lineTo(48, 128)
  ctx.closePath()
  ctx.fill()

  ctx.beginPath()
  ctx.moveTo(80, 128)
  ctx.lineTo(80, 85)
  ctx.quadraticCurveTo(100, 80, 128, 88)
  ctx.lineTo(128, 128)
  ctx.closePath()
  ctx.fill()

  // Strait gap highlight
  ctx.strokeStyle = 'rgba(255,255,255,0.15)'
  ctx.lineWidth = 1
  ctx.setLineDash([3, 2])
  ctx.beginPath()
  ctx.moveTo(20, 60)
  ctx.quadraticCurveTo(64, 55, 108, 60)
  ctx.stroke()
  ctx.beginPath()
  ctx.moveTo(20, 72)
  ctx.quadraticCurveTo(64, 67, 108, 72)
  ctx.stroke()
  ctx.setLineDash([])

  // Red blockade circle
  ctx.strokeStyle = '#ef4444'
  ctx.lineWidth = 2.5
  ctx.beginPath()
  ctx.arc(64, 64, 16, 0, Math.PI * 2)
  ctx.stroke()

  // X
  ctx.strokeStyle = '#ef4444'
  ctx.lineWidth = 3
  ctx.lineCap = 'round'
  ctx.beginPath()
  ctx.moveTo(55, 55)
  ctx.lineTo(73, 73)
  ctx.stroke()
  ctx.beginPath()
  ctx.moveTo(73, 55)
  ctx.lineTo(55, 73)
  ctx.stroke()

  // Ship dots
  ctx.fillStyle = '#ef4444'
  drawDot(ctx, 35, 62, 2.5)
  drawDot(ctx, 40, 56, 2)
  ctx.fillStyle = '#2ecc71'
  drawDot(ctx, 92, 62, 2.5)

  // Bottom label
  ctx.fillStyle = '#fff'
  ctx.font = 'bold 8px Arial'
  ctx.textAlign = 'center'
  ctx.fillText('HORMUZ MONITOR', 64, 118)
}

/* ── 디자인 3: 방패 + 앵커 ── */
function drawIcon3(canvas) {
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  const s = 128

  // BG
  const bg = ctx.createRadialGradient(64, 50, 10, 64, 64, 80)
  bg.addColorStop(0, '#1e3a5f')
  bg.addColorStop(1, '#0a1628')
  roundRect(ctx, 0, 0, s, s, 28)
  ctx.fillStyle = bg
  ctx.fill()

  // Shield shape
  ctx.fillStyle = 'rgba(6, 182, 212, 0.08)'
  ctx.strokeStyle = 'rgba(6, 182, 212, 0.4)'
  ctx.lineWidth = 1.5
  ctx.beginPath()
  ctx.moveTo(64, 14)
  ctx.lineTo(104, 30)
  ctx.lineTo(104, 65)
  ctx.quadraticCurveTo(104, 95, 64, 110)
  ctx.quadraticCurveTo(24, 95, 24, 65)
  ctx.lineTo(24, 30)
  ctx.closePath()
  ctx.fill()
  ctx.stroke()

  // Anchor symbol
  ctx.strokeStyle = '#06b6d4'
  ctx.lineWidth = 3
  ctx.lineCap = 'round'

  // Anchor vertical
  ctx.beginPath()
  ctx.moveTo(64, 38)
  ctx.lineTo(64, 82)
  ctx.stroke()

  // Anchor horizontal
  ctx.beginPath()
  ctx.moveTo(50, 48)
  ctx.lineTo(78, 48)
  ctx.stroke()

  // Anchor ring
  ctx.beginPath()
  ctx.arc(64, 34, 5, 0, Math.PI * 2)
  ctx.stroke()

  // Anchor hooks
  ctx.beginPath()
  ctx.moveTo(64, 82)
  ctx.quadraticCurveTo(44, 82, 42, 70)
  ctx.stroke()
  ctx.beginPath()
  ctx.moveTo(64, 82)
  ctx.quadraticCurveTo(84, 82, 86, 70)
  ctx.stroke()

  // Red alert badge
  ctx.fillStyle = '#ef4444'
  ctx.beginPath()
  ctx.arc(90, 28, 12, 0, Math.PI * 2)
  ctx.fill()
  ctx.fillStyle = '#fff'
  ctx.font = 'bold 14px Arial'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText('!', 90, 29)

  // Bottom text
  ctx.fillStyle = 'rgba(255,255,255,0.5)'
  ctx.font = 'bold 7px Arial'
  ctx.textBaseline = 'alphabetic'
  ctx.fillText('HORMUZ', 64, 102)
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.lineTo(x + w - r, y)
  ctx.arcTo(x + w, y, x + w, y + r, r)
  ctx.lineTo(x + w, y + h - r)
  ctx.arcTo(x + w, y + h, x + w - r, y + h, r)
  ctx.lineTo(x + r, y + h)
  ctx.arcTo(x, y + h, x, y + h - r, r)
  ctx.lineTo(x, y + r)
  ctx.arcTo(x, y, x + r, y, r)
  ctx.closePath()
}

function drawDot(ctx, x, y, r) {
  ctx.beginPath()
  ctx.arc(x, y, r, 0, Math.PI * 2)
  ctx.fill()
}
