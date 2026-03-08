import React, { useState, useEffect } from 'react'
import { api } from '../api'

export default function CheckIn() {
  const today = new Date().toISOString().split('T')[0]
  const [energy, setEnergy]   = useState(7)
  const [mood, setMood]       = useState('Good')
  const [sleep, setSleep]     = useState('')
  const [stress, setStress]   = useState('Low')
  const [existing, setExisting] = useState(null)
  const [toast, setToast]     = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    api.getCheckIn(today).then(r => r.json()).then(d => { if (d.id) setExisting(d) }).catch(() => {})
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await api.logCheckIn({ date: today, energyLevel: +energy, mood, sleepHours: +sleep, stressLevel: stress, user: { id: 1 } })
      const data = await res.json()
      setExisting(data)
      showToast('Check-in logged! ✨')
    } catch { showToast('Oops, try again 🥺') }
    setLoading(false)
  }

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000) }

  const moods = ['Amazing 🥰', 'Good 😊', 'Okay 😐', 'Tired 😴', 'Anxious 😟', 'Sad 😢']
  const stressLevels = ['Low', 'Medium', 'High']

  return (
    <div>
      <div className="page-header">
        <div className="page-title">✨ Daily Check-in</div>
        <div className="page-subtitle">How are you feeling today, gorgeous? 💗</div>
      </div>

      <div className="grid-2">
        <div className="card">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>⚡ Energy Level — <strong style={{ color: 'var(--pink-500)' }}>{energy}/10</strong></label>
              <input type="range" min="1" max="10" value={energy} onChange={e => setEnergy(e.target.value)}
                style={{ accentColor: 'var(--pink-400)', cursor: 'pointer' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-light)' }}>
                <span>😴 Low</span><span>⚡ High</span>
              </div>
            </div>

            <div className="form-group">
              <label>😊 Mood</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 4 }}>
                {moods.map(m => (
                  <button key={m} type="button"
                    className={`btn ${mood === m.split(' ')[0] ? 'btn-primary' : 'btn-soft'}`}
                    style={{ padding: '8px 14px', fontSize: '0.82rem' }}
                    onClick={() => setMood(m.split(' ')[0])}>
                    {m}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label>🌙 Sleep Hours</label>
              <input type="number" step="0.5" min="0" max="12" placeholder="e.g. 7.5" value={sleep} onChange={e => setSleep(e.target.value)} required />
            </div>

            <div className="form-group">
              <label>🧘 Stress Level</label>
              <div style={{ display: 'flex', gap: 8 }}>
                {stressLevels.map(s => (
                  <button key={s} type="button"
                    className={`btn ${stress === s ? 'btn-primary' : 'btn-soft'}`}
                    style={{ flex: 1, padding: '10px 0', fontSize: '0.85rem' }}
                    onClick={() => setStress(s)}>
                    {s === 'Low' ? '🧘 Low' : s === 'Medium' ? '😤 Medium' : '🔥 High'}
                  </button>
                ))}
              </div>
            </div>

            <button className="btn btn-primary btn-full" disabled={loading}>
              {loading ? 'Saving... 🌸' : '✨ Save Check-in'}
            </button>
          </form>
        </div>

        <div>
          {existing && (
            <div className="card">
              <div className="card-title">Today's Check-in ✅</div>
              <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-light)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>Energy</div>
                  <div style={{ display: 'flex', gap: 4 }}>
                    {Array.from({ length: 10 }, (_, i) => (
                      <div key={i} style={{ width: 20, height: 20, borderRadius: 6, background: i < existing.energyLevel ? 'var(--pink-300)' : 'var(--pink-100)' }} />
                    ))}
                  </div>
                </div>
                <div className="flex-between">
                  <span style={{ color: 'var(--text-mid)', fontWeight: 600 }}>Mood</span>
                  <span className="badge badge-pink">😊 {existing.mood}</span>
                </div>
                <div className="flex-between">
                  <span style={{ color: 'var(--text-mid)', fontWeight: 600 }}>Sleep</span>
                  <span className="badge badge-lilac">🌙 {existing.sleepHours}h</span>
                </div>
                <div className="flex-between">
                  <span style={{ color: 'var(--text-mid)', fontWeight: 600 }}>Stress</span>
                  <span className="badge badge-mint">🧘 {existing.stressLevel}</span>
                </div>
              </div>
            </div>
          )}

          <div className="card mt-4" style={{ background: 'linear-gradient(135deg, #fff0f5, #f5e6ff)' }}>
            <div style={{ fontSize: '1.5rem', marginBottom: 8 }}>💗</div>
            <div style={{ fontWeight: 700, color: 'var(--text-dark)', marginBottom: 6 }}>Daily Affirmation</div>
            <div style={{ color: 'var(--text-mid)', fontStyle: 'italic', lineHeight: 1.6 }}>
              "You are strong, capable, and worthy of all the love and care you give yourself today."
            </div>
          </div>
        </div>
      </div>
      {toast && <div className="toast">{toast}</div>}
    </div>
  )
}
