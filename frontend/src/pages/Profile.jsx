import React, { useState, useEffect } from 'react';
import { api } from '../api';

export default function Profile({ user, onUpdateUser }) {
  const [formData, setFormData] = useState({
    name: user?.name || '',
    age: user?.age || '',
    height: user?.height || '',
    currentWeight: user?.currentWeight || '',
    goalWeight: user?.goalWeight || '',
    sex: user?.sex || 'FEMALE',
    activityLevel: user?.activityLevel || 'SEDENTARY',
    targetCalories: user?.targetCalories || ''
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        age: user.age || '',
        height: user.height || '',
        currentWeight: user.currentWeight || '',
        goalWeight: user.goalWeight || '',
        sex: user.sex || 'FEMALE',
        activityLevel: user.activityLevel || 'SEDENTARY',
        targetCalories: user.targetCalories || ''
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const res = await api.updateProfile(formData);
      if (res.ok) {
        const updatedUser = await res.json();
        onUpdateUser(updatedUser);
        setMessage('Profile updated successfully! ✨');
      } else {
        setMessage('Failed to update profile. ❌');
      }
    } catch (err) {
      console.error(err);
      setMessage('An error occurred. ❌');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <header className="page-header">
        <h1 className="page-title">Your Wellness Profile 🌸</h1>
        <p className="page-subtitle">Configure your demographics to unlock accurate AI insights and metabolism tracking.</p>
      </header>

      <div className="card" style={{ maxWidth: 600, margin: '0 auto' }}>
        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '20px' }}>
          <div className="form-group">
            <label>Name</label>
            <input 
              type="text" name="name" value={formData.name} onChange={handleChange} 
              placeholder="Your name" required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <div className="form-group">
              <label>Age</label>
              <input 
                type="number" name="age" value={formData.age} onChange={handleChange} 
                placeholder="Years" required
              />
            </div>
            <div className="form-group">
              <label>Sex</label>
              <select name="sex" value={formData.sex} onChange={handleChange}>
                <option value="FEMALE">Female</option>
                <option value="MALE">Male</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <div className="form-group">
              <label>Height (cm)</label>
              <input 
                type="number" step="0.1" name="height" value={formData.height} onChange={handleChange} 
                placeholder="cm" required
              />
            </div>
            <div className="form-group">
              <label>Weight (kg)</label>
              <input 
                type="number" step="0.1" name="currentWeight" value={formData.currentWeight} onChange={handleChange} 
                placeholder="kg" required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Activity Level</label>
            <select name="activityLevel" value={formData.activityLevel} onChange={handleChange}>
              <option value="SEDENTARY">Sedentary (Little/no exercise)</option>
              <option value="LIGHT">Lightly Active (1-3 days/week)</option>
              <option value="MODERATE">Moderately Active (3-5 days/week)</option>
              <option value="ACTIVE">Very Active (6-7 days/week)</option>
              <option value="VERY_ACTIVE">Super Active (Physical job/2x Training)</option>
            </select>
          </div>

          <div className="form-group">
            <label>Goal Weight (kg)</label>
            <input 
              type="number" step="0.1" name="goalWeight" value={formData.goalWeight} onChange={handleChange} 
              placeholder="Target weight"
            />
          </div>

          <div className="form-group">
            <label>Daily Calorie Target (Optional)</label>
            <input 
              type="number" name="targetCalories" value={formData.targetCalories} onChange={handleChange} 
              placeholder="Leave blank for auto-calc based on TDEE"
            />
            <small style={{ color: 'var(--text-light)', marginTop: 4, display: 'block' }}>
              We'll calculate this automatically using your TDEE if you leave it blank.
            </small>
          </div>

          {message && (
            <div style={{ 
              padding: '12px', 
              borderRadius: '8px', 
              background: message.includes('❌') ? '#fff0f0' : '#f0fff4',
              color: message.includes('❌') ? '#e53e3e' : '#38a169',
              fontSize: '0.9rem',
              textAlign: 'center'
            }}>
              {message}
            </div>
          )}

          <button 
            type="submit" 
            className="btn btn-primary" 
            disabled={loading}
            style={{ width: '100%', marginTop: '10px' }}
          >
            {loading ? 'Saving Changes...' : 'Save Wellness Profile ✨'}
          </button>
        </form>
      </div>

      {user?.bmr && (
        <div style={{ marginTop: '30px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div className="card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-light)', fontWeight: 700, textTransform: 'uppercase' }}>Your BMR</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--pink-500)' }}>{Math.round(user.bmr)} <span style={{ fontSize: '0.9rem' }}>kcal/day</span></div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-light)', marginTop: 8 }}>Calories burned at complete rest.</p>
          </div>
          <div className="card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-light)', fontWeight: 700, textTransform: 'uppercase' }}>Your TDEE</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--pink-500)' }}>{Math.round(user.tdee)} <span style={{ fontSize: '0.9rem' }}>kcal/day</span></div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-light)', marginTop: 8 }}>Calories burned with your activity level.</p>
          </div>
        </div>
      )}
    </div>
  );
}
