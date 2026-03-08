import React, { useState, useEffect } from 'react'
import { api } from '../api'

export default function LogCycle() {
  const [lastPeriodDate, setLastPeriodDate] = useState('')
  const [cycleLength, setCycleLength]       = useState('28')
  const [current, setCurrent]               = useState(null)
  const [toast, setToast]                   = useState('')
  const [loading, setLoading]               = useState(false)

  useEffect(() => {
    api.getCycle().then(r => r.json()).then(d => { if (d.lastPeriodDate) setCurrent(d) }).catch(() => {})
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await api.logCycle({ lastPeriodDate, cycleLength: +cycleLength, user: { id: 1 } })
      const data = await res.json()
      setCurrent(data)
      showToast('Cycle updated! 🌙')
    } catch { showToast('Oops, try again 🥺') }
    setLoading(false)
  }

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000) }

  // Compute days since last period
  const daysSince = current?.lastPeriodDate
    ? Math.floor((new Date() - new Date(current.lastPeriodDate)) / 86400000)
    : null

  const getPhaseGuess = (days, len) => {
    if (days === null) return null
    if (days <= 5)  return { phase: 'Menstrual 🩸',   tip: 'Rest, stay warm, and be gentle with yourself 💗', color: '#ffb6c1', bg: 'var(--pink-100)' }
    if (days <= 13) return { phase: 'Follicular 🌱',  tip: 'Energy rising! Great time for new workouts 💪',   color: '#5ecfa0', bg: 'var(--mint)' }
    if (days <= 16) return { phase: 'Ovulation 🌸',   tip: 'Peak energy! Push your workouts today 🔥',        color: '#f0a07c', bg: 'var(--peach)' }
    if (days < len) return { phase: 'Luteal 🌙',      tip: 'Energy may dip. Lighter workouts & self-care 🛁', color: '#c48fe8', bg: 'var(--lilac)' }
    return { phase: 'New Cycle 🌸', tip: 'Your next cycle may be starting soon!', color: '#ff85b3', bg: 'var(--pink-100)' }
  }

  const phaseInfo = daysSince !== null ? getPhaseGuess(daysSince, +(current?.cycleLength ?? 28)) : null

  return (
    <div>
      <div className="page-header">
        <div className="page-title">🌙 Cycle Tracker</div>
        <div className="page-subtitle">Understanding your body's rhythm 💗</div>
      </div>

      <div className="grid-2">
        <div className="card">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>🩸 Last Period Start Date</label>
              <input type="date" value={lastPeriodDate} onChange={e => setLastPeriodDate(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>📅 Average Cycle Length (days)</label>
              <input type="number" min="21" max="40" value={cycleLength} onChange={e => setCycleLength(e.target.value)} />
            </div>
            <button className="btn btn-primary btn-full" disabled={loading}>
              {loading ? 'Saving... 🌸' : '✨ Save Cycle'}
            </button>
          </form>
        </div>

        <div>
          {phaseInfo && (
            <div className="card mb-6" style={{ borderLeft: `4px solid ${phaseInfo.color}` }}>
              <div className="card-title">Current Phase ✨</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-dark)', margin: '8px 0' }}>
                {phaseInfo.phase}
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-mid)', fontWeight: 600, marginBottom: 12 }}>
                Day {daysSince + 1} of your cycle
              </div>
              <div style={{ background: phaseInfo.bg, padding: '12px 16px', borderRadius: 'var(--radius-md)', fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-dark)' }}>
                💡 {phaseInfo.tip}
              </div>
              <div style={{ marginTop: 12, fontSize: '0.8rem', color: 'var(--text-light)', fontStyle: 'italic' }}>
                * This is an estimated phase based on your logged date. Use the AI Insights page for a personalized analysis!
              </div>
            </div>
          )}

          {current && (
            <div className="card">
              <div className="card-title">Logged Data 📋</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 10 }}>
                <div className="flex-between">
                  <span style={{ color: 'var(--text-mid)', fontWeight: 600 }}>Last Period</span>
                  <span className="badge badge-pink">{current.lastPeriodDate}</span>
                </div>
                <div className="flex-between">
                  <span style={{ color: 'var(--text-mid)', fontWeight: 600 }}>Cycle Length</span>
                  <span className="badge badge-lilac">{current.cycleLength} days</span>
                </div>
                <div className="flex-between">
                  <span style={{ color: 'var(--text-mid)', fontWeight: 600 }}>Next Period (est.)</span>
                  <span className="badge badge-peach">
                    {new Date(new Date(current.lastPeriodDate).getTime() + current.cycleLength * 86400000).toISOString().split('T')[0]}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      {toast && <div className="toast">{toast}</div>}
    </div>
  )
}
