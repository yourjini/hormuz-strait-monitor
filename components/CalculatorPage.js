'use client'

import { useState, useEffect, useRef } from 'react'
import Header from './Header'

export default function CalculatorPage({ initialData }) {
  const [data] = useState(initialData)
  const [step, setStep] = useState(1) // 1: 입력, 2: 결과
  const [inputs, setInputs] = useState({
    fuelType: 'gasoline',
    monthlyKm: 1000,
    gasUsage: 30,      // m³/월
    electricUsage: 300, // kWh/월
    household: 3,
    selectedGroceries: [],
    groceryFrequency: 4, // 월 장보기 횟수
  })
  const [result, setResult] = useState(null)

  const handleChange = (key, value) => {
    setInputs(prev => ({ ...prev, [key]: value }))
  }

  const toggleGrocery = (name) => {
    setInputs(prev => ({
      ...prev,
      selectedGroceries: prev.selectedGroceries.includes(name)
        ? prev.selectedGroceries.filter(n => n !== name)
        : [...prev.selectedGroceries, name]
    }))
  }

  const calculate = () => {
    const p = data.prices
    const fuel = p[inputs.fuelType]
    const fuelEfficiency = inputs.fuelType === 'diesel' ? 14 : 11 // km/L
    const monthlyLiters = inputs.monthlyKm / fuelEfficiency

    const fuelBefore = monthlyLiters * fuel.before
    const fuelNow = monthlyLiters * fuel.current
    const fuelDiff = fuelNow - fuelBefore

    const gasBefore = inputs.gasUsage * p.gas.before
    const gasNow = inputs.gasUsage * p.gas.current
    const gasDiff = gasNow - gasBefore

    const elecBefore = inputs.electricUsage * p.electricity.before
    const elecNow = inputs.electricUsage * p.electricity.current
    const elecDiff = elecNow - elecBefore

    let groceryDiff = 0
    const groceryDetails = []
    data.groceries.forEach(item => {
      if (inputs.selectedGroceries.includes(item.name)) {
        const diff = (item.current - item.before) * inputs.groceryFrequency
        groceryDiff += diff
        groceryDetails.push({ ...item, monthlyDiff: diff })
      }
    })

    const totalBefore = fuelBefore + gasBefore + elecBefore
    const totalDiff = fuelDiff + gasDiff + elecDiff + groceryDiff
    const yearlyDiff = totalDiff * 12

    setResult({
      fuel: { before: fuelBefore, diff: fuelDiff, liters: monthlyLiters },
      gas: { before: gasBefore, diff: gasDiff },
      electricity: { before: elecBefore, diff: elecDiff },
      grocery: { diff: groceryDiff, details: groceryDetails },
      totalBefore,
      totalDiff,
      yearlyDiff,
    })
    setStep(2)
  }

  return (
    <div className="min-h-screen bg-[#0f2035]">
      <Header />

      <main className="max-w-3xl mx-auto p-4">
        {/* Title with animated flame */}
        <div className="text-center mb-8 pt-4">
          <div className="inline-block relative">
            <FlameAnimation />
            <h1 className="text-2xl font-bold text-gray-100 mt-2">내 지갑 계산기</h1>
          </div>
          <p className="text-sm text-gray-400 mt-2">호르무즈 해협 봉쇄가 내 지갑에 미치는 영향은?</p>
          <div className="flex items-center justify-center gap-4 mt-3 text-xs text-gray-500">
            <span>유가 <span className="text-amber-400 font-bold">${data.oilPrice.current}</span>/bbl</span>
            <span>환율 <span className="text-cyan-400 font-bold">₩{data.exchangeRate.current.toLocaleString()}</span>/$ </span>
            <span className="text-gray-600">({data.updatedAt} 기준)</span>
          </div>
        </div>

        {step === 1 ? (
          <InputForm
            data={data}
            inputs={inputs}
            onChange={handleChange}
            onToggleGrocery={toggleGrocery}
            onCalculate={calculate}
          />
        ) : (
          <ResultPanel
            result={result}
            inputs={inputs}
            data={data}
            onBack={() => setStep(1)}
          />
        )}
      </main>
    </div>
  )
}

