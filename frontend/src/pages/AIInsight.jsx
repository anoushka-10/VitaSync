import React, { useState } from 'react'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import { api } from '../api'

const COLORS = ['#f87196', '#7c83f5', '#f5c842']

function MacroDonut({ data, totalCalories }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
      <div style={{ position: 'relative', width: 180, height: 180 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} cx="50%" cy="50%" innerRadius={58} outerRadius={80} dataKey="value" paddingAngle={3}>
              {data.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div style={{
          position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', pointerEvents: 'none'
        }}>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-dark)', lineHeight: 1 }}>{totalCalories}</div>
          <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-light)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Est. Calories</div>
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, flex: 1 }}>
        {data.map((d, i) => (
          <div key={d.name}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: COLORS[i] }} />
                <span style={{ fontWeight: 600, color: 'var(--text-mid)', fontSize: '0.88rem' }}>{d.name}</span>
              </div>
              <span style={{ fontWeight: 800, color: 'var(--text-dark)', fontSize: '0.88rem' }}>{d.value}g</span>
            </div>
            <div style={{ height: 5, background: '#f0f0f7', borderRadius: 99, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${d.pct}%`, background: COLORS[i], borderRadius: 99, transition: 'width 0.6s ease' }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function FeatureCard({ icon, title, desc, color }) {
  return (
    <div style={{
      background: '#fff', border: '1.5px solid #ebebf0', borderRadius: 18, padding: '22px 20px',
      boxShadow: '0 2px 12px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', gap: 10
    }}>
      <div style={{
        width: 44, height: 44, borderRadius: 14, background: color + '22',
        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem'
      }}>{icon}</div>
      <div style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text-dark)' }}>{title}</div>
      <div style={{ fontSize: '0.83rem', color: 'var(--text-light)', lineHeight: 1.55, fontWeight: 500 }}>{desc}</div>
    </div>
  )
}

const parseMacros = (text) => {
  const get = (keys) => {
    for (const k of keys) {
      const m = text.match(new RegExp(`${k}[:\\s]+([\\d.]+)`, 'i'))
      if (m) return parseFloat(m[1])
    }
    return null
  }
  return {
    carbs:    get(['carbs?', 'carbohydrates?']),
    protein:  get(['protein?']),
    fat:      get(['fats?', 'fat']),
    calories: get(['calories?', 'kcal']),
  }
}

export default function AIInsight() {
  const today = new Date().toISOString().split('T')[0]
  const [meal, setMeal]                 = useState('')
  const [nutritionText, setNutritionText] = useState('')
  const [macroData, setMacroData]       = useState(null)
  const [insightResult, setInsightResult] = useState('')
  const [weeklyResult, setWeeklyResult] = useState('')
  const [loadingNutrition, setLoadingNutrition] = useState(false)
  const [loadingInsight, setLoadingInsight]     = useState(false)
  const [loadingWeekly, setLoadingWeekly]       = useState(false)
  const [activeSection, setActiveSection] = useState('nutrition')

  const handleNutrition = async (e) => {
    e.preventDefault()
    setLoadingNutrition(true)
    setNutritionText('')
    setMacroData(null)
    try {
      const res  = await api.getNutrition(meal)
      const data = await res.json()
      const text = data.insight || data.error || JSON.stringify(data)
      setNutritionText(text)

      // Try to extract macro numbers for the chart
      const carbs   = parseFloat((text.match(/carbs?[:\s]+~?([\d.]+)/i) || [])[1]) || 0
      const protein = parseFloat((text.match(/protein?[:\s]+~?([\d.]+)/i) || [])[1]) || 0
      const fat     = parseFloat((text.match(/fat[:\s]+~?([\d.]+)/i) || [])[1]) || 0
      const calories = parseFloat((text.match(/calorie[:\s]+~?([\d.]+)|~?([\d.]+)\s*kcal/i) || [])[1] || (text.match(/calorie[:\s]+~?([\d.]+)|~?([\d.]+)\s*kcal/i) || [])[2]) || Math.round(carbs*4 + protein*4 + fat*9)

      if (carbs || protein || fat) {
        const total = carbs + protein + fat
        setMacroData({
          totalCalories: calories || Math.round(carbs*4 + protein*4 + fat*9),
          items: [
            { name: 'Carbs',   value: carbs,   pct: total ? Math.round(carbs/total*100) : 0 },
            { name: 'Protein', value: protein, pct: total ? Math.round(protein/total*100) : 0 },
            { name: 'Fats',    value: fat,     pct: total ? Math.round(fat/total*100) : 0 },
          ]
        })
      }
    } catch { setNutritionText('Could not reach AI — make sure the backend is running 🥺') }
    setLoadingNutrition(false)
  }

  const handleDailyInsight = async () => {
    setLoadingInsight(true)
    setInsightResult('')
    try {
      const res = await api.getDailyInsight(today)
      const data = await res.json()
      setInsightResult(data.insight || data.error || JSON.stringify(data))
    } catch { setInsightResult('Could not reach AI 🥺') }
    setLoadingInsight(false)
  }

  const handleWeeklyReport = async () => {
    setLoadingWeekly(true)
    setWeeklyResult('')
    try {
      const res = await api.getWeeklyReport()
      const data = await res.json()
      setWeeklyResult(data.report || data.error || JSON.stringify(data))
    } catch { setWeeklyResult('Could not reach AI 🥺') }
    setLoadingWeekly(false)
  }

  return (
    <div>
      {/* Header */}
      <div className="flex-between mb-8">
        <div>
          <div className="page-title">🤖 AI Insights</div>
          <div className="page-subtitle">Your personalized health intelligence powered by Gemini</div>
        </div>
        <button className="btn btn-primary" style={{ gap: 8 }} onClick={() => setActiveSection('nutrition')}>
          ✦ Ask AI
        </button>
      </div>

      {/* Feature overview cards */}
      <div className="grid-3 mb-8">
        <div onClick={() => setActiveSection('nutrition')} style={{ cursor: 'pointer' }}>
          <FeatureCard icon="🍽️" color="#f87196" title="Nutrition AI"
            desc="Describe your meal and get instant calorie and macro breakdown." />
        </div>
        <div onClick={() => setActiveSection('insight')} style={{ cursor: 'pointer' }}>
          <FeatureCard icon="💡" color="#7c83f5" title="Daily Insight"
            desc="Personalized advice based on your activity levels and sleep patterns." />
        </div>
        <div onClick={() => setActiveSection('weekly')} style={{ cursor: 'pointer' }}>
          <FeatureCard icon="📊" color="#f5c842" title="Weekly Report"
            desc="A comprehensive review of your health trends and progress over 7 days." />
        </div>
      </div>

      {/* Nutrition section */}
      {activeSection === 'nutrition' && (
        <div className="grid-2">
          {/* Form */}
          <div className="card">
            <div style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-dark)', marginBottom: 6 }}>
              🍔 Estimate Macros
            </div>
            <div style={{ fontSize: '0.83rem', color: 'var(--text-light)', fontWeight: 500, marginBottom: 20 }}>
              Describe your meal in natural language, and let AI do the calculation for you.
            </div>
            <form onSubmit={handleNutrition}>
              <div className="form-group">
                <label style={{ fontSize: '0.7rem', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Describe your meal</label>
                <textarea rows="4" placeholder="E.g., 2 eggs, dal, 2 roti, curd, sabzi..."
                  value={meal} onChange={e => setMeal(e.target.value)} required style={{ resize: 'vertical' }} />
              </div>
              <button className="btn btn-primary btn-full" disabled={loadingNutrition}>
                {loadingNutrition ? '🧠 Analyzing...' : '⚡ Estimate Macros'}
              </button>
            </form>

            {nutritionText && !macroData && (
              <div className="insight-box mt-4" style={{ marginTop: 16 }}>{nutritionText}</div>
            )}
          </div>

          {/* Macro breakdown */}
          <div className="card">
            <div className="flex-between mb-4">
              <div style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--text-dark)' }}>Macro Breakdown</div>
              {macroData
                ? <span className="badge" style={{ background: '#eafaf4', color: '#2d9e6e' }}>✓ Ready</span>
                : <span className="badge" style={{ background: '#f5f5fa', color: 'var(--text-light)' }}>Waiting</span>}
            </div>

            {loadingNutrition && <div className="loading">🧠 Gemini is analyzing your meal...</div>}

            {macroData ? (
              <>
                <MacroDonut data={macroData.items} totalCalories={macroData.totalCalories} />
                {nutritionText && (
                  <div style={{ marginTop: 20, padding: '14px 16px', background: '#fafafd', borderRadius: 'var(--radius-md)', fontSize: '0.83rem', color: 'var(--text-mid)', lineHeight: 1.65, fontWeight: 500 }}>
                    {nutritionText}
                  </div>
                )}
              </>
            ) : !loadingNutrition && (
              <div className="empty-state">
                <div className="empty-emoji">🥘</div>
                <p>Enter a meal to see your macro breakdown</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Daily insight */}
      {activeSection === 'insight' && (
        <div className="card">
          <div style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-dark)', marginBottom: 6 }}>💡 Daily Insight</div>
          <div style={{ fontSize: '0.83rem', color: 'var(--text-light)', fontWeight: 500, marginBottom: 20 }}>
            Gemini looks at today's meals, steps, check-in, and cycle data to create your personalized tip.
          </div>
          <button className="btn btn-primary" onClick={handleDailyInsight} disabled={loadingInsight} style={{ marginBottom: 20 }}>
            {loadingInsight ? '🧠 Analyzing your day...' : '✦ Get Today\'s Insight'}
          </button>
          {loadingInsight && <div className="loading">🌸 Curating your personal insight...</div>}
          {insightResult && <div className="insight-box">{insightResult}</div>}
        </div>
      )}

      {/* Weekly report */}
      {activeSection === 'weekly' && (
        <div className="card">
          <div style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-dark)', marginBottom: 6 }}>📊 Weekly Report</div>
          <div style={{ fontSize: '0.83rem', color: 'var(--text-light)', fontWeight: 500, marginBottom: 20 }}>
            A summary of your week — what you achieved, what to focus on next.
          </div>
          <button className="btn btn-primary" onClick={handleWeeklyReport} disabled={loadingWeekly} style={{ marginBottom: 20 }}>
            {loadingWeekly ? '🧠 Generating report...' : '📊 Generate Weekly Report'}
          </button>
          {loadingWeekly && <div className="loading">📊 Compiling your weekly highlights...</div>}
          {weeklyResult && <div className="insight-box">{weeklyResult}</div>}
        </div>
      )}
    </div>
  )
}
