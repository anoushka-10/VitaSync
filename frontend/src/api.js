export const BASE_URL = import.meta.env.VITE_API_URL || 'https://vitasync.onrender.com';

// Current user state (set after login)
let currentUserId = 1; 

export const setUserId = (id) => {
    currentUserId = id;
};

const fetchWithCreds = (url, options = {}) => {
    return fetch(url, {
        ...options,
        credentials: 'include', // Important for session cookies
    });
};

export const api = {
    // Auth
    getMe: () => fetchWithCreds(`${BASE_URL}/users/me`),
    updateProfile: (data) => fetchWithCreds(`${BASE_URL}/users/me`, { 
        method: 'PUT', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    }),
    logout: () => fetchWithCreds(`${BASE_URL}/logout`, { method: 'POST' }),

    // Weight
    logWeight: (data) => fetchWithCreds(`${BASE_URL}/weights`, { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify({ ...data, user: { id: currentUserId } }) 
    }),
    getWeights: () => fetchWithCreds(`${BASE_URL}/weights/${currentUserId}`),
    getWeightAvg: () => fetchWithCreds(`${BASE_URL}/weights/${currentUserId}/average`),

    // Meals
    logMeal: (data) => fetchWithCreds(`${BASE_URL}/meals`, { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify({ ...data, user: { id: currentUserId } }) 
    }),
    smartLogMeal: (data) => fetchWithCreds(`${BASE_URL}/meals/smart-log`, { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify({ ...data, userId: String(currentUserId) }) 
    }),
    getMeals: () => fetchWithCreds(`${BASE_URL}/meals/${currentUserId}`),
    getMealSummary: (date) => fetchWithCreds(`${BASE_URL}/meals/${currentUserId}/summary/${date}`),

    // Workouts
    logWorkout: (data) => fetchWithCreds(`${BASE_URL}/workouts`, { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify({ ...data, user: { id: currentUserId } }) 
    }),
    getWorkouts: () => fetchWithCreds(`${BASE_URL}/workouts/${currentUserId}`),

    // Steps
    logSteps: (data) => fetchWithCreds(`${BASE_URL}/steps`, { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify({ ...data, user: { id: currentUserId } }) 
    }),
    getSteps: () => fetchWithCreds(`${BASE_URL}/steps/${currentUserId}`),

    // Cycle
    logCycle: (data) => fetchWithCreds(`${BASE_URL}/cycle`, { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify({ ...data, user: { id: currentUserId } }) 
    }),
    getCycle: () => fetchWithCreds(`${BASE_URL}/cycle/${currentUserId}/status`),

    // Check-in
    logCheckIn: (data) => fetchWithCreds(`${BASE_URL}/checkin`, { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify({ ...data, user: { id: currentUserId } }) 
    }),
    getCheckIn: (date) => fetchWithCreds(`${BASE_URL}/checkin/${currentUserId}/${date}`),

    // AI
    getNutrition: (meal) => fetchWithCreds(`${BASE_URL}/ai/nutrition`, { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify({ meal }) 
    }),
    getDailyInsight: (date) => fetchWithCreds(`${BASE_URL}/ai/insight`, { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify({ userId: String(currentUserId), date }) 
    }),
    getWeeklyReport: () => fetchWithCreds(`${BASE_URL}/ai/weekly-report/${currentUserId}`),

    // Analytics
    getDailyBalance: (date) => fetchWithCreds(`${BASE_URL}/analytics/daily-balance${date ? `?date=${date}` : ''}`),
    getMacroTrends: (days = 7) => fetchWithCreds(`${BASE_URL}/analytics/macro-trends?days=${days}`),
    getDeficitHistory: (days = 7) => fetchWithCreds(`${BASE_URL}/analytics/deficit-history?days=${days}`),
    getWeeklySummary: () => fetchWithCreds(`${BASE_URL}/analytics/weekly-summary`),
};