/* ── Animated flame icon (GIF 효과) ── */
function FlameAnimation() {
  return (
    <div className="flex justify-center mb-1">
      <svg viewBox="0 0 60 80" className="w-14 h-18 flame-container">
        {/* Outer flame */}
        <path className="flame-outer" d="M30 5 Q45 30 42 50 Q40 65 30 72 Q20 65 18 50 Q15 30 30 5Z" fill="#f59e0b" opacity="0.7">
          <animate attributeName="d" dur="0.8s" repeatCount="indefinite" values="
            M30 5 Q45 30 42 50 Q40 65 30 72 Q20 65 18 50 Q15 30 30 5Z;
            M30 8 Q43 28 44 48 Q41 63 30 70 Q19 63 16 48 Q17 28 30 8Z;
            M30 3 Q46 32 41 52 Q39 66 30 73 Q21 66 19 52 Q14 32 30 3Z;
            M30 5 Q45 30 42 50 Q40 65 30 72 Q20 65 18 50 Q15 30 30 5Z
          " />
        </path>
        {/* Inner flame */}
        <path className="flame-inner" d="M30 25 Q38 40 36 52 Q34 62 30 66 Q26 62 24 52 Q22 40 30 25Z" fill="#ef4444" opacity="0.9">
          <animate attributeName="d" dur="0.6s" repeatCount="indefinite" values="
            M30 25 Q38 40 36 52 Q34 62 30 66 Q26 62 24 52 Q22 40 30 25Z;
            M30 28 Q37 42 37 50 Q35 60 30 64 Q25 60 23 50 Q23 42 30 28Z;
            M30 22 Q39 38 35 54 Q33 63 30 67 Q27 63 25 54 Q21 38 30 22Z;
            M30 25 Q38 40 36 52 Q34 62 30 66 Q26 62 24 52 Q22 40 30 25Z
          " />
        </path>
        {/* Core */}
        <path d="M30 40 Q34 48 33 55 Q32 60 30 62 Q28 60 27 55 Q26 48 30 40Z" fill="#fbbf24">
          <animate attributeName="d" dur="0.5s" repeatCount="indefinite" values="
            M30 40 Q34 48 33 55 Q32 60 30 62 Q28 60 27 55 Q26 48 30 40Z;
            M30 42 Q33 49 33 54 Q32 59 30 61 Q28 59 27 54 Q27 49 30 42Z;
            M30 38 Q35 47 33 56 Q31 61 30 63 Q29 61 27 56 Q25 47 30 38Z;
            M30 40 Q34 48 33 55 Q32 60 30 62 Q28 60 27 55 Q26 48 30 40Z
          " />
        </path>
        {/* Sparks */}
        <circle cx="22" cy="20" r="1.5" fill="#fbbf24">
          <animate attributeName="cy" from="25" to="5" dur="1.2s" repeatCount="indefinite" />
          <animate attributeName="opacity" from="1" to="0" dur="1.2s" repeatCount="indefinite" />
        </circle>
        <circle cx="38" cy="18" r="1" fill="#f59e0b">
          <animate attributeName="cy" from="22" to="2" dur="1s" repeatCount="indefinite" />
          <animate attributeName="opacity" from="1" to="0" dur="1s" repeatCount="indefinite" />
          <animate attributeName="cx" from="38" to="42" dur="1s" repeatCount="indefinite" />
        </circle>
        <circle cx="28" cy="15" r="1" fill="#fcd34d">
          <animate attributeName="cy" from="20" to="0" dur="1.4s" repeatCount="indefinite" />
          <animate attributeName="opacity" from="0.8" to="0" dur="1.4s" repeatCount="indefinite" />
          <animate attributeName="cx" from="28" to="24" dur="1.4s" repeatCount="indefinite" />
        </circle>
      </svg>
    </div>
  )
}

/* ── Money flying animation (결과 화면) ── */
function MoneyRain() {
  const bills = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    left: 5 + (i * 8) % 90,
    delay: (i * 0.3) % 2.5,
    duration: 2 + (i % 3),
    size: 16 + (i % 3) * 4,
    rotate: -20 + (i * 15) % 40,
  }))

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {bills.map(b => (
        <div
          key={b.id}
          className="absolute money-fall"
          style={{
            left: `${b.left}%`,
            animationDelay: `${b.delay}s`,
            animationDuration: `${b.duration}s`,
            fontSize: b.size,
            transform: `rotate(${b.rotate}deg)`,
          }}
        >
          💸
        </div>
      ))}
    </div>
  )
}

