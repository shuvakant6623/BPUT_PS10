import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5500/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor for adding auth tokens if needed
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor for handling errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Server responded with error status
      console.error('API Error:', error.response.data)
      
      if (error.response.status === 401) {
        // Handle unauthorized access
        localStorage.removeItem('authToken')
        window.location.href = '/login'
      }
    } else if (error.request) {
      // Request made but no response received
      console.error('Network Error:', error.request)
    } else {
      console.error('Error:', error.message)
    }
    return Promise.reject(error)
  }
)

// API Methods
export const sensorAPI = {
  getCurrent: () => api.get('/sensors/current'),
  getHistory: (params) => api.get('/sensors/history', { params }),
  getById: (id) => api.get(`/sensors/${id}`),
}

export const analyticsAPI = {
  getPerformance: (params) => api.get('/analytics/performance', { params }),
  getPredictions: () => api.get('/analytics/predictions'),
  getTrends: (params) => api.get('/analytics/trends', { params }),
}

export const alertsAPI = {
  getAll: (params) => api.get('/alerts', { params }),
  acknowledge: (id) => api.post(`/alerts/${id}/acknowledge`),
  getUnread: () => api.get('/alerts/unread'),
}

export const devicesAPI = {
  getAll: () => api.get('/devices'),
  getById: (id) => api.get(`/devices/${id}`),
  update: (id, data) => api.put(`/devices/${id}`, data),
  calibrate: (id, data) => api.post(`/devices/${id}/calibrate`, data),
}

export const settingsAPI = {
  get: () => api.get('/settings'),
  update: (data) => api.put('/settings', data),
  getThresholds: () => api.get('/settings/thresholds'),
  updateThresholds: (data) => api.put('/settings/thresholds', data),
}

export default api