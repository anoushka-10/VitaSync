import React, { useState, useEffect } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { api } from '../api'

export default function LogSteps() {
  const [date, setDate]     = useState(new Date().toISOString().split('T')[0])
  const [steps, setSteps]   = useState('')
  const [history, setHistory] = useState([])
  const [toast, setToast]   = useState('')
  const [loading, setLoading] = useState(false)

  const loadHistory = () => api.getSteps().then(r => r.json()).then(setHistory).catch(() => {})
  useEffect(() => { loadHistory() }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await api.logSteps({ date, steps: +steps, user: { id: 1 } })
      showToast('Steps logged! 👟')
      setSteps('')
      loadHistory()
    } catch { showToast('Oops, try again 🥺') }
    setLoading(false)
  }

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000) }

  const chartData = [...history].reverse().slice(-10).map(s => ({ date: s.date?.slice(5), steps: s.steps }))

  return (
    <div>
      <div className="page-header">
        <div className="page-title">👟 Log Your Steps</div>
        <div className="page-subtitle">Every step is a step toward your goals 🌸</div>
      </div>

      <div className="grid-2">
        <div className="card">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>📅 Date</label>
              <input type="date" value={date} onChange={e => setDate(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>👟 Steps Count</label>
              <input type="number" placeholder="e.g. 8500" value={steps} onChange={e => setSteps(e.target.value)} required />
            </div>
            {steps && (
              <div style={{ marginBottom: 16, padding: '12px 16px', background: 'var(--pink-50)', borderRadius: 'var(--radius-md)', fontSize: '0.88rem', color: 'var(--text-mid)', fontWeight: 600 }}>
                {+steps >= 10000 ? '🔥 Amazing! 10k+ steps!' : +steps >= 7500 ? '💪 Great job! Almost there!' : +steps >= 5000 ? '👍 Good progress!' : '🚶 Keep moving!'}
              </div>
            )}
            <button className="btn btn-primary btn-full" disabled={loading}>
              {loading ? 'Saving... 🌸' : '✨ Log Steps'}
            </button>
          </form>
        </div>

        <div className="card">
          <div className="card-title mb-4">Steps History 📊</div>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,182,193,0.25)" />
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#b07898' }} />
                <YAxis tick={{ fontSize: 10, fill: '#b07898' }} />
                <Tooltip contentStyle={{ background: 'rgba(255,255,255,0.95)', border: '1.5px solid #ffb6c1', borderRadius: 14, fontFamily: 'Nunito' }} />
                <Bar dataKey="steps" fill="#ff85b3" radius={[6,6,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="empty-state"><div className="empty-emoji">👟</div><p>No steps logged yet!</p></div>
          )}
        </div>
      </div>
      {toast && <div className="toast">{toast}</div>}
    </div>
  )
}