/* ── Counting up number animation ── */
function AnimatedNumber({ value, prefix = '', suffix = '', className = '', duration = 1500 }) {
  const [display, setDisplay] = useState(0)
  const ref = useRef(null)

  useEffect(() => {
    const target = Math.round(value)
    const startTime = Date.now()

    const tick = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3) // easeOutCubic
      setDisplay(Math.round(eased * target))

      if (progress < 1) {
        ref.current = requestAnimationFrame(tick)
      }
    }

    ref.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(ref.current)
  }, [value, duration])

  return (
    <span className={className}>
      {prefix}{display.toLocaleString()}{suffix}
    </span>
  )
}

/* ── Shock gauge animation ── */
function ShockGauge({ percent }) {
  const [width, setWidth] = useState(0)
  useEffect(() => {
    const t = setTimeout(() => setWidth(Math.min(percent, 100)), 100)
    return () => clearTimeout(t)
  }, [percent])

  const color = percent > 30 ? 'bg-red-500' : percent > 15 ? 'bg-amber-500' : 'bg-cyan-500'
  const label = percent > 30 ? '심각' : percent > 15 ? '주의' : '경미'

  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className="text-gray-400">가계 충격도</span>
        <span className={percent > 30 ? 'text-red-400 font-bold' : percent > 15 ? 'text-amber-400 font-bold' : 'text-cyan-400'}>{label} ({percent.toFixed(1)}%)</span>
      </div>
      <div className="h-3 bg-[#142840] rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-1000 ease-out ${color}`}
          style={{ width: `${width}%` }}
        />
      </div>
    </div>
  )
}

/* ── Input Form ── */
function InputForm({ data, inputs, onChange, onToggleGrocery, onCalculate }) {
  return (
    <div className="space-y-6">
      {/* 연료 */}
      <Section title="🚗 차량 연료" desc="월 주행거리와 연료 타입">
        <div className="grid grid-cols-2 gap-3 mb-3">
          {['gasoline', 'diesel'].map(type => (
            <button
              key={type}
              onClick={() => onChange('fuelType', type)}
              className={`py-2 px-3 rounded-lg text-sm font-medium border transition-all ${
                inputs.fuelType === type
                  ? 'bg-cyan-500/15 text-cyan-300 border-cyan-500/40'
                  : 'bg-[#142840] text-gray-400 border-[#2a4a6f] hover:text-gray-200'
              }`}
            >
              {data.prices[type].icon} {data.prices[type].name}
              <span className="block text-[10px] mt-0.5 text-gray-500">
                {data.prices[type].before.toLocaleString()}→{data.prices[type].current.toLocaleString()}원
              </span>
            </button>
          ))}
        </div>
        <SliderInput
          label="월 주행거리"
          value={inputs.monthlyKm}
          min={0} max={5000} step={100}
          unit="km"
          onChange={v => onChange('monthlyKm', v)}
        />
      </Section>

      {/* 가스 + 전기 */}
      <Section title="🏠 가정 에너지" desc="도시가스·전기 월 사용량">
        <SliderInput
          label="도시가스"
          value={inputs.gasUsage}
          min={0} max={100} step={5}
          unit="m³/월"
          onChange={v => onChange('gasUsage', v)}
        />
        <SliderInput
          label="전기"
          value={inputs.electricUsage}
          min={0} max={600} step={50}
          unit="kWh/월"
          onChange={v => onChange('electricUsage', v)}
          className="mt-3"
        />
      </Section>

      {/* 장바구니 */}
      <Section title="🛒 장바구니" desc="자주 사는 품목을 골라주세요">
        <div className="grid grid-cols-2 gap-2 mb-3">
          {data.groceries.map(item => {
            const selected = inputs.selectedGroceries.includes(item.name)
            const pctUp = ((item.current - item.before) / item.before * 100).toFixed(0)
            return (
              <button
                key={item.name}
                onClick={() => onToggleGrocery(item.name)}
                className={`flex items-center gap-2 p-2 rounded-lg text-left text-xs border transition-all ${
                  selected
                    ? 'bg-amber-500/10 border-amber-500/30 text-gray-200'
                    : 'bg-[#142840] border-[#2a4a6f] text-gray-400 hover:text-gray-300'
                }`}
              >
                <span className="text-base">{item.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="truncate">{item.name}</div>
                  <div className="text-[10px] text-red-400">+{pctUp}%</div>
                </div>
                {selected && <span className="text-cyan-400">✓</span>}
              </button>
            )
          })}
        </div>
        <SliderInput
          label="월 장보기 횟수"
          value={inputs.groceryFrequency}
          min={1} max={12} step={1}
          unit="회"
          onChange={v => onChange('groceryFrequency', v)}
        />
      </Section>

      {/* 가구원 수 */}
      <Section title="👨‍👩‍👧‍👦 가구" desc="가구원 수 (참고용)">
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map(n => (
            <button
              key={n}
              onClick={() => onChange('household', n)}
              className={`flex-1 py-2 rounded-lg text-sm border transition-all ${
                inputs.household === n
                  ? 'bg-cyan-500/15 text-cyan-300 border-cyan-500/40'
                  : 'bg-[#142840] text-gray-400 border-[#2a4a6f]'
              }`}
            >
              {n}인
            </button>
          ))}
        </div>
      </Section>

      {/* 계산 버튼 */}
      <button
        onClick={onCalculate}
        className="w-full py-4 rounded-xl bg-gradient-to-r from-amber-500 to-red-500 text-white font-bold text-lg hover:from-amber-400 hover:to-red-400 transition-all active:scale-[0.98] shadow-lg shadow-amber-500/20"
      >
        내 지갑 계산하기 🔥
      </button>
    </div>
  )
}

