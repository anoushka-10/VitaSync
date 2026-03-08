import React, { useState, useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import Dashboard from './pages/Dashboard'
import LogWeight from './pages/LogWeight'
import LogMeal from './pages/LogMeal'
import LogWorkout from './pages/LogWorkout'
import LogSteps from './pages/LogSteps'
import LogCycle from './pages/LogCycle'
import CheckIn from './pages/CheckIn'
import AIInsight from './pages/AIInsight'
import Login from './pages/Login'
import Profile from './pages/Profile'
import { api, setUserId } from './api'

export default function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    console.log('DEBUG: Checking authentication...');
    try {
      const res = await api.getMe()
      console.log('DEBUG: Auth check response status:', res.status);
      if (res.ok) {
        const data = await res.json()
        console.log('DEBUG: Auth success, user data:', data);
        setUser(data)
        setUserId(data.id)
      } else {
        console.warn('DEBUG: Auth check failed (Not OK)');
        setUser(null)
      }
    } catch (err) {
      console.error('Auth check failed', err)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div style={{ 
        height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: '#fff5f7', color: '#ff6b8b', fontSize: '1.5rem', fontWeight: 'bold'
      }}>
        Loading your pink world... 🌸
      </div>
    )
  }

  if (!user) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    )
  }

  return (
    <div className={`app-layout ${sidebarOpen ? 'sidebar-open' : ''}`}>
      {/* Mobile Header */}
      <header className="mobile-header">
        <button className="menu-toggle" onClick={() => setSidebarOpen(true)}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
        </button>
        <div className="mobile-logo">🌸 The Girl Coded</div>
      </header>

      {/* Mobile Overlay */}
      {sidebarOpen && <div className="mobile-overlay" onClick={() => setSidebarOpen(false)}></div>}

      <Sidebar 
        user={user} 
        onLogout={() => setUser(null)} 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
      />
      <main className="main-content">
        <Routes>
          <Route path="/"          element={<Dashboard />} />
          <Route path="/weight"    element={<LogWeight />} />
          <Route path="/meal"      element={<LogMeal />} />
          <Route path="/workout"   element={<LogWorkout />} />
          <Route path="/steps"     element={<LogSteps />} />
          <Route path="/cycle"     element={<LogCycle />} />
          <Route path="/checkin"   element={<CheckIn />} />
          <Route path="/ai"        element={<AIInsight />} />
          <Route path="/profile"   element={<Profile user={user} onUpdateUser={setUser} />} />
          <Route path="*"          element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  )
}
