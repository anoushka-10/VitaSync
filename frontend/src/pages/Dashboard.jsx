import React, { useState, useEffect } from 'react';
import { api } from '../api';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [dailyBalance, setDailyBalance] = useState({ consumed: 0, target: 2000, balance: 0 });
  const [macroTrends, setMacroTrends] = useState([]);
  const [cycleStatus, setCycleStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  // Interaction State
  const [selectedDayIndex, setSelectedDayIndex] = useState(null);
  const [timePeriod, setTimePeriod] = useState(7);
  const [todayCheckIn, setTodayCheckIn] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, [timePeriod]);

  const fetchDashboardData = async () => {
    try {
      const [userRes, balanceRes, trendsRes, cycleRes, checkInRes] = await Promise.all([
        api.getMe(),
        api.getDailyBalance(),
        api.getMacroTrends(timePeriod),
        api.getCycle(),
        api.getCheckIn(new Date().toISOString().split('T')[0])
      ]);

      if (userRes.ok) setUser(await userRes.json());
      if (balanceRes.ok) setDailyBalance(await balanceRes.json());
      if (trendsRes.ok) {
        const trends = await trendsRes.json();
        setMacroTrends(trends);
        if (trends.length > 0) {
          setSelectedDayIndex(trends.length - 1);
        }
      }
      if (cycleRes.ok) {
        setCycleStatus(await cycleRes.json());
      }
      if (checkInRes.ok) {
        setTodayCheckIn(await checkInRes.json());
      }
    } catch (err) {
      console.error('Failed to fetch dashboard data', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !user || macroTrends.length === 0) {
    return <div className="loading">Adjusting your metabolic lens... 🌸</div>;
  }

  const selectedDay = macroTrends[selectedDayIndex] || macroTrends[macroTrends.length - 1] || { protein: 0, carbs: 0, fats: 0, calories: 0 };

  // Refined Nutritional Targets (Weight-based protein g/kg)
  const proteinMultipliers = {
    'SEDENTARY': 0.8,
    'LIGHT': 1.0,
    'MODERATE': 1.3,
    'ACTIVE': 1.6,
    'VERY_ACTIVE': 2.0
  };
  
  const targetKcal = user?.tdee || 2000;
  const pFactor = proteinMultipliers[user?.activityLevel] || 1.2;
  const pTargetGrams = (user?.currentWeight || 70) * pFactor;
  
  const cTargetGrams = (targetKcal * 0.40) / 4; // Keeping balanced carbs/fats for now
  const fTargetGrams = (targetKcal * 0.30) / 9;

  const macroData = [
    {
      name: 'Protein',
      value: (selectedDay.protein || 0) * 4,
      grams: selectedDay.protein || 0,
      targetGrams: Math.round(pTargetGrams),
      color: '#ff3377'
    },
    {
      name: 'Carbs',
      value: (selectedDay.carbs || 0) * 4,
      grams: selectedDay.carbs || 0,
      targetGrams: Math.round(cTargetGrams),
      color: '#ffbd33'
    },
    {
      name: 'Fats',
      value: (selectedDay.fats || 0) * 9,
      grams: selectedDay.fats || 0,
      targetGrams: Math.round(fTargetGrams),
      color: '#33ffbd'
    }
  ];

  // Cycle Logic (Dynamic calculation)
  const calculateCycleDay = () => {
    if (!cycleStatus?.lastPeriodDate) return 14; // Fallback
    const lastDate = new Date(cycleStatus.lastPeriodDate);
    const today = new Date();
    const diffTime = Math.abs(today - lastDate);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return (diffDays % (cycleStatus.cycleLength || 28)) + 1;
  };

  const cycleDay = calculateCycleDay();
  const cyclePercent = ((cycleDay - 1) / (cycleStatus?.cycleLength || 28)) * 100;
  
  const getPhaseData = (day) => {
    if (day <= 5) return { name: 'Menstrual', color: '#ffafbd' };
    if (day <= 13) return { name: 'Follicular', color: '#ff8e9e' };
    if (day <= 16) return { name: 'Ovulatory', color: '#ffbd33' };
    return { name: 'Luteal', color: '#c3a6ff' };
  };
  const currentPhase = getPhaseData(cycleDay);

  return (
    <div className="dashboard-container">
      {/* Header */}
      <header className="dashboard-header flex-between">
        <div>
          <h1 className="greeting-text">Good morning, {user?.name?.split(' ')[0] || 'Anoushka'}! 🌸</h1>
          <p className="wellness-status">Your metabolic balance looks exceptional today.</p>
        </div>

        <div className="switcher-container">
          <div className="time-switcher">
            {[7, 14, 30].map(d => (
              <button
                key={d}
                className={`switch-btn ${timePeriod === d ? 'active' : ''}`}
                onClick={() => setTimePeriod(d)}
              >
                {d}D
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Main Metrics Grid */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-label"><span>⚖️</span> Weight</div>
          <div className="metric-value">{user?.currentWeight || '--'} <span className="metric-unit">kg</span></div>
          <div className="metric-trend" style={{ color: 'var(--text-muted)' }}>
            <span>🎯</span> Goal: {user?.goalWeight || '--'} kg
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-label"><span>🔥</span> Calories</div>
          <div className="metric-value">{Math.round(dailyBalance.consumed)} <span className="metric-unit">kcal</span></div>
          <div className="metric-trend" style={{ color: dailyBalance.balance > 0 ? '#f43f5e' : '#10b981', fontWeight: 700 }}>
            {Math.round(Math.abs(dailyBalance.balance))} kcal {dailyBalance.balance > 0 ? 'surplus' : 'deficit'}
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-label"><span>🍗</span> Protein</div>
          <div className="metric-value">{selectedDay.protein || 0} <span className="metric-unit">g</span></div>
          <div className="metric-trend" style={{ color: 'var(--text-muted)' }}>
            <span>🏁</span> Target: {Math.round(pTargetGrams)}g
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-label"><span>🌙</span> Sleep</div>
          <div className="metric-value">
            {todayCheckIn?.sleepHours || '7.5'} <span className="metric-unit">hrs</span>
          </div>
          <div className="metric-trend trend-up">
            <span>✨</span> {todayCheckIn ? 'Today\'s log' : 'Avg. Quality'}
          </div>
        </div>
      </div>

      {/* Analytics Section */}
      <div className="analytics-section">
        {/* Weight & Calorie Trends */}
        <div className="card chart-card">
          <div className="flex-between mb-6">
            <div>
              <h3 className="card-title">Metabolic Efficiency</h3>
              <p className="page-subtitle">Click a point to see daily breakdown</p>
            </div>
          </div>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <AreaChart
                data={macroTrends}
                onClick={(data) => {
                  if (data && data.activeTooltipIndex !== undefined) {
                    setSelectedDayIndex(data.activeTooltipIndex);
                  }
                }}
              >
                <defs>
                  <linearGradient id="colorCal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--pink-400)" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="var(--pink-400)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="date" hide />
                <YAxis hide />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="calories"
                  stroke="var(--pink-500)"
                  fillOpacity={1}
                  fill="url(#colorCal)"
                  strokeWidth={4}
                  activeDot={{ r: 8, fill: 'var(--pink-500)', stroke: 'white', strokeWidth: 3 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Macro Analytics */}
        <div className="card chart-card">
          <div className="flex-between">
            <h3 className="card-title">Macro Distribution</h3>
            <div className="badge badge-pink">{selectedDay.date || 'Today'}</div>
          </div>
          <p className="page-subtitle">Caloric contribution balance</p>

          <div className="macro-ring-container" style={{ position: 'relative', marginTop: 20 }}>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={macroData}
                  innerRadius={70}
                  outerRadius={95}
                  paddingAngle={8}
                  dataKey="value"
                  animationDuration={800}
                >
                  {macroData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div style={{
              position: 'absolute', top: '48%', left: '50%', transform: 'translate(-50%, -50%)',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--text-main)' }}>{Math.round(selectedDay.calories || 0)}</div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>kcal</div>
            </div>

            <div style={{ marginTop: 20, width: '100%' }}>
              {macroData.map(macro => (
                <div key={macro.name} className="flex-between mb-3" style={{ fontSize: '0.88rem' }}>
                  <div className="flex items-center gap-3">
                    <div style={{ width: 10, height: 10, borderRadius: '3px', background: macro.color }}></div>
                    <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>{macro.name}</span>
                  </div>
                  <div style={{ fontWeight: 800 }}>
                    {macro.grams}g <span style={{ color: 'var(--text-muted)', fontWeight: 600, marginLeft: 4 }}>
                      ({macro.targetGrams > 0 ? Math.round((macro.grams / macro.targetGrams) * 100) : 0}%)
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Cycle Trends (Moved Section) */}
      <section className="cycle-section" style={{ marginTop: 0 }}>
        <div className="card cycle-bar-container">
          <div className="cycle-bar-header">
            <div>
              <h3 className="card-title" style={{ fontSize: '1.2rem', color: 'var(--text-main)' }}>Cycle Trends</h3>
              <p className="page-subtitle">Hormonal phase tracking & symptom insights</p>
            </div>
            <div className="phase-legend">
              <div className="legend-item"><div className="legend-dot" style={{ background: '#ffafbd' }}></div> Menstrual</div>
              <div className="legend-item"><div className="legend-dot" style={{ background: '#ff8e9e' }}></div> Follicular</div>
              <div className="legend-item"><div className="legend-dot" style={{ background: '#ffe66d' }}></div> Ovulatory</div>
              <div className="legend-item"><div className="legend-dot" style={{ background: '#c3a6ff' }}></div> Luteal</div>
            </div>
          </div>

          <div className="cycle-progress-track">
            <div className="phase-segment segment-menstrual"></div>
            <div className="phase-segment segment-follicular"></div>
            <div className="phase-segment segment-ovulatory"></div>
            <div className="phase-segment segment-luteal"></div>
            <div 
              className="current-day-indicator" 
              style={{ 
                left: `${cyclePercent}%`,
                outlineColor: currentPhase.color,
                boxShadow: `0 0 15px ${currentPhase.color}88`
              }}
            ></div>
          </div>

          <div className="phase-details-grid">
            <div className={`phase-info-card ${cycleDay <= 5 ? 'active' : ''}`}>
              <span className="insight-icon">📺</span>
              <div className="phase-name" style={{ color: '#ffafbd' }}>Menstrual</div>
              <div className="phase-insight">Low Energy<br />Rest Focus</div>
            </div>
            <div className={`phase-info-card ${cycleDay > 5 && cycleDay <= 13 ? 'active' : ''}`}>
              <span className="insight-icon">📈</span>
              <div className="phase-name" style={{ color: '#ff8e9e' }}>Follicular</div>
              <div className="phase-insight">Rising Power<br />Strength Training</div>
            </div>
            <div className={`phase-info-card ${cycleDay > 13 && cycleDay <= 16 ? 'active' : ''}`}>
              <span className="insight-icon">⚡</span>
              <div className="phase-name" style={{ color: '#ffbd33' }}>Ovulatory</div>
              <div className="phase-insight">Peak Energy<br />High Intensity</div>
            </div>
            <div className={`phase-info-card ${cycleDay > 16 ? 'active' : ''}`}>
              <span className="insight-icon">🧘</span>
              <div className="phase-name" style={{ color: '#9933ff' }}>Luteal</div>
              <div className="phase-insight">Sensitive<br />Endurance & Yoga</div>
            </div>
          </div>
        </div>
      </section>

      {/* Daily Vitals */}
      <h3 className="card-title mb-6" style={{ fontSize: '1rem', color: 'var(--text-main)' }}>Daily Vitals</h3>
      <div className="vitals-row">
        <div className="vital-card-pill sleep">
          <div className="vital-icon-circle">🌙</div>
          <div>
            <div className="vital-label">Sleep Quality</div>
            <div className="vital-value">7h 45m <span className="vital-sub-value">(Deep)</span></div>
          </div>
        </div>
        <div className="vital-card-pill energy">
          <div className="vital-icon-circle">⚡</div>
          <div>
            <div className="vital-label">Energy Level</div>
            <div className="vital-value">High <span className="vital-sub-value">(Optimal)</span></div>
          </div>
        </div>
        <div className="vital-card-pill stress">
          <div className="vital-icon-circle">🧘</div>
          <div>
            <div className="vital-label">Stress Index</div>
            <div className="vital-value">Low <span className="vital-sub-value">(Resting)</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}
