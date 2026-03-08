import React, { useState, useEffect } from 'react'
import { api } from '../api'

export default function LogWorkout() {
  const [date, setDate]         = useState(new Date().toISOString().split('T')[0])
  const [exercise, setExercise] = useState('')
  const [sets, setSets]         = useState('')
  const [reps, setReps]         = useState('')
  const [weight, setWeight]     = useState('')
  const [duration, setDuration] = useState('')
  const [history, setHistory]   = useState([])
  const [toast, setToast]       = useState('')
  const [loading, setLoading]   = useState(false)

  const loadHistory = () => api.getWorkouts().then(r => r.json()).then(setHistory).catch(() => {})
  useEffect(() => { loadHistory() }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await api.logWorkout({ date, exercise, sets: +sets, reps: +reps, weight: +weight, durationMinutes: +duration, user: { id: 1 } })
      showToast('Workout logged! 💪')
      setExercise(''); setSets(''); setReps(''); setWeight(''); setDuration('')
      loadHistory()
    } catch { showToast('Oops, try again 🥺') }
    setLoading(false)
  }

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000) }

  return (
    <div>
      <div className="page-header">
        <div className="page-title">💪 Log Your Workout</div>
        <div className="page-subtitle">Every rep counts — you're getting stronger! 🌸</div>
      </div>

      <div className="grid-2">
        <div className="card">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>📅 Date</label>
              <input type="date" value={date} onChange={e => setDate(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>🏋️ Exercise Name</label>
              <input placeholder="e.g. Dumbbell Rows" value={exercise} onChange={e => setExercise(e.target.value)} required />
            </div>
            <div className="grid-3">
              <div className="form-group">
                <label>Sets</label>
                <input type="number" placeholder="3" value={sets} onChange={e => setSets(e.target.value)} />
              </div>
              <div className="form-group">
                <label>Reps</label>
                <input type="number" placeholder="12" value={reps} onChange={e => setReps(e.target.value)} />
              </div>
              <div className="form-group">
                <label>Weight (kg)</label>
                <input type="number" step="0.5" placeholder="10" value={weight} onChange={e => setWeight(e.target.value)} />
              </div>
            </div>
            <div className="form-group">
              <label>⏱️ Duration (minutes)</label>
              <input type="number" placeholder="30" value={duration} onChange={e => setDuration(e.target.value)} />
            </div>
            <button className="btn btn-primary btn-full" disabled={loading}>
              {loading ? 'Saving... 🌸' : '✨ Log Workout'}
            </button>
          </form>
        </div>

        <div className="card">
          <div className="card-title">Recent Workouts 📋</div>
          {history.length > 0 ? (
            <table className="cute-table">
              <thead><tr><th>Date</th><th>Exercise</th><th>Sets×Reps</th><th>Dur</th></tr></thead>
              <tbody>
                {history.slice(0,8).map(w => (
                  <tr key={w.id}>
                    <td style={{ fontSize: '0.8rem' }}>{w.date}</td>
                    <td>{w.exercise}</td>
                    <td><span className="badge badge-mint">{w.sets}×{w.reps}</span></td>
                    <td>{w.durationMinutes}m</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="empty-state"><div className="empty-emoji">💪</div><p>No workouts logged yet!</p></div>
          )}
        </div>
      </div>
      {toast && <div className="toast">{toast}</div>}
    </div>
  )
}
