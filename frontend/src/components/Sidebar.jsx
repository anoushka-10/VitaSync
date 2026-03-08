import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { api } from '../api'

const navItems = [
  {
    path: '/', label: 'Dashboard',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
  },
  {
    path: '/weight', label: 'Weight',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2h12"/><path d="M12 2v4"/><path d="M3 10a9 9 0 1 0 18 0"/><path d="M3 10h18"/></svg>
  },
  {
    path: '/meal', label: 'Nutrition',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3zm0 0v7"/></svg>
  },
  {
    path: '/workout', label: 'Workout',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M6.5 6.5h11"/><path d="M6.5 17.5h11"/><path d="M3 10h1a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H3"/><path d="M21 10h-1a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h1"/><path d="M5 6.5V17.5"/><path d="M19 6.5V17.5"/></svg>
  },
  {
    path: '/steps', label: 'Steps',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 4a2 2 0 1 1-4 0 2 2 0 0 1 4 0z"/><path d="M7.5 10.5c.5-1 1.5-2 2.5-2l2 .5 2 3-2 2H10l-2.5 5"/><path d="M14 12l2 1 1.5 4.5"/></svg>
  },
  {
    path: '/cycle', label: 'Cycle',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>
  },
  {
    path: '/checkin', label: 'Daily Check-in',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12l2 2 4-4"/><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M3 9h18"/></svg>
  },
  {
    path: '/ai', label: 'AI Insights',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a4 4 0 0 1 4 4c0 1.5-.8 2.8-2 3.5V11h-4V9.5A4 4 0 0 1 8 6a4 4 0 0 1 4-4z"/><path d="M10 11v2a2 2 0 0 0 4 0v-2"/><path d="M8 22v-3a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v3"/><path d="M6 22h12"/></svg>
  },
  {
    path: '/profile', label: 'Wellness Profile',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
  },
]

export default function Sidebar({ user, onLogout, isOpen, onClose }) {
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    try {
      await api.logout();
      onLogout();
    } catch (err) {
      console.error('Logout failed', err);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
      {/* Mobile Close Button */}
      <button className="mobile-close" onClick={onClose}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>

      {/* Logo */}
      <div style={{ padding: '4px 8px 28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: 'linear-gradient(135deg, var(--pink-400), var(--pink-500))',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem'
          }}>🌸</div>
          <div>
            <div style={{ fontFamily: 'var(--font-title)', fontSize: '0.95rem', color: 'var(--pink-500)', lineHeight: 1.1 }}>The Girl Coded</div>
            <div style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--text-light)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
              Premium Wellness
            </div>
          </div>
        </div>
      </div>

      <div className="nav-section-label">Menu</div>

      {navItems.map(({ path, icon, label }) => (
        <NavLink
          key={path}
          to={path}
          end={path === '/'}
          className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
          onClick={onClose}
        >
          <span className="nav-icon">{icon}</span>
          {label}
        </NavLink>
      ))}

      {/* User footer */}
      <div style={{ marginTop: 'auto' }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '14px 12px', borderRadius: 'var(--radius-md)',
          background: '#f8f8fc', position: 'relative'
        }}>
          <div style={{
            width: 34, height: 34, borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--pink-300), var(--pink-500))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'white', fontWeight: 800, fontSize: '0.85rem'
          }}>{user?.name?.[0] || 'U'}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-dark)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {user?.name || 'User'}
            </div>
            <div style={{ fontSize: '0.65rem', color: 'var(--text-light)', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {user?.email || 'Logged in ✨'}
            </div>
          </div>
          <button 
            onClick={handleLogout}
            disabled={isLoggingOut}
            style={{
              padding: '6px', cursor: isLoggingOut ? 'wait' : 'pointer', background: 'none', border: 'none', 
              color: 'var(--text-light)', display: 'flex', alignItems: 'center',
              opacity: isLoggingOut ? 0.5 : 1,
              transition: 'all 0.3s ease'
            }}
            title={isLoggingOut ? "Logging out..." : "Logout"}
          >
            <svg 
              width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"
              className={isLoggingOut ? "spin-slow" : ""}
              style={{ animation: isLoggingOut ? 'spin 2s linear infinite' : 'none' }}
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
          </button>
        </div>
      </div>
    </aside>
  )
}
