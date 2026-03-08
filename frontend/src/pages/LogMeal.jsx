import React, { useState, useEffect } from 'react'
import { api } from '../api'

const today = new Date().toISOString().split('T')[0]
const mealIcon = { BREAKFAST: '🍳', LUNCH: '🍱', DINNER: '🌙', SNACK: '🍎' }

function MacroTag({ label, value, unit, color }) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      padding: '10px 14px', borderRadius: 14,
      background: color + '18', border: `1.5px solid ${color}33`, minWidth: 72
    }}>
      <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-dark)' }}>{value ?? '—'}</div>
      <div style={{ fontSize: '0.65rem', fontWeight: 700, color, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{unit}</div>
      <div style={{ fontSize: '0.7rem', color: 'var(--text-light)', fontWeight: 600 }}>{label}</div>
    </div>
  )
}

export default function LogMeal() {
  const [date, setDate]         = useState(today)
  const [mealType, setMealType] = useState('LUNCH')
  const [description, setDesc]  = useState('')
  const [meals, setMeals]       = useState([])
  const [summary, setSummary]   = useState(null)
  const [loading, setLoading]   = useState(false)
  const [lastLogged, setLastLogged] = useState(null)
  const [toast, setToast]       = useState('')

  const loadData = () => {
    api.getMeals().then(r => r.json()).then(setMeals).catch(() => {})
    api.getMealSummary(today).then(r => r.json()).then(setSummary).catch(() => {})
  }

  useEffect(() => { loadData() }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setLastLogged(null)
    try {
      const res  = await api.smartLogMeal({ userId: '1', date, mealType, description })
      const data = await res.json()
      if (!res.ok) {
        showToast('Error: ' + (data.message || 'Something went wrong 🥺'))
        setLoading(false)
        return
      }
      setLastLogged(data)
      setDesc('')
      showToast('Meal logged by AI! 🌸')
      loadData()
    } catch {
      showToast('Could not reach backend — is it running? 🥺')
    }
    setLoading(false)
  }

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 4000) }

  return (
    <div>
      <div className="page-header">
        <div className="page-title">🍱 Log Your Meal</div>
        <div className="page-subtitle">Just describe what you ate — AI will handle the macros 🤖</div>
      </div>

      {/* Today's macro summary */}
      {summary?.totalCalories > 0 && (
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 24 }}>
          <MacroTag label="Calories" value={summary.totalCalories} unit="kcal" color="#f87196" />
          <MacroTag label="Protein"  value={summary.totalProtein}  unit="g"    color="#7c83f5" />
          <MacroTag label="Carbs"    value={summary.totalCarbs}    unit="g"    color="#f5c842" />
          <MacroTag label="Fats"     value={summary.totalFats}     unit="g"    color="#4ecdc4" />
          <MacroTag label="Fiber"    value={summary.totalFiber}    unit="g"    color="#a8e063" />
          <div style={{ display: 'flex', alignItems: 'center', marginLeft: 4, fontSize: '0.8rem', color: 'var(--text-light)', fontWeight: 600 }}>
            Today's total
          </div>
        </div>
      )}

      <div className="grid-2">
        {/* Form */}
        <div className="card">
          <div style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text-dark)', marginBottom: 4 }}>
            Describe your meal
          </div>
          <div style={{ fontSize: '0.82rem', color: 'var(--text-light)', fontWeight: 500, marginBottom: 20 }}>
            Write naturally — "2 rotis with dal and sabzi" or "chicken biryani, medium plate"
          </div>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>📅 Date</label>
              <input type="date" value={date} onChange={e => setDate(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>🍽️ Meal Type</label>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {['BREAKFAST','LUNCH','DINNER','SNACK'].map(t => (
                  <button key={t} type="button"
                    className={`btn ${mealType === t ? 'btn-primary' : 'btn-soft'}`}
                    style={{ padding: '8px 14px', fontSize: '0.82rem' }}
                    onClick={() => setMealType(t)}>
                    {mealIcon[t]} {t.charAt(0) + t.slice(1).toLowerCase()}
                  </button>
                ))}
              </div>
            </div>
            <div className="form-group">
              <label>🥘 What did you eat?</label>
              <textarea rows="4" placeholder="e.g. 2 eggs scrambled with butter, 2 slices whole wheat toast, one cup chai with milk and sugar"
                value={description} onChange={e => setDesc(e.target.value)} required
                style={{ resize: 'vertical' }} />
            </div>
            <button className="btn btn-primary btn-full" disabled={loading}>
              {loading ? '🧠 AI is calculating your macros...' : '✨ Log Meal with AI'}
            </button>
          </form>
        </div>

        {/* AI Result */}
        <div>
          {loading && (
            <div className="card" style={{ marginBottom: 16 }}>
              <div className="loading">🤖 Gemini is estimating your macros + making assumptions...</div>
            </div>
          )}

          {lastLogged && (
            <div className="card" style={{ marginBottom: 16 }}>
              <div style={{ fontWeight: 800, fontSize: '1rem', marginBottom: 14, color: 'var(--text-dark)' }}>
                ✅ Meal saved!
              </div>
              {/* Macro display */}
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 16 }}>
                <MacroTag label="Calories" value={lastLogged.calories} unit="kcal" color="#f87196" />
                <MacroTag label="Protein"  value={lastLogged.protein}  unit="g"    color="#7c83f5" />
                <MacroTag label="Carbs"    value={lastLogged.carbs}    unit="g"    color="#f5c842" />
                <MacroTag label="Fats"     value={lastLogged.fats}     unit="g"    color="#4ecdc4" />
                <MacroTag label="Fiber"    value={lastLogged.fiber}    unit="g"    color="#a8e063" />
              </div>
              {/* AI notes */}
              {lastLogged.aiNotes && (
                <div style={{
                  background: '#fafafd', borderRadius: 14, padding: '14px 16px',
                  fontSize: '0.82rem', color: 'var(--text-mid)', lineHeight: 1.7,
                  fontWeight: 500, whiteSpace: 'pre-wrap',
                  borderLeft: '3px solid var(--pink-300)'
                }}>
                  {lastLogged.aiNotes}
                </div>
              )}
            </div>
          )}

          <div className="card">
            <div className="card-title" style={{ marginBottom: 12 }}>Recent Meals 📋</div>
            {meals.length > 0 ? (
              <table className="cute-table">
                <thead><tr><th>Date</th><th>Food</th><th>Type</th><th>Cal</th></tr></thead>
                <tbody>
                  {meals.slice(0, 8).map(m => (
                    <tr key={m.id}>
                      <td style={{ fontSize: '0.78rem' }}>{m.date}</td>
                      <td style={{ maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {m.foodName}
                      </td>
                      <td><span className="badge badge-pink">{mealIcon[m.mealType]}</span></td>
                      <td>{m.calories ?? '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="empty-state"><div className="empty-emoji">🍱</div><p>No meals logged yet!</p></div>
            )}
          </div>
        </div>
      </div>

      {toast && <div className="toast">{toast}</div>}
    </div>
  )
}