/* ── Result Panel ── */
function ResultPanel({ result, inputs, data, onBack }) {
  const shockPercent = result.totalBefore > 0 ? (result.totalDiff / result.totalBefore) * 100 : 0

  return (
    <div className="space-y-4 relative">
      {/* Money rain animation */}
      {result.totalDiff > 50000 && <MoneyRain />}

      {/* 총 추가 비용 (메인 결과) */}
      <div className="relative z-10 rounded-xl border-2 border-red-500/30 bg-gradient-to-br from-[#182f4a] to-[#1a1a2e] p-6 text-center overflow-hidden">
        {/* Background pulse */}
        <div className="absolute inset-0 bg-red-500/5 animate-pulse rounded-xl" />

        <div className="relative z-10">
          <p className="text-sm text-gray-400 mb-1">호르무즈 봉쇄로 매달 추가되는 비용</p>
          <div className="my-3">
            <AnimatedNumber
              value={result.totalDiff}
              prefix="+"
              suffix="원"
              className="text-5xl font-black text-red-400"
              duration={2000}
            />
          </div>
          <p className="text-sm text-gray-400">
            연간 <span className="text-amber-400 font-bold">+<AnimatedNumber value={result.yearlyDiff} suffix="원" className="text-amber-400 font-bold" duration={2500} /></span> 추가 지출
          </p>

          <div className="mt-4 max-w-xs mx-auto">
            <ShockGauge percent={shockPercent} />
          </div>
        </div>
      </div>

      {/* 항목별 상세 */}
      <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 gap-3">
        <ResultCard
          icon="⛽"
          title="차량 연료"
          diff={result.fuel.diff}
          detail={`월 ${Math.round(result.fuel.liters)}L × ${data.prices[inputs.fuelType].current.toLocaleString()}원`}
          delay={200}
        />
        <ResultCard
          icon="🔥"
          title="도시가스"
          diff={result.gas.diff}
          detail={`월 ${inputs.gasUsage}m³ × ${data.prices.gas.current.toLocaleString()}원`}
          delay={400}
        />
        <ResultCard
          icon="⚡"
          title="전기요금"
          diff={result.electricity.diff}
          detail={`월 ${inputs.electricUsage}kWh × ${data.prices.electricity.current}원`}
          delay={600}
        />
        <ResultCard
          icon="🛒"
          title="장바구니"
          diff={result.grocery.diff}
          detail={`${result.grocery.details.length}개 품목 × 월 ${inputs.groceryFrequency}회`}
          delay={800}
        />
      </div>

      {/* 장바구니 상세 */}
      {result.grocery.details.length > 0 && (
        <div className="relative z-10 rounded-lg border border-[#2a4a6f] bg-[#182f4a] p-4">
          <div className="text-xs text-gray-500 mb-2">장바구니 품목별</div>
          <div className="space-y-1.5">
            {result.grocery.details.map(item => (
              <div key={item.name} className="flex items-center justify-between text-sm">
                <span className="text-gray-300">{item.icon} {item.name}</span>
                <div className="text-right">
                  <span className="text-gray-500 line-through text-xs mr-2">{item.before.toLocaleString()}</span>
                  <span className="text-gray-200">{item.current.toLocaleString()}원</span>
                  <span className="text-red-400 text-xs ml-2">+{item.monthlyDiff.toLocaleString()}/월</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 비교 메시지 */}
      <ComparisonMessage totalDiff={result.totalDiff} />

      {/* 버튼들 */}
      <div className="relative z-10 flex gap-3">
        <button
          onClick={onBack}
          className="flex-1 py-3 rounded-lg border border-[#2a4a6f] text-gray-400 hover:text-gray-200 transition-colors text-sm"
        >
          ← 다시 입력
        </button>
        <button
          onClick={() => {
            const text = `호르무즈 해협 봉쇄로 우리집 월 +${result.totalDiff.toLocaleString()}원 추가 지출 예상 😱 연간 ${result.yearlyDiff.toLocaleString()}원! 당신은 얼마? 👉`
            if (navigator.share) {
              navigator.share({ title: '내 지갑 계산기', text })
            } else {
              navigator.clipboard.writeText(text)
              alert('클립보드에 복사되었습니다!')
            }
          }}
          className="flex-1 py-3 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold text-sm hover:from-cyan-400 hover:to-blue-400 transition-all"
        >
          결과 공유하기 📢
        </button>
      </div>
    </div>
  )
}

/* ── 비교 메시지 (재미 요소) ── */
function ComparisonMessage({ totalDiff }) {
  let message, emoji
  if (totalDiff < 30000) {
    message = '커피 한 잔 값 정도... 그래도 아깝죠'
    emoji = '☕'
  } else if (totalDiff < 80000) {
    message = '치킨 세트가 매달 날아가는 셈입니다'
    emoji = '🍗'
  } else if (totalDiff < 150000) {
    message = '넷플릭스 + 유튜브 프리미엄 + 멜론 합친 것보다 많습니다'
    emoji = '📺'
  } else if (totalDiff < 300000) {
    message = '매달 가족 외식 한 번이 사라지는 금액입니다'
    emoji = '🍽️'
  } else {
    message = '월급에서 체감되는 수준. 가계 비상등 켜야 할 때입니다'
    emoji = '🚨'
  }

  return (
    <div className="relative z-10 rounded-lg border border-amber-500/20 bg-amber-500/5 p-4 text-center">
      <span className="text-3xl block mb-2 comparison-bounce">{emoji}</span>
      <p className="text-sm text-amber-300">{message}</p>
      <p className="text-xs text-gray-500 mt-1">월 +{totalDiff.toLocaleString()}원</p>
    </div>
  )
}

/* ── Animated Result Card ── */
function ResultCard({ icon, title, diff, detail, delay }) {
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), delay)
    return () => clearTimeout(t)
  }, [delay])

  return (
    <div className={`rounded-lg border border-[#2a4a6f] bg-[#182f4a] p-4 transition-all duration-500 ${
      visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
    }`}>
      <div className="flex items-center gap-2 mb-2">
        <span className="text-lg">{icon}</span>
        <span className="text-xs text-gray-400">{title}</span>
      </div>
      <div className="text-xl font-bold text-red-400">
        +<AnimatedNumber value={diff} className="" duration={1200} />
        <span className="text-sm font-normal text-gray-500"> 원/월</span>
      </div>
      <div className="text-[10px] text-gray-500 mt-1">{detail}</div>
    </div>
  )
}

/* ── Slider Input ── */
function SliderInput({ label, value, min, max, step, unit, onChange, className = '' }) {
  return (
    <div className={className}>
      <div className="flex justify-between text-xs mb-1">
        <span className="text-gray-400">{label}</span>
        <span className="text-cyan-300 font-bold">{value.toLocaleString()} {unit}</span>
      </div>
      <input
        type="range"
        min={min} max={max} step={step}
        value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="w-full h-1.5 bg-[#2a4a6f] rounded-full appearance-none cursor-pointer accent-cyan-500
          [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4
          [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-cyan-400 [&::-webkit-slider-thumb]:shadow-lg
          [&::-webkit-slider-thumb]:shadow-cyan-500/30"
      />
    </div>
  )
}

/* ── Section wrapper ── */
function Section({ title, desc, children }) {
  return (
    <div className="rounded-xl border border-[#2a4a6f] bg-[#182f4a] p-4">
      <div className="mb-3">
        <h3 className="text-sm font-bold text-gray-200">{title}</h3>
        {desc && <p className="text-[10px] text-gray-500">{desc}</p>}
      </div>
      {children}
    </div>
  )
}
