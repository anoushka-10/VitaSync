import React, { useState, useEffect } from 'react'
import { api } from '../api'

export default function LogWeight() {
  const [date, setDate]     = useState(new Date().toISOString().split('T')[0])
  const [weight, setWeight] = useState('')
  const [history, setHistory] = useState([])
  const [toast, setToast]   = useState('')
  const [loading, setLoading] = useState(false)

  const loadHistory = () => api.getWeights().then(r => r.json()).then(setHistory).catch(() => {})

  useEffect(() => { loadHistory() }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await api.logWeight({ date, weight: parseFloat(weight), user: { id: 1 } })
      showToast('Weight logged! 💗')
      setWeight('')
      loadHistory()
    } catch { showToast('Oops, try again 🥺') }
    setLoading(false)
  }

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000) }

  return (
    <div>
      <div className="page-header">
        <div className="page-title">⚖️ Log Your Weight</div>
        <div className="page-subtitle">Track your journey, one day at a time 🌸</div>
      </div>

      <div className="grid-2">
        <div className="card">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>📅 Date</label>
              <input type="date" value={date} onChange={e => setDate(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>⚖️ Weight (kg)</label>
              <input type="number" step="0.1" placeholder="e.g. 70.2" value={weight} onChange={e => setWeight(e.target.value)} required />
            </div>
            <button className="btn btn-primary btn-full" disabled={loading}>
              {loading ? 'Saving... 🌸' : '✨ Log Weight'}
            </button>
          </form>
        </div>

        <div className="card">
          <div className="card-title">Weight History 📋</div>
          {history.length > 0 ? (
            <table className="cute-table">
              <thead><tr><th>Date</th><th>Weight</th></tr></thead>
              <tbody>
                {history.slice(0,10).map(w => (
                  <tr key={w.id}>
                    <td>{w.date}</td>
                    <td><span className="badge badge-pink">{w.weight} kg</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="empty-state"><div className="empty-emoji">⚖️</div><p>No entries yet!</p></div>
          )}
        </div>
      </div>

      {toast && <div className="toast">{toast}</div>}
    </div>
  )
}
